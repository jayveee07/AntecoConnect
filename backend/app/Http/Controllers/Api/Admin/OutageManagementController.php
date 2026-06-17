<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Outage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutageManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $outages = Outage::with('reporter', 'assignedTeam')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->priority, fn($q) => $q->where('priority', $request->priority))
            ->when($request->barangay, fn($q) => $q->where('barangay', $request->barangay))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($outages);
    }

    public function update(Request $request, Outage $outage): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|string|in:reported,verified,assigned,in_progress,resolved,closed',
            'priority' => 'sometimes|string|in:low,medium,high,critical',
            'cause' => 'nullable|string',
            'affected_consumers' => 'nullable|integer',
            'resolution_notes' => 'nullable|string',
            'estimated_restoration' => 'nullable|date',
            'updates' => 'nullable|array',
        ]);

        if ($validated['status'] === 'resolved') {
            $validated['restored_at'] = now();
        }

        $outage->update($validated);

        return response()->json([
            'message' => 'Outage updated.',
            'data' => $outage->fresh(),
        ]);
    }

    public function assign(Request $request, Outage $outage): JsonResponse
    {
        $request->validate([
            'assigned_team_id' => 'required|exists:users,id',
        ]);

        $outage->update([
            'assigned_team_id' => $request->assigned_team_id,
            'status' => 'assigned',
        ]);

        return response()->json([
            'message' => 'Team assigned to outage.',
            'data' => $outage->fresh()->load('assignedTeam'),
        ]);
    }
}
