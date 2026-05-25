<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use App\Models\PriceSet;
use App\Models\PriceSetAssignment;
use App\Models\PriceSetItem;

class PricingService
{
    /**
     * B2B wholesale pricing only applies after admin approval.
     */
    private function isApprovedB2b(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        return ($user->role === 'b2b_buyer' || $user->role === 'b2b')
            && $user->b2b_status === 'approved';
    }

    /**
     * Resolve the price for a product and user based on priority:
     * 1. Buyer-specific price set
     * 2. Global sale price set (all_b2b)
     * 3. Wholesale price (if b2b user)
     * 4. Retail price (fallback)
     */
    public function resolvePrice(Product $product, ?User $user): float
    {
        return $this->resolvePriceDetailed($product, $user)['resolved_price'];
    }

    /**
     * Batch resolve prices for a collection of products.
     * Dramatically reduces database queries by fetching all relevant PriceSetItems at once.
     */
    public function resolvePricesForCollection($products, ?User $user)
    {
        if ($products->isEmpty()) return $products;

        $productIds = $products->pluck('id')->toArray();
        $buyerSpecificItems = collect();
        $globalSaleItems = collect();

        if ($user) {
            // 1. Pre-fetch Buyer-specific price set items for all products in this collection
            if ($this->isApprovedB2b($user)) {
                $buyerSpecificItems = PriceSetItem::whereIn('product_id', $productIds)
                ->whereHas('priceSet', function ($query) {
                    $query->active()->where('type', 'buyer_specific');
                })
                ->whereHas('priceSet.assignments', function ($query) use ($user) {
                    $query->where('user_id', $user->id)->where('scope', 'buyer_specific');
                })
                ->get()
                ->keyBy('product_id');
            }

            // 2. Pre-fetch Global sale price set items (all_b2b)
            if ($this->isApprovedB2b($user)) {
                $globalSaleItems = PriceSetItem::whereIn('product_id', $productIds)
                    ->whereHas('priceSet', function ($query) {
                        $query->active()->where('type', 'global_sale');
                    })
                    ->whereHas('priceSet.assignments', function ($query) {
                        $query->where('scope', 'all_b2b');
                    })
                    ->get()
                    ->keyBy('product_id');
            }
        }

        // Apply logic to each product using the pre-fetched collections
        foreach ($products as $product) {
            if ($user && isset($buyerSpecificItems[$product->id])) {
                $product->resolved_price = (float) $buyerSpecificItems[$product->id]->override_price;
            } elseif ($user && isset($globalSaleItems[$product->id])) {
                $product->resolved_price = (float) $globalSaleItems[$product->id]->override_price;
            } elseif ($user && $this->isApprovedB2b($user) && $product->base_wholesale_price > 0) {
                $product->resolved_price = (float) $product->base_wholesale_price;
            } else {
                $product->resolved_price = (float) ($product->base_retail_price ?: $product->price);
            }
        }

        return $products;
    }

    /**
     * Resolve the price with metadata about which rule was applied.
     */
    public function resolvePriceDetailed(Product $product, ?User $user): array
    {
        // 1. Buyer-specific price set
        if ($user && $this->isApprovedB2b($user)) {
            $specificPrice = PriceSetItem::where('product_id', $product->id)
                ->whereHas('priceSet', function ($query) {
                    $query->active()->where('type', 'buyer_specific');
                })
                ->whereHas('priceSet.assignments', function ($query) use ($user) {
                    $query->where('user_id', $user->id)->where('scope', 'buyer_specific');
                })
                ->with('priceSet')
                ->first();

            if ($specificPrice) {
                return [
                    'resolved_price' => (float) $specificPrice->override_price,
                    'rule_applied' => 'buyer_specific',
                    'price_set_name' => $specificPrice->priceSet->name
                ];
            }
        }

        // 2. Global sale price set (all_b2b scope)
        if ($user && $this->isApprovedB2b($user)) {
            $globalSalePrice = PriceSetItem::where('product_id', $product->id)
                ->whereHas('priceSet', function ($query) {
                    $query->active()->where('type', 'global_sale');
                })
                ->whereHas('priceSet.assignments', function ($query) {
                    $query->where('scope', 'all_b2b');
                })
                ->with('priceSet')
                ->first();

            if ($globalSalePrice) {
                return [
                    'resolved_price' => (float) $globalSalePrice->override_price,
                    'rule_applied' => 'global_sale',
                    'price_set_name' => $globalSalePrice->priceSet->name
                ];
            }
        }

        // 3. B2B wholesale price
        if ($user && $this->isApprovedB2b($user) && $product->base_wholesale_price > 0) {
            return [
                'resolved_price' => (float) $product->base_wholesale_price,
                'rule_applied' => 'b2b_wholesale',
                'price_set_name' => null
            ];
        }

        // 4. Retail price (fallback)
        return [
            'resolved_price' => (float) ($product->base_retail_price ?: $product->price),
            'rule_applied' => 'retail',
            'price_set_name' => null
        ];
    }
}
