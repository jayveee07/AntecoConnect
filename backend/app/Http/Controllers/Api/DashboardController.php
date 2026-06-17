<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $account = $user->consumerAccount;

        $currentBill = $account?->bills()
            ->where('status', 'unpaid')
            ->latest()
            ->first();

        $recentBills = $account?->bills()
            ->latest()
            ->take(6)
            ->get();

        $monthlyConsumption = $account?->consumptionData()
            ->where('period_type', 'monthly')
            ->latest()
            ->take(12)
            ->get();

        $activeOutages = $user->outages()
            ->whereIn('status', ['reported', 'verified', 'assigned', 'in_progress'])
            ->count();

        $upcomingInterruptions = \App\Models\InterruptionNotice::where('start_time', '>', now())
            ->where('status', 'upcoming')
            ->take(3)
            ->get();

        $recentTransactions = $account?->transactions()
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'user' => [
                'name' => $user->full_name,
                'consumer_code' => $user->consumer_code,
                'profile_photo' => $user->profile_photo,
            ],
            'account' => $account ? [
                'account_number' => $account->account_number,
                'meter_number' => $account->meter_number,
                'status' => $account->status,
            ] : null,
            'current_bill' => $currentBill ? [
                'bill_number' => $currentBill->bill_number,
                'billing_period' => $currentBill->billing_period,
                'total_amount_due' => $currentBill->total_amount_due,
                'due_date' => $currentBill->due_date,
                'status' => $currentBill->status,
                'days_until_due' => $currentBill->days_until_due,
                'is_overdue' => $currentBill->isOverdue(),
            ] : null,
            'consumption' => [
                'monthly' => $monthlyConsumption,
                'average_monthly' => $monthlyConsumption?->avg('consumption_kwh'),
            ],
            'recent_bills' => $recentBills,
            'active_outages' => $activeOutages,
            'upcoming_interruptions' => $upcomingInterruptions,
            'recent_transactions' => $recentTransactions,
            'quick_actions' => [
                ['icon' => 'payments', 'label' => 'Pay Bill', 'route' => '/payments'],
                ['icon' => 'bolt', 'label' => 'Report Outage', 'route' => '/outages/report'],
                ['icon' => 'receipt', 'label' => 'View Bills', 'route' => '/bills'],
                ['icon' => 'support', 'label' => 'Contact Support', 'route' => '/support'],
            ],
        ]);
    }
}
