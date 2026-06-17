<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        return response()->json(['message' => 'Document uploaded.']);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => []]);
    }

    public function destroy(string $document): JsonResponse
    {
        return response()->json(['message' => 'Document deleted.']);
    }
}
