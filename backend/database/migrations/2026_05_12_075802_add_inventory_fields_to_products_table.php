<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku', 100)->nullable()->after('handling_fee');
            $table->string('barcode', 100)->nullable()->after('sku');
            $table->integer('stock_qty')->default(0)->after('barcode');
            $table->boolean('track_inventory')->default(true)->after('stock_qty');
            $table->boolean('continue_selling_when_out_of_stock')->default(false)->after('track_inventory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['sku', 'barcode', 'stock_qty', 'track_inventory', 'continue_selling_when_out_of_stock']);
        });
    }
};
