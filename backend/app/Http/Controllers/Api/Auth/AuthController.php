<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'mobile_number' => 'required|string|max:15|unique:users,mobile_number',
            'password' => 'required|string|min:8|confirmed',
            'address_line1' => 'required|string|max:255',
            'barangay' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'zip_code' => 'required|string|max:10',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['consumer_code'] = 'ANT-' . strtoupper(uniqid());
        $validated['is_verified'] = false;

        $user = User::create($validated);
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful. Please verify your mobile number.',
            'user' => $user->only(['id', 'first_name', 'last_name', 'email', 'consumer_code']),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required_without:mobile_number|email',
            'mobile_number' => 'required_without:email|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'] ?? null)
            ->orWhere('mobile_number', $validated['mobile_number'] ?? null)
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'credentials' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Account is deactivated.'], 403);
        }

        $token = $user->createToken('auth-token', ['*'])->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => [
                'id' => $user->id,
                'consumer_code' => $user->consumer_code,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'mobile_number' => $user->mobile_number,
                'profile_photo' => $user->profile_photo,
                'is_verified' => $user->is_verified,
                'roles' => $user->getRoleNames(),
            ],
            'token' => $token,
        ]);
    }

    public function firebaseLogin(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'firebase_token' => 'required|string',
            ]);

            $token = $validated['firebase_token'];
            $parts = explode('.', $token);

            if (count($parts) !== 3) {
                return response()->json(['message' => 'Invalid token format.'], 401);
            }

            $decoded = base64_decode(strtr($parts[1], '-_', '+/'), true);

            if ($decoded === false) {
                return response()->json(['message' => 'Invalid token encoding.'], 401);
            }

            $payload = json_decode($decoded, true);

            if (!$payload || !isset($payload['email'])) {
                return response()->json(['message' => 'Invalid token payload.'], 401);
            }

            $email = $payload['email'];
            $name = $payload['name'] ?? explode('@', $email)[0];
            $nameParts = explode(' ', $name, 2);

            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'first_name' => $nameParts[0],
                    'last_name' => $nameParts[1] ?? '',
                    'email' => $email,
                    'mobile_number' => 'GOOGLE-' . ($payload['sub'] ?? uniqid()),
                    'profile_photo' => $payload['picture'] ?? null,
                    'password' => Hash::make(Str::random(32)),
                    'consumer_code' => 'ANT-' . strtoupper(uniqid()),
                    'is_verified' => true,
                ]);
                $user->email_verified_at = now();
                $user->save();
            }

            if (!$user->is_active) {
                return response()->json(['message' => 'Account is deactivated.'], 403);
            }

            $token = $user->createToken('auth-token', ['*'])->plainTextToken;

            return response()->json([
                'message' => 'Login successful.',
                'user' => [
                    'id' => $user->id,
                    'consumer_code' => $user->consumer_code,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'mobile_number' => $user->mobile_number,
                    'profile_photo' => $user->profile_photo,
                    'is_verified' => $user->is_verified,
                    'roles' => $user->getRoleNames(),
                ],
                'token' => $token,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Firebase login failed: ' . $e->getMessage()], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function refresh(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        $token = $request->user()->createToken('auth-token')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            fn(User $user, string $password) => $user->forceFill([
                'password' => Hash::make($password),
            ])->save()
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }
}
