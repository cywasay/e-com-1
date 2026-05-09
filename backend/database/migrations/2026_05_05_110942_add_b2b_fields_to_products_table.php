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
            $table->decimal('base_retail_price', 10, 2)->nullable()->after('price');
            $table->decimal('base_wholesale_price', 10, 2)->nullable()->after('base_retail_price');
            $table->integer('moq')->default(1)->after('base_wholesale_price');
            $table->enum('visibility', ['both', 'b2c_only', 'b2b_only'])->default('both')->after('moq');
            $table->integer('weight_grams')->nullable()->after('visibility');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['base_retail_price', 'base_wholesale_price', 'moq', 'visibility', 'weight_grams']);
        });
    }
};
