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
     * Resolve the price with metadata about which rule was applied.
     */
    public function resolvePriceDetailed(Product $product, ?User $user): array
    {
        // 1. Buyer-specific price set
        if ($user) {
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
        if ($user && ($user->role === 'b2b_buyer' || $user->role === 'b2b')) {
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
        if ($user && ($user->role === 'b2b_buyer' || $user->role === 'b2b') && $product->base_wholesale_price > 0) {
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
