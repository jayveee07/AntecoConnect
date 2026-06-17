<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceRequestManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $requests = ServiceRequest::with('user', 'consumerAccount')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($requests);
    }

    public function update(Request $request, ServiceRequest $serviceRequest): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:submitted,under_review,approved,rejected,completed,cancelled',
            'assigned_to' => 'nullable|exists:users,id',
            'scheduled_date' => 'nullable|date',
            'admin_notes' => 'nullable|string',
        ]);

        if ($validated['status'] === 'completed') {
            $validated['completed_date'] = now();
        }

        $serviceRequest->update($validated);

        return response()->json([
            'message' => 'Service request updated.',
            'data' => $serviceRequest->fresh()->load('assignedTo'),
        ]);
    }
}
