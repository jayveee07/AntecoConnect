<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ElectricPole;
use App\Models\Transformer;
use App\Models\Feeder;
use App\Models\ServiceArea;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GisController extends Controller
{
    public function poles(Request $request): JsonResponse
    {
        $poles = ElectricPole::when($request->barangay, fn($q) => $q->where('barangay', $request->barangay))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->get();

        return response()->json($poles);
    }

    public function transformers(Request $request): JsonResponse
    {
        $transformers = Transformer::when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->barangay, fn($q) => $q->where('barangay', $request->barangay))
            ->get();

        return response()->json($transformers);
    }

    public function feeders(): JsonResponse
    {
        return response()->json(Feeder::all());
    }

    public function serviceAreas(): JsonResponse
    {
        return response()->json(ServiceArea::with('assignedTeam')->get());
    }
}
