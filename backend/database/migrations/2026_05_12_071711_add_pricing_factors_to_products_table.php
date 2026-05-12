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
            $table->decimal('price', 15, 2)->nullable()->change();
            $table->decimal('compare_at_price', 15, 2)->nullable()->after('price');
            $table->boolean('charge_tax')->default(true)->after('compare_at_price');
            $table->decimal('base_cost', 15, 2)->nullable()->after('charge_tax');
            $table->decimal('margin_percentage', 5, 2)->nullable()->after('base_cost');
            $table->decimal('tax_percentage', 5, 2)->default(5)->after('margin_percentage');
            $table->decimal('handling_fee', 15, 2)->default(0)->after('tax_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['base_cost', 'margin_percentage', 'tax_percentage', 'handling_fee']);
        });
    }
};
