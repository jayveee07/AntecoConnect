<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $requests = $request->user()->serviceRequests()
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($requests);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:new_connection,reconnection,change_ownership,meter_transfer,service_upgrade,temporary_connection,meter_calibration,others',
            'consumer_account_id' => 'nullable|exists:consumer_accounts,id',
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string',
            'requirements' => 'nullable|array',
            'notes' => 'nullable|string',
        ]);

        $validated['request_number'] = 'SRQ-' . strtoupper(uniqid());
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'submitted';

        $serviceRequest = ServiceRequest::create($validated);

        return response()->json([
            'message' => 'Service request submitted.',
            'data' => $serviceRequest,
        ], 201);
    }

    public function show(ServiceRequest $serviceRequest): JsonResponse
    {
        $this->authorize('view', $serviceRequest);
        return response()->json($serviceRequest);
    }

    public function update(Request $request, ServiceRequest $serviceRequest): JsonResponse
    {
        $this->authorize('update', $serviceRequest);

        $validated = $request->validate([
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $serviceRequest->update($validated);

        return response()->json([
            'message' => 'Service request updated.',
            'data' => $serviceRequest,
        ]);
    }

    public function destroy(ServiceRequest $serviceRequest): JsonResponse
    {
        $this->authorize('delete', $serviceRequest);

        if (!in_array($serviceRequest->status, ['draft', 'submitted'])) {
            return response()->json(['message' => 'Cannot cancel a request that is already being processed.'], 400);
        }

        $serviceRequest->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Service request cancelled.']);
    }

    public function track(ServiceRequest $serviceRequest): JsonResponse
    {
        $this->authorize('view', $serviceRequest);

        $timeline = [
            ['status' => 'submitted', 'label' => 'Request Submitted', 'date' => $serviceRequest->created_at],
        ];

        if ($serviceRequest->status !== 'submitted') {
            $timeline[] = ['status' => 'under_review', 'label' => 'Under Review', 'date' => $serviceRequest->updated_at];
        }

        if (in_array($serviceRequest->status, ['approved', 'completed'])) {
            $timeline[] = ['status' => 'approved', 'label' => 'Application Approved', 'date' => $serviceRequest->scheduled_date];
        }

        if ($serviceRequest->status === 'completed') {
            $timeline[] = ['status' => 'completed', 'label' => 'Service Completed', 'date' => $serviceRequest->completed_date];
        }

        return response()->json([
            'data' => $serviceRequest,
            'timeline' => $timeline,
        ]);
    }

    public function uploadRequirements(Request $request, ServiceRequest $serviceRequest): JsonResponse
    {
        $this->authorize('update', $serviceRequest);

        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:20480|mimes:pdf,jpg,jpeg,png',
        ]);

        $uploaded = [];
        foreach ($request->file('files') as $file) {
            $path = $file->store("requirements/{$serviceRequest->id}", 'public');
            $uploaded[] = $path;
        }

        $existing = $serviceRequest->attachments ?? [];
        $serviceRequest->update([
            'attachments' => array_merge($existing, $uploaded),
            'status' => 'submitted',
        ]);

        return response()->json([
            'message' => 'Requirements uploaded.',
            'attachments' => $serviceRequest->attachments,
        ]);
    }
}
