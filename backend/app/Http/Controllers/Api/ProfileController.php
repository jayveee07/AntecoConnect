<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load('consumerAccount', 'roles');

        return response()->json([
            'id' => $user->id,
            'consumer_code' => $user->consumer_code,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'full_name' => $user->full_name,
            'email' => $user->email,
            'mobile_number' => $user->mobile_number,
            'profile_photo' => $user->profile_photo,
            'address_line1' => $user->address_line1,
            'address_line2' => $user->address_line2,
            'barangay' => $user->barangay,
            'city' => $user->city,
            'province' => $user->province,
            'zip_code' => $user->zip_code,
            'full_address' => $user->full_address,
            'is_verified' => $user->is_verified,
            'roles' => $user->getRoleNames(),
            'account' => $user->consumerAccount,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'address_line1' => 'sometimes|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'barangay' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'province' => 'sometimes|string|max:100',
            'zip_code' => 'sometimes|string|max:10',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $user,
        ]);
    }

    public function updatePhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|max:5120',
        ]);

        $path = $request->file('photo')->store('profiles', 'public');
        $request->user()->update(['profile_photo' => $path]);

        return response()->json([
            'message' => 'Profile photo updated.',
            'photo_url' => $path,
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 400);
        }

        $user->update(['password' => Hash::make($validated['new_password'])]);

        return response()->json(['message' => 'Password changed successfully.']);
    }

    public function updateFcmToken(Request $request): JsonResponse
    {
        $request->validate(['fcm_token' => 'required|string']);

        $request->user()->update(['fcm_token' => $request->fcm_token]);

        return response()->json(['message' => 'FCM token updated.']);
    }

    public function accountInfo(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;

        if (!$account) {
            return response()->json(['message' => 'No consumer account linked.'], 404);
        }

        return response()->json($account);
    }

    public function deleteAccount(Request $request): JsonResponse
    {
        $request->user()->delete();
        return response()->json(['message' => 'Account deleted.']);
    }
}
