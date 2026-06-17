<?php

namespace App\Http\Controllers\Api\Technician;

use App\Http\Controllers\Controller;
use App\Models\MeterReadingSchedule;
use App\Models\BillReading;
use App\Models\ConsumerAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeterReadingController extends Controller
{
    public function schedule(Request $request): JsonResponse
    {
        $schedule = MeterReadingSchedule::where('meter_reader_id', $request->user()->id)
            ->where('status', '!=', 'completed')
            ->orderBy('reading_date')
            ->first();

        if (!$schedule) {
            return response()->json(['message' => 'No schedule found.'], 404);
        }

        $meters = ConsumerAccount::whereIn('id', $schedule->assigned_meters)
            ->with('user')
            ->get();

        $progress = [
            'total' => $schedule->total_meters,
            'read' => $schedule->read_meters,
            'remaining' => $schedule->total_meters - $schedule->read_meters,
        ];

        return response()->json([
            'schedule' => $schedule,
            'meters' => $meters,
            'progress' => $progress,
        ]);
    }

    public function submitReading(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'consumer_account_id' => 'required|exists:consumer_accounts,id',
            'reading_value' => 'required|numeric',
            'meter_photo' => 'nullable|image|max:5120',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $account = ConsumerAccount::findOrFail($validated['consumer_account_id']);
        $bill = $account->bills()->where('status', 'unpaid')->latest()->first();

        if (!$bill) {
            return response()->json(['message' => 'No active bill found.'], 404);
        }

        $photoPath = null;
        if ($request->hasFile('meter_photo')) {
            $photoPath = $request->file('meter_photo')->store('meter-readings', 'public');
        }

        $reading = BillReading::create([
            'bill_id' => $bill->id,
            'meter_reader_id' => $request->user()->id,
            'reading_value' => $validated['reading_value'],
            'reading_type' => 'current',
            'source' => 'manual',
            'meter_photo' => $photoPath,
            'gps_latitude' => $validated['latitude'] ?? null,
            'gps_longitude' => $validated['longitude'] ?? null,
            'status' => 'pending',
            'remarks' => $validated['remarks'] ?? null,
        ]);

        // Update schedule progress
        $schedule = MeterReadingSchedule::where('meter_reader_id', $request->user()->id)
            ->where('status', 'in_progress')
            ->first();

        if ($schedule) {
            $schedule->increment('read_meters');
            if ($schedule->read_meters >= $schedule->total_meters) {
                $schedule->update(['status' => 'completed']);
            }
        }

        return response()->json([
            'message' => 'Reading submitted successfully.',
            'data' => $reading,
        ], 201);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'required|image|max:10240',
        ]);

        $path = $request->file('photo')->store('meter-readings/photos', 'public');

        return response()->json([
            'message' => 'Photo uploaded.',
            'url' => $path,
        ]);
    }
}
