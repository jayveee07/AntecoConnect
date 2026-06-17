<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OTPController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $request->validate(['mobile_number' => 'required|string|exists:users,mobile_number']);

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        User::where('mobile_number', $request->mobile_number)->update([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        // TODO: Integrate SMS provider (Twilio/Semaphore)
        // Send OTP via SMS

        return response()->json(['message' => 'OTP sent successfully.', 'debug_otp' => $otp]);
    }

    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'mobile_number' => 'required|string|exists:users,mobile_number',
            'otp_code' => 'required|string|size:6',
        ]);

        $user = User::where('mobile_number', $request->mobile_number)->first();

        if (!$user->otp_code || $user->otp_expires_at < now()) {
            return response()->json(['message' => 'OTP has expired. Request a new one.'], 400);
        }

        if ($user->otp_code !== $request->otp_code) {
            return response()->json(['message' => 'Invalid OTP code.'], 400);
        }

        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'mobile_verified_at' => now(),
            'is_verified' => true,
        ]);

        return response()->json(['message' => 'Mobile number verified successfully.']);
    }
}
