<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ConsumerAccount;
use App\Models\Bill;
use App\Models\Transaction;
use App\Models\Outage;
use App\Models\ServiceRequest;
use App\Models\WorkOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalConsumers = ConsumerAccount::count();
        $activeConnections = ConsumerAccount::where('status', 'active')->count();
        $pendingApplications = ServiceRequest::where('status', 'submitted')->count();
        $activeOutages = Outage::active()->count();

        $monthlyRevenue = Transaction::where('status', 'confirmed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        $outstandingBalance = Bill::whereIn('status', ['unpaid', 'overdue'])->sum('balance');
        $collectionRate = $this->calculateCollectionRate();

        $pendingWorkOrders = WorkOrder::where('status', 'pending')->count();
        $activeServiceRequests = ServiceRequest::whereIn('status', ['submitted', 'under_review'])->count();

        return response()->json([
            'stats' => [
                ['label' => 'Total Consumers', 'value' => number_format($totalConsumers), 'icon' => 'people', 'color' => 'blue'],
                ['label' => 'Active Connections', 'value' => number_format($activeConnections), 'icon' => 'power', 'color' => 'green'],
                ['label' => 'Pending Applications', 'value' => $pendingApplications, 'icon' => 'pending', 'color' => 'orange'],
                ['label' => 'Active Outages', 'value' => $activeOutages, 'icon' => 'warning', 'color' => 'red'],
                ['label' => 'Monthly Revenue', 'value' => '₱' . number_format($monthlyRevenue, 2), 'icon' => 'payments', 'color' => 'green'],
                ['label' => 'Outstanding Balance', 'value' => '₱' . number_format($outstandingBalance, 2), 'icon' => 'account_balance', 'color' => 'red'],
                ['label' => 'Collection Rate', 'value' => $collectionRate . '%', 'icon' => 'trending_up', 'color' => 'blue'],
                ['label' => 'Pending Work Orders', 'value' => $pendingWorkOrders, 'icon' => 'build', 'color' => 'orange'],
            ],
            'revenue_trend' => $this->getRevenueTrend(),
            'outage_stats' => $this->getOutageStats(),
            'recent_activities' => $this->getRecentActivities(),
        ]);
    }

    public function revenue(): JsonResponse
    {
        $monthlyRevenue = Transaction::where('status', 'confirmed')
            ->whereYear('created_at', now()->year)
            ->selectRaw('EXTRACT(MONTH from created_at) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $yearlyRevenue = Transaction::where('status', 'confirmed')
            ->selectRaw('EXTRACT(YEAR from created_at) as year, SUM(amount) as total')
            ->groupBy('year')
            ->orderBy('year', 'desc')
            ->take(5)
            ->get();

        $collectionRate = $this->calculateCollectionRate();
        $outstandingBalance = Bill::whereIn('status', ['unpaid', 'overdue'])->sum('balance');

        return response()->json([
            'monthly_revenue' => $monthlyRevenue,
            'yearly_revenue' => $yearlyRevenue,
            'collection_rate' => $collectionRate,
            'outstanding_balance' => $outstandingBalance,
            'average_monthly' => $monthlyRevenue->avg('total'),
        ]);
    }

    public function operations(): JsonResponse
    {
        return response()->json([
            'meter_reading' => [
                'total_scheduled' => \App\Models\MeterReadingSchedule::where('status', 'pending')->count(),
                'in_progress' => \App\Models\MeterReadingSchedule::where('status', 'in_progress')->count(),
                'completed_today' => \App\Models\MeterReadingSchedule::where('status', 'completed')
                    ->whereDate('updated_at', today())->count(),
            ],
            'work_orders' => [
                'pending' => WorkOrder::where('status', 'pending')->count(),
                'in_progress' => WorkOrder::where('status', 'in_progress')->count(),
                'completed_today' => WorkOrder::where('status', 'completed')
                    ->whereDate('completed_at', today())->count(),
            ],
            'outages' => [
                'active' => Outage::active()->count(),
                'critical' => Outage::where('priority', 'critical')->whereIn('status', ['reported', 'verified'])->count(),
                'avg_restoration_time' => '2.5 hours',
            ],
        ]);
    }

    private function calculateCollectionRate(): float
    {
        $total = Bill::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount_due');

        $collected = Bill::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->whereIn('status', ['paid'])
            ->sum('total_amount_due');

        return $total > 0 ? round(($collected / $total) * 100, 2) : 100;
    }

    private function getRevenueTrend(): array
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'month' => $date->format('M'),
                'year' => $date->year,
                'revenue' => (float) Transaction::where('status', 'confirmed')
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->sum('amount'),
            ];
        }
        return $months;
    }

    private function getOutageStats(): array
    {
        return [
            'total_this_month' => Outage::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)->count(),
            'by_type' => Outage::selectRaw('type, COUNT(*) as count')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->groupBy('type')->get(),
            'avg_response_time' => '45 minutes',
        ];
    }

    private function getRecentActivities(): array
    {
        $activities = [];
        $recentOutages = Outage::latest()->take(5)->get();
        foreach ($recentOutages as $outage) {
            $activities[] = [
                'type' => 'outage',
                'message' => "Outage reported in {$outage->barangay}, {$outage->city}",
                'time' => $outage->created_at->diffForHumans(),
            ];
        }

        $recentPayments = Transaction::where('status', 'confirmed')->latest()->take(5)->get();
        foreach ($recentPayments as $payment) {
            $activities[] = [
                'type' => 'payment',
                'message' => "Payment of ₱" . number_format($payment->amount, 2) . " received",
                'time' => $payment->created_at->diffForHumans(),
            ];
        }

        usort($activities, fn($a, $b) => strtotime($b['time']) - strtotime($a['time']));
        return array_slice($activities, 0, 10);
    }
}
