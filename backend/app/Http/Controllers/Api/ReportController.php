<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|string',
            'format' => 'required|string|in:pdf,excel,csv',
        ]);

        return response()->json(['message' => 'Report generation queued.']);
    }

    public function download(string $report): \Illuminate\Http\Response
    {
        abort(404);
    }
}
