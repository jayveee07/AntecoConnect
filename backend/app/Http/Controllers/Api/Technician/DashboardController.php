<?php

namespace App\Http\Controllers\Api\Technician;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $technician = $request->user();

        $assignedOrders = WorkOrder::where('assigned_to', $technician->id)
            ->whereIn('status', ['assigned', 'in_progress'])
            ->count();

        $pendingOrders = WorkOrder::where('assigned_to', $technician->id)
            ->where('status', 'assigned')
            ->count();

        $completedToday = WorkOrder::where('assigned_to', $technician->id)
            ->where('status', 'completed')
            ->whereDate('completed_at', today())
            ->count();

        $upcomingOrders = WorkOrder::where('assigned_to', $technician->id)
            ->whereIn('status', ['assigned', 'pending'])
            ->orderBy('scheduled_start')
            ->get();

        $stats = [
            ['label' => 'Assigned Orders', 'value' => $assignedOrders, 'icon' => 'assignment', 'color' => 'blue'],
            ['label' => 'Pending', 'value' => $pendingOrders, 'icon' => 'pending', 'color' => 'orange'],
            ['label' => 'Completed Today', 'value' => $completedToday, 'icon' => 'check_circle', 'color' => 'green'],
        ];

        return response()->json([
            'technician' => [
                'name' => $technician->full_name,
                'photo' => $technician->profile_photo,
            ],
            'stats' => $stats,
            'upcoming_orders' => $upcomingOrders,
            'next_order' => $upcomingOrders->first(),
        ]);
    }
}
