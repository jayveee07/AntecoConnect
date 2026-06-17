<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $announcements = Announcement::with('creator')
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($announcements);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'content' => 'required|string',
            'type' => 'required|string|in:general,billing,outage,maintenance,emergency',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'target_roles' => 'nullable|array',
            'target_areas' => 'nullable|array',
            'is_push_notification' => 'boolean',
            'is_sms_notification' => 'boolean',
            'is_email_notification' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['is_active'] = true;

        $announcement = Announcement::create($validated);

        return response()->json([
            'message' => 'Announcement created.',
            'data' => $announcement->load('creator'),
        ], 201);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        return response()->json($announcement->load('creator'));
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'content' => 'sometimes|string',
            'type' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
        ]);

        $announcement->update($validated);

        return response()->json([
            'message' => 'Announcement updated.',
            'data' => $announcement->fresh()->load('creator'),
        ]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted.']);
    }
}
