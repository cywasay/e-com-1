<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class PublicProductService
{
    public function isApprovedB2b(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        $role = $user->role;
        $status = $user->b2b_status ?? $user->approval_status;

        return in_array($role, [User::ROLE_B2B_BUYER, 'b2b'], true)
            && $status === User::STATUS_APPROVED;
    }

    public function canUseCheckout(?User $user): bool
    {
        if (!$user) {
            return false;
        }

        if ($this->isApprovedB2b($user)) {
            return false;
        }

        return in_array($user->role, [User::ROLE_B2C_CUSTOMER, 'b2c_customer', 'customer'], true);
    }

    public function applyStorefrontScope(Builder $query, ?User $user): Builder
    {
        $query->where('status', 'published')
            ->whereNotNull('name')
            ->where(function ($q) {
                $q->whereNotNull('base_retail_price')
                    ->orWhereNotNull('price');
            });

        $this->applyVisibilityScope($query, $user);

        return $query;
    }

    public function applyVisibilityScope(Builder $query, ?User $user): void
    {
        if ($this->isApprovedB2b($user)) {
            $query->where(function ($q) {
                $q->whereIn('visibility', ['both', 'b2b_only', 'b2c_only'])
                    ->orWhereNull('visibility');
            });

            return;
        }

        $query->where(function ($q) {
            $q->whereIn('visibility', ['both', 'b2c_only'])
                ->orWhereNull('visibility');
        });
    }

    public function isProductVisibleTo(Product $product, ?User $user): bool
    {
        $visibility = $product->visibility ?: 'both';

        if (in_array($visibility, ['both', ''], true)) {
            return true;
        }

        if ($visibility === 'b2c_only') {
            return !$this->isApprovedB2b($user);
        }

        if ($visibility === 'b2b_only') {
            return $this->isApprovedB2b($user);
        }

        return true;
    }

    public function sanitizeProduct(Product $product, ?User $user): Product
    {
        $hidden = [
            'base_cost',
            'margin_percentage',
            'tax_percentage',
            'handling_fee',
        ];

        if (!$this->isApprovedB2b($user)) {
            $hidden[] = 'base_wholesale_price';
        }

        $product->makeHidden($hidden);

        return $product;
    }

    public function sanitizeCollection($products, ?User $user)
    {
        foreach ($products as $product) {
            $this->sanitizeProduct($product, $user);
        }

        return $products;
    }

    public function validateCheckoutItem(Product $product, int $quantity, ?User $user): ?string
    {
        if ($product->status !== 'published') {
            return 'Product is not available for purchase.';
        }

        if (!$this->isProductVisibleTo($product, $user)) {
            return "Product \"{$product->name}\" is not available for your account type.";
        }

        $moq = max(1, (int) ($product->moq ?? 1));
        if ($quantity < $moq) {
            return "Minimum order quantity for {$product->name} is {$moq}.";
        }

        if ($product->track_inventory && !$product->continue_selling_when_out_of_stock) {
            $stock = (int) ($product->stock_qty ?? 0);
            if ($stock < $quantity) {
                return "Insufficient stock for {$product->name}.";
            }
        }

        return null;
    }
}
