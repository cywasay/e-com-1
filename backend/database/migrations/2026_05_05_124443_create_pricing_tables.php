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
        Schema::create('price_sets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['global_sale', 'buyer_specific']);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('price_set_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_set_id')->constrained('price_sets')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('quantity_set_id')->nullable()->constrained('quantity_sets')->onDelete('cascade');
            $table->decimal('override_price', 10, 2);
            $table->timestamps();
        });

        Schema::create('price_set_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('price_set_id')->constrained('price_sets')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('scope', ['all_b2b', 'buyer_specific']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_set_assignments');
        Schema::dropIfExists('price_set_items');
        Schema::dropIfExists('price_sets');
    }
};
