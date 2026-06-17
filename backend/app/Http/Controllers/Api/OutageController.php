<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Outage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutageController extends Controller
{
    public function report(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:power_outage,low_voltage,high_voltage,broken_meter,fallen_pole,transformer_issue,others',
            'barangay' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'street_address' => 'required|string',
            'landmark' => 'nullable|string',
            'latitude' => 'required|string',
            'longitude' => 'required|string',
            'description' => 'required|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:5120',
        ]);

        $validated['ticket_number'] = 'OTG-' . strtoupper(uniqid());
        $validated['reported_by'] = $request->user()->id;
        $validated['priority'] = $this->calculatePriority($validated['type']);
        $validated['status'] = 'reported';

        $outage = Outage::create($validated);

        return response()->json([
            'message' => 'Outage reported successfully.',
            'ticket_number' => $outage->ticket_number,
            'outage' => $outage,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $outages = $request->user()->outages()
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($outages);
    }

    public function show(Outage $outage): JsonResponse
    {
        $this->authorize('view', $outage);
        return response()->json($outage);
    }

    public function track(string $ticketNumber): JsonResponse
    {
        $outage = Outage::where('ticket_number', $ticketNumber)->firstOrFail();

        $timeline = [];
        $statusMessages = [
            'reported' => 'Outage reported to ANTECO',
            'verified' => 'ANTECO has verified the outage',
            'assigned' => 'Repair team has been assigned',
            'in_progress' => 'Repair work is in progress',
            'resolved' => 'Power has been restored',
            'closed' => 'Outage ticket closed',
        ];

        foreach ($statusMessages as $status => $message) {
            $timeline[] = [
                'status' => $status,
                'message' => $message,
                'completed' => in_array($status, ['reported', ...$this->getCompletedStatuses($outage)]),
            ];
        }

        return response()->json([
            'outage' => $outage,
            'timeline' => $timeline,
            'estimated_restoration' => $outage->estimated_restoration,
            'updates' => $outage->updates ?? [],
        ]);
    }

    private function calculatePriority(string $type): string
    {
        return match($type) {
            'fallen_pole', 'transformer_issue' => 'critical',
            'power_outage' => 'high',
            'high_voltage' => 'high',
            'low_voltage' => 'medium',
            default => 'low',
        };
    }

    private function getCompletedStatuses(Outage $outage): array
    {
        $statusOrder = ['reported', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'];
        $index = array_search($outage->status, $statusOrder);
        return $index !== false ? array_slice($statusOrder, 0, $index + 1) : [];
    }
}
