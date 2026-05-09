<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'b2b_status',
        'approval_status',
        'phone',
        'company_name',
        'tax_id',
    ];

    // Roles
    const ROLE_SUPER_ADMIN = 'super_admin';
    const ROLE_ADMIN_STAFF = 'admin_staff';
    const ROLE_B2B_BUYER   = 'b2b_buyer';
    const ROLE_B2C_CUSTOMER = 'b2c_customer';

    // Statuses
    const STATUS_PENDING  = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationship: B2B Applications.
     */
    public function b2bApplications()
    {
        return $this->hasMany(B2bApplication::class);
    }

    /**
     * Relationship: Orders.
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    /**
     * Relationship: Cart Items.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
