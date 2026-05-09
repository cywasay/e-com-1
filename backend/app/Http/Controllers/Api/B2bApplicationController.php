<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\B2bApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class B2bApplicationController extends Controller
{
    /**
     * Submit a new B2B application.
     */
    public function apply(Request $request)
    {
        $user = $request->user();

        // Check if already has a pending or approved application
        if (in_array($user->b2b_status, ['pending', 'approved'])) {
            return response()->json([
                'success' => false,
                'message' => 'You already have a pending or approved application.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'business_type' => 'required|string|in:Retailer,Reseller,Corporate,Other',
            'est_order_volume' => 'required|string|max:255',
            'tax_id' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application = B2bApplication::create([
            'user_id' => $user->id,
            'company_name' => $request->company_name,
            'business_type' => $request->business_type,
            'est_order_volume' => $request->est_order_volume,
            'tax_id' => $request->tax_id,
            'status' => 'pending',
        ]);

        // Update user status
        $user->update(['b2b_status' => 'pending']);

        return response()->json([
            'success' => true,
            'data' => $application,
            'message' => 'Application submitted'
        ], 201);
    }

    /**
     * List all applications (Admin).
     */
    public function index(Request $request)
    {
        $query = B2bApplication::with('user:id,name,email');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(20)
        ]);
    }

    /**
     * Show single application (Admin).
     */
    public function show($id)
    {
        $application = B2bApplication::with('user')->find($id);

        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Application not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $application
        ]);
    }

    /**
     * Approve application (Super Admin).
     */
    public function approve($id)
    {
        $application = B2bApplication::find($id);

        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Application not found'], 404);
        }

        $application->update(['status' => 'approved']);
        
        $user = User::find($application->user_id);
        $user->update([
            'role' => User::ROLE_B2B_BUYER,
            'b2b_status' => 'approved'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application approved'
        ]);
    }

    /**
     * Reject application (Super Admin).
     */
    public function reject(Request $request, $id)
    {
        $application = B2bApplication::find($id);

        if (!$application) {
            return response()->json(['success' => false, 'message' => 'Application not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'admin_notes' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes
        ]);

        $user = User::find($application->user_id);
        $user->update(['b2b_status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Application rejected'
        ]);
    }
}
