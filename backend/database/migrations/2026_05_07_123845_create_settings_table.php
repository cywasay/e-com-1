<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default values
        $defaults = [
            ['key' => 'store_name', 'value' => 'uniforms.ae', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_email', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_phone', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_whatsapp', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_address', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'store_logo_url', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'facebook_url', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'instagram_url', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'linkedin_url', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'twitter_url', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('settings')->insert($defaults);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
