<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Auth (public) ──────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login',    [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::post('/quotes', [\App\Http\Controllers\Api\QuoteController::class, 'store']);
    Route::post('/webhooks/stripe', [\App\Http\Controllers\Api\CheckoutController::class, 'handleWebhook']);

    // ── Public Storefront Endpoints ───────────────────────────────
    Route::get('/products', [\App\Http\Controllers\Api\ProductController::class, 'indexPublic']);
    Route::get('/products/slug/{slug}', [\App\Http\Controllers\Api\ProductController::class, 'showBySlug']);
    Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'indexPublic']);
    Route::get('/categories/{slug}', [\App\Http\Controllers\Api\CategoryController::class, 'showBySlug']);
    Route::get('/search', \App\Http\Controllers\Api\SearchController::class);
    Route::get('/blog', [\App\Http\Controllers\Api\BlogController::class, 'indexPublic']);
    Route::get('/blog/{slug}', [\App\Http\Controllers\Api\BlogController::class, 'showPublic']);
    Route::get('/case-studies', [\App\Http\Controllers\Api\CaseStudyController::class, 'indexPublic']);
    Route::get('/case-studies/{slug}', [\App\Http\Controllers\Api\CaseStudyController::class, 'showPublic']);
    Route::get('/catalogs', [\App\Http\Controllers\Api\CatalogController::class, 'indexPublic']);
    Route::get('/settings/public', [\App\Http\Controllers\Api\SettingsController::class, 'publicSettings']);

    // ── Auth (protected) ───────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me',      [AuthController::class, 'me']);
        Route::post('/checkout/session', [\App\Http\Controllers\Api\CheckoutController::class, 'createSession']);
        Route::get('/checkout/session/{sessionId}', [\App\Http\Controllers\Api\CheckoutController::class, 'verifySession']);

        // Admin Routes
        Route::middleware('role:super_admin,admin_staff')->group(function () {
            Route::get('/admin/dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);
            // Categories
            Route::get('/admin/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
            Route::post('/admin/categories', [\App\Http\Controllers\Api\CategoryController::class, 'store']);
            Route::put('/admin/categories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'update']);
            Route::delete('/admin/categories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'destroy']);

            // Products
            Route::get('/admin/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);
            Route::get('/admin/products/cleanup', [\App\Http\Controllers\Api\ProductController::class, 'cleanup'])->middleware('role:super_admin');
            Route::post('/admin/products/import', [\App\Http\Controllers\Api\ProductController::class, 'import']);
            Route::get('/admin/products/import/template', [\App\Http\Controllers\Api\ProductController::class, 'downloadTemplate']);
            Route::get('/admin/products/{id}', [\App\Http\Controllers\Api\ProductController::class, 'show']);
            Route::post('/admin/products', [\App\Http\Controllers\Api\ProductController::class, 'store']);
            Route::put('/admin/products/{id}', [\App\Http\Controllers\Api\ProductController::class, 'update']);
            Route::delete('/admin/products/{id}', [\App\Http\Controllers\Api\ProductController::class, 'destroy']);

            // Product Variants
            Route::get('/admin/products/{id}/variants', [\App\Http\Controllers\Api\ProductController::class, 'listVariants']);
            Route::post('/admin/products/{id}/variants', [\App\Http\Controllers\Api\ProductController::class, 'storeVariant']);
            Route::put('/admin/products/{id}/variants/{variantId}', [\App\Http\Controllers\Api\ProductController::class, 'updateVariant']);
            Route::delete('/admin/products/{id}/variants/{variantId}', [\App\Http\Controllers\Api\ProductController::class, 'destroyVariant']);

            // Product Images
            Route::post('/admin/products/{id}/images', [\App\Http\Controllers\Api\ProductController::class, 'storeImages']);
            Route::put('/admin/products/{id}/images/{imageId}/primary', [\App\Http\Controllers\Api\ProductController::class, 'setPrimaryImage']);
            Route::delete('/admin/products/{id}/images/{imageId}', [\App\Http\Controllers\Api\ProductController::class, 'destroyImage']);

            // B2B Applications (Admin)
            Route::get('/admin/b2b-applications', [\App\Http\Controllers\Api\B2bApplicationController::class, 'index']);
            Route::get('/admin/b2b-applications/{id}', [\App\Http\Controllers\Api\B2bApplicationController::class, 'show']);
            Route::put('/admin/b2b-applications/{id}/approve', [\App\Http\Controllers\Api\B2bApplicationController::class, 'approve'])->middleware('role:super_admin');
            Route::put('/admin/b2b-applications/{id}/reject', [\App\Http\Controllers\Api\B2bApplicationController::class, 'reject'])->middleware('role:super_admin');

            // Orders (Admin)
            Route::get('/admin/orders', [\App\Http\Controllers\Api\OrderController::class, 'index']);
            Route::get('/admin/orders/{id}', [\App\Http\Controllers\Api\OrderController::class, 'show']);
            Route::put('/admin/orders/{id}/status', [\App\Http\Controllers\Api\OrderController::class, 'updateStatus']);

            // Price Sets (Admin)
            Route::get('/admin/price-sets', [\App\Http\Controllers\Api\PriceSetController::class, 'index']);
            Route::post('/admin/price-sets', [\App\Http\Controllers\Api\PriceSetController::class, 'store']);
            Route::get('/admin/price-sets/{id}', [\App\Http\Controllers\Api\PriceSetController::class, 'show']);
            Route::put('/admin/price-sets/{id}', [\App\Http\Controllers\Api\PriceSetController::class, 'update']);
            Route::post('/admin/price-sets/{id}/items', [\App\Http\Controllers\Api\PriceSetController::class, 'addItem']);
            Route::delete('/admin/price-sets/{id}/items/{itemId}', [\App\Http\Controllers\Api\PriceSetController::class, 'removeItem']);
            Route::post('/admin/price-sets/{id}/assignments', [\App\Http\Controllers\Api\PriceSetController::class, 'assign']);
            Route::delete('/admin/price-sets/{id}/assignments/{assignmentId}', [\App\Http\Controllers\Api\PriceSetController::class, 'unassign']);
            Route::post('/admin/pricing/preview', [\App\Http\Controllers\Api\PriceSetController::class, 'previewPrice']);

            // Quotes (Admin)
            Route::get('/admin/quotes', [\App\Http\Controllers\Api\QuoteController::class, 'index']);
            Route::put('/admin/quotes/{id}/status', [\App\Http\Controllers\Api\QuoteController::class, 'updateStatus']);

            // Blog (Admin)
            Route::get('/admin/blog', [\App\Http\Controllers\Api\BlogController::class, 'indexAdmin']);
            Route::post('/admin/blog', [\App\Http\Controllers\Api\BlogController::class, 'store']);
            Route::put('/admin/blog/{id}', [\App\Http\Controllers\Api\BlogController::class, 'update']);
            Route::delete('/admin/blog/{id}', [\App\Http\Controllers\Api\BlogController::class, 'destroy']);

            // Case Studies (Admin)
            Route::get('/admin/case-studies', [\App\Http\Controllers\Api\CaseStudyController::class, 'indexAdmin']);
            Route::post('/admin/case-studies', [\App\Http\Controllers\Api\CaseStudyController::class, 'store']);
            Route::put('/admin/case-studies/{id}', [\App\Http\Controllers\Api\CaseStudyController::class, 'update']);
            Route::delete('/admin/case-studies/{id}', [\App\Http\Controllers\Api\CaseStudyController::class, 'destroy']);

            // Catalogs (Admin)
            Route::get('/admin/catalogs', [\App\Http\Controllers\Api\CatalogController::class, 'indexAdmin']);
            Route::post('/admin/catalogs', [\App\Http\Controllers\Api\CatalogController::class, 'store']);
            Route::put('/admin/catalogs/{id}', [\App\Http\Controllers\Api\CatalogController::class, 'update']);
            Route::delete('/admin/catalogs/{id}', [\App\Http\Controllers\Api\CatalogController::class, 'destroy']);

            // Customers
            Route::get('/admin/customers', [\App\Http\Controllers\Api\CustomerController::class, 'index']);
        });

        // B2B Application (Customer)
        Route::post('/b2b/apply', [\App\Http\Controllers\Api\B2bApplicationController::class, 'apply']);

        // Orders (Customer)
        Route::get('/orders', [\App\Http\Controllers\Api\OrderController::class, 'myOrders']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\OrderController::class, 'myOrderDetail']);

        // Account (Customer)
        Route::get('/account/summary', [\App\Http\Controllers\Api\AccountController::class, 'summary']);
        Route::get('/account/quotes', [\App\Http\Controllers\Api\AccountController::class, 'myQuotes']);
        Route::put('/account/profile', [\App\Http\Controllers\Api\AccountController::class, 'updateProfile']);
        Route::put('/account/address', [\App\Http\Controllers\Api\AccountController::class, 'updateAddress']);

        // Sites (Super Admin only)
        Route::middleware('role:super_admin')->group(function () {
            Route::get('/admin/sites', [\App\Http\Controllers\Api\SiteController::class, 'index']);
            Route::post('/admin/sites', [\App\Http\Controllers\Api\SiteController::class, 'store']);
            Route::put('/admin/sites/{id}', [\App\Http\Controllers\Api\SiteController::class, 'update']);
            Route::delete('/admin/sites/{id}', [\App\Http\Controllers\Api\SiteController::class, 'destroy']);
            Route::post('/admin/sites/{id}/products', [\App\Http\Controllers\Api\SiteController::class, 'assignProducts']);
            Route::delete('/admin/sites/{id}/products/{productId}', [\App\Http\Controllers\Api\SiteController::class, 'removeProduct']);
            Route::post('/admin/sites/{id}/categories', [\App\Http\Controllers\Api\SiteController::class, 'assignCategories']);

            // Settings
            Route::get('/admin/settings', [\App\Http\Controllers\Api\SettingsController::class, 'index']);
            Route::put('/admin/settings', [\App\Http\Controllers\Api\SettingsController::class, 'update']);
        });
    });
});
