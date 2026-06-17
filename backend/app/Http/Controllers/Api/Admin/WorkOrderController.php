<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $workOrders = WorkOrder::with('assignedTo', 'consumerAccount.user')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->assigned_to, fn($q) => $q->where('assigned_to', $request->assigned_to))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($workOrders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'priority' => 'required|string|in:routine,urgent,emergency',
            'consumer_account_id' => 'nullable|exists:consumer_accounts,id',
            'service_request_id' => 'nullable|exists:service_requests,id',
            'outage_id' => 'nullable|exists:outages,id',
            'address' => 'required|string',
            'barangay' => 'required|string',
            'city' => 'required|string',
            'province' => 'required|string',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'description' => 'required|string',
            'scheduled_start' => 'nullable|date',
            'scheduled_end' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $validated['work_order_number'] = 'WO-' . strtoupper(uniqid());
        $validated['status'] = 'pending';

        $workOrder = WorkOrder::create($validated);

        return response()->json([
            'message' => 'Work order created.',
            'data' => $workOrder->load('assignedTo'),
        ], 201);
    }

    public function update(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $validated = $request->validate([
            'priority' => 'sometimes|string|in:routine,urgent,emergency',
            'status' => 'sometimes|string',
            'scheduled_start' => 'nullable|date',
            'scheduled_end' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $workOrder->update($validated);

        return response()->json([
            'message' => 'Work order updated.',
            'data' => $workOrder->fresh(),
        ]);
    }

    public function assign(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $workOrder->update([
            'assigned_to' => $request->assigned_to,
            'status' => 'assigned',
        ]);

        return response()->json([
            'message' => 'Work order assigned.',
            'data' => $workOrder->fresh()->load('assignedTo'),
        ]);
    }
}
