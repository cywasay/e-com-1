<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\PricingService;
use App\Services\PublicProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Webhook;

class CheckoutController extends Controller
{
    public function __construct(
        protected PricingService $pricingService,
        protected PublicProductService $publicProductService,
    ) {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createSession(Request $request)
    {
        $user = $request->user();
        $items = $request->input('items', []);
        $shippingAddress = $request->input('shipping_address');

        if (!$this->publicProductService->canUseCheckout($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Checkout is not available for your account type. Please use the quote flow.',
            ], 403);
        }

        if (empty($items)) {
            return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
        }

        $lineItems = [];
        foreach ($items as $item) {
            $product = Product::find($item['product_id'] ?? null);

            if (!$product) {
                return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
            }

            $quantity = (int) ($item['quantity'] ?? 1);
            $error = $this->publicProductService->validateCheckoutItem($product, $quantity, $user);

            if ($error) {
                return response()->json(['success' => false, 'message' => $error], 422);
            }

            $validatedPrice = $this->pricingService->resolvePrice($product, $user);

            $lineItems[] = [
                'price_data' => [
                    'currency' => config('services.stripe.currency', 'aed'),
                    'product_data' => [
                        'name' => $product->name,
                        'metadata' => [
                            'product_id' => $product->id,
                            'variant_id' => $item['variant_id'] ?? null,
                        ],
                    ],
                    'unit_amount' => (int) round($validatedPrice * 100),
                ],
                'quantity' => $quantity,
            ];
        }

        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => $frontendUrl . '/order/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $frontendUrl . '/cart',
                'customer_email' => $user->email,
                'metadata' => [
                    'user_id' => $user->id,
                    'buyer_type' => $user->role === User::ROLE_B2B_BUYER ? 'b2b' : 'b2c',
                    'shipping_address' => json_encode($shippingAddress),
                ],
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'checkout_url' => $session->url,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe Session Error: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function verifySession(Request $request, string $sessionId)
    {
        $user = $request->user();

        try {
            $session = Session::retrieve($sessionId);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Invalid checkout session.'], 404);
        }

        if ((string) ($session->metadata->user_id ?? '') !== (string) $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized session.'], 403);
        }

        if ($session->payment_status !== 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Payment not completed yet.',
                'data' => ['payment_status' => $session->payment_status],
            ], 422);
        }

        $order = Order::where('stripe_checkout_session', $sessionId)
            ->orWhere('stripe_payment_intent', $session->payment_intent)
            ->with('items')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'session_id' => $sessionId,
                'payment_status' => $session->payment_status,
                'amount_total' => $session->amount_total / 100,
                'currency' => strtoupper($session->currency ?? 'AED'),
                'order' => $order,
            ],
        ]);
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $this->processOrder($session);
        }

        return response()->json(['status' => 'success']);
    }

    protected function processOrder($session)
    {
        if (Order::where('stripe_checkout_session', $session->id)->exists()) {
            return;
        }

        if ($session->payment_intent && Order::where('stripe_payment_intent', $session->payment_intent)->exists()) {
            return;
        }

        DB::transaction(function () use ($session) {
            $userId = $session->metadata->user_id;
            $buyerType = $session->metadata->buyer_type;
            $shippingAddress = json_decode($session->metadata->shipping_address, true);

            $order = Order::create([
                'customer_id' => $userId,
                'buyer_type' => $buyerType,
                'stripe_checkout_session' => $session->id,
                'stripe_payment_intent' => $session->payment_intent,
                'total_amount' => $session->amount_total / 100,
                'shipping_address' => $shippingAddress,
                'status' => 'pending',
            ]);

            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
            $lineItems = $stripe->checkout->sessions->allLineItems($session->id, ['expand' => ['data.price.product']]);

            foreach ($lineItems->data as $item) {
                $productData = $item->price->product->metadata;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productData->product_id,
                    'variant_id' => $productData->variant_id ?? null,
                    'quantity' => $item->quantity,
                    'unit_price_snapshot' => $item->price->unit_amount / 100,
                    'line_total' => $item->amount_total / 100,
                ]);
            }

            CartItem::where('user_id', $userId)->delete();
        });
    }
}
