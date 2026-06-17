<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reports = Report::with('generator')
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($reports);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|string|in:billing,collection,revenue,consumer,meter_reading,outage,work_order,technician_performance',
            'format' => 'required|string|in:pdf,excel,csv',
            'parameters' => 'required|json',
        ]);

        $report = Report::create([
            'report_number' => 'RPT-' . strtoupper(uniqid()),
            'type' => $validated['type'],
            'format' => $validated['format'],
            'status' => 'generating',
            'parameters' => json_decode($validated['parameters'], true),
            'generated_by' => $request->user()->id,
            'generated_at' => now(),
        ]);

        // TODO: Queue report generation job
        // ProcessReport::dispatch($report);

        $report->update([
            'status' => 'completed',
            'file_path' => "reports/{$report->report_number}.{$validated['format']}",
        ]);

        return response()->json([
            'message' => 'Report generated.',
            'data' => $report,
        ]);
    }
}
