<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@uniforms.ae',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SUPER_ADMIN,
                'approval_status' => User::STATUS_APPROVED,
            ],
            [
                'name' => 'Staff Member',
                'email' => 'staff@uniforms.ae',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN_STAFF,
                'approval_status' => User::STATUS_APPROVED,
            ],
            [
                'name' => 'B2B Buyer',
                'email' => 'b2b@uniforms.ae',
                'password' => Hash::make('password'),
                'role' => User::ROLE_B2B_BUYER,
                'approval_status' => User::STATUS_APPROVED,
            ],
            [
                'name' => 'B2C Customer',
                'email' => 'b2c@uniforms.ae',
                'password' => Hash::make('password'),
                'role' => User::ROLE_B2C_CUSTOMER,
                'approval_status' => User::STATUS_APPROVED,
            ],
        ];

        foreach ($users as $userData) {
            if (!User::where('email', $userData['email'])->exists()) {
                User::create($userData);
                $this->command->info("Seeded user: {$userData['name']} ({$userData['role']})");
            } else {
                $this->command->warn("User already exists: {$userData['email']} - skipping.");
            }
        }
    }
}
