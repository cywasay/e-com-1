<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\PricingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Webhook;

class CheckoutController extends Controller
{
    protected $pricingService;

    public function __construct(PricingService $pricingService)
    {
        $this->pricingService = $pricingService;
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createSession(Request $request)
    {
        $user = $request->user();
        $items = $request->input('items', []);
        $shippingAddress = $request->input('shipping_address');

        if (empty($items)) {
            return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
        }

        $lineItems = [];
        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            
            // Validate price server-side
            $validatedPrice = $this->pricingService->resolvePrice($product, $user);
            
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'aed', // Default to AED as per UAE context
                    'product_data' => [
                        'name' => $product->name,
                        'metadata' => [
                            'product_id' => $product->id,
                            'variant_id' => $item['variant_id'] ?? null,
                        ],
                    ],
                    'unit_amount' => (int) ($validatedPrice * 100), // Stripe uses cents/fils
                ],
                'quantity' => $item['quantity'],
            ];
        }

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => 'http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:3000/cart',
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
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe Session Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
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
        DB::transaction(function () use ($session) {
            $userId = $session->metadata->user_id;
            $buyerType = $session->metadata->buyer_type;
            $shippingAddress = json_decode($session->metadata->shipping_address, true);

            // Create Order
            $order = Order::create([
                'customer_id' => $userId,
                'buyer_type' => $buyerType,
                'stripe_payment_intent' => $session->payment_intent,
                'total_amount' => $session->amount_total / 100,
                'shipping_address' => $shippingAddress,
                'status' => 'pending',
            ]);

            // Retrieve line items from Stripe to get product details
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

            // Clear cart
            CartItem::where('user_id', $userId)->delete();
        });
    }
}
