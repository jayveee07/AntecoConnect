<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ConsumerAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::with('consumerAccount', 'roles')
            ->when($request->search, fn($q) => $q->where(function($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhere('consumer_code', 'like', "%{$request->search}%");
            }))
            ->when($request->status, fn($q) => $q->where('is_active', $request->status === 'active'))
            ->when($request->role, fn($q) => $q->role($request->role))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('consumerAccount', 'roles', 'consumerAccount.bills', 'consumerAccount.transactions');
        return response()->json($user);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'mobile_number' => 'required|string|max:15|unique:users,mobile_number',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'barangay' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['consumer_code'] = 'ANT-' . strtoupper(uniqid());

        $user = User::create($validated);
        $user->assignRole($validated['role']);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user->load('roles'),
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:50',
            'last_name' => 'sometimes|string|max:50',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'mobile_number' => 'sometimes|string|max:15|unique:users,mobile_number,' . $user->id,
            'is_active' => 'sometimes|boolean',
            'role' => 'sometimes|string|exists:roles,name',
        ]);

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
            unset($validated['role']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated.',
            'user' => $user->fresh()->load('roles'),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'User deleted.']);
    }

    public function verify(User $user): JsonResponse
    {
        $user->update([
            'is_verified' => true,
            'email_verified_at' => now(),
            'mobile_verified_at' => now(),
        ]);

        return response()->json(['message' => 'User verified.']);
    }

    public function consumers(Request $request): JsonResponse
    {
        $consumers = ConsumerAccount::with('user')
            ->when($request->search, fn($q) => $q->where(function($q) use ($request) {
                $q->where('account_number', 'like', "%{$request->search}%")
                  ->orWhere('meter_number', 'like', "%{$request->search}%");
            }))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($consumers);
    }

    public function consumerDetail(ConsumerAccount $account): JsonResponse
    {
        $account->load('user', 'bills', 'transactions', 'consumptionData');
        return response()->json($account);
    }
}
