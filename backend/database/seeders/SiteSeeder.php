<?php

namespace Database\Seeders;

use App\Models\Site;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Site::updateOrCreate(
            ['domain' => 'uniforms.ae'],
            [
                'name' => 'uniforms.ae',
                'slug' => 'uniforms',
                'is_active' => true,
            ]
        );
    }
}
