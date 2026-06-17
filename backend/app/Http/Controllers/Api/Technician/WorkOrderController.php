<?php

namespace App\Http\Controllers\Api\Technician;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = WorkOrder::with('consumerAccount.user')
            ->where('assigned_to', $request->user()->id)
            ->orderByRaw("FIELD(status, 'assigned', 'in_progress', 'pending')")
            ->orderBy('scheduled_start')
            ->paginate($request->per_page ?? 20);

        return response()->json($orders);
    }

    public function show(WorkOrder $workOrder): JsonResponse
    {
        $this->authorize('view', $workOrder);
        $workOrder->load('consumerAccount.user', 'supervisor', 'outage');
        return response()->json($workOrder);
    }

    public function accept(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $this->authorize('update', $workOrder);

        $workOrder->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'Work order accepted.',
            'data' => $workOrder,
        ]);
    }

    public function start(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $this->authorize('update', $workOrder);

        $workOrder->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'Work started.',
            'data' => $workOrder,
        ]);
    }

    public function complete(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $this->authorize('update', $workOrder);

        $validated = $request->validate([
            'completion_notes' => 'nullable|string',
            'equipment_used' => 'nullable|array',
            'labor_cost' => 'nullable|numeric',
            'parts_cost' => 'nullable|numeric',
            'customer_name' => 'nullable|string',
        ]);

        $validated['status'] = 'completed';
        $validated['completed_at'] = now();

        $workOrder->update($validated);

        return response()->json([
            'message' => 'Work order completed.',
            'data' => $workOrder->fresh(),
        ]);
    }

    public function uploadPhotos(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $this->authorize('update', $workOrder);

        $request->validate([
            'type' => 'required|in:before,after',
            'photos' => 'required|array',
            'photos.*' => 'image|max:10240',
        ]);

        $uploaded = [];
        foreach ($request->file('photos') as $photo) {
            $uploaded[] = $photo->store("work-orders/{$workOrder->id}", 'public');
        }

        $field = $request->type === 'before' ? 'before_photos' : 'after_photos';
        $existing = $workOrder->{$field} ?? [];
        $workOrder->update([$field => array_merge($existing, $uploaded)]);

        return response()->json([
            'message' => 'Photos uploaded.',
            'photos' => $workOrder->fresh()->{$field},
        ]);
    }

    public function uploadSignature(Request $request, WorkOrder $workOrder): JsonResponse
    {
        $this->authorize('update', $workOrder);

        $request->validate([
            'signature' => 'required|image|max:5120',
        ]);

        $path = $request->file('signature')->store("work-orders/{$workOrder->id}/signatures", 'public');

        $workOrder->update(['customer_signature' => $path]);

        return response()->json([
            'message' => 'Signature captured.',
            'signature_url' => $path,
        ]);
    }
}
