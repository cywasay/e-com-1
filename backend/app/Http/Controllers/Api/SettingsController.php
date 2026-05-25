<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    private const PUBLIC_KEYS = [
        'store_name',
        'store_email',
        'store_phone',
        'store_whatsapp',
        'store_address',
        'store_logo_url',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
        'twitter_url',
    ];

    /**
     * Get whitelisted settings for the public storefront.
     */
    public function publicSettings()
    {
        $settings = Setting::whereIn('key', self::PUBLIC_KEYS)
            ->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Get all settings.
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Update settings.
     */
    public function update(Request $request)
    {
        $settings = $request->all();

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        $updatedSettings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => $updatedSettings,
            'message' => 'Settings updated successfully.'
        ]);
    }
}
