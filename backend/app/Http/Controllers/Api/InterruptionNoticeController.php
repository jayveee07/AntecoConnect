<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InterruptionNotice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InterruptionNoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notices = InterruptionNotice::where('status', '!=', 'cancelled')
            ->orderBy('start_time')
            ->paginate($request->per_page ?? 20);

        return response()->json($notices);
    }

    public function active(): JsonResponse
    {
        $active = InterruptionNotice::whereIn('status', ['upcoming', 'ongoing'])
            ->where('start_time', '>=', now()->subDay())
            ->orderBy('start_time')
            ->get();

        return response()->json($active);
    }
}
