<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsumptionData;
use App\Models\EnergySavingTip;
use App\Models\AiPrediction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConsumptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        if (!$account) {
            return response()->json(['message' => 'No consumer account found.'], 404);
        }

        $monthly = $account->consumptionData()
            ->where('period_type', 'monthly')
            ->latest()
            ->take(12)
            ->get();

        $currentMonth = $account->consumptionData()
            ->where('period_type', 'monthly')
            ->where('period_year', now()->year)
            ->where('period_month', now()->month)
            ->first();

        $lastMonth = $account->consumptionData()
            ->where('period_type', 'monthly')
            ->where('period_year', now()->subMonth()->year)
            ->where('period_month', now()->subMonth()->month)
            ->first();

        $averageMonthly = $monthly->avg('consumption_kwh');

        return response()->json([
            'current_month' => $currentMonth,
            'last_month' => $lastMonth,
            'yearly_data' => $monthly,
            'average_monthly_kwh' => round($averageMonthly, 2),
            'total_kwh_year' => $monthly->sum('consumption_kwh'),
            'estimated_bill' => $this->estimateBill($account, $monthly->first()?->consumption_kwh ?? 0),
        ]);
    }

    public function daily(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        $data = $account->consumptionData()
            ->where('period_type', 'daily')
            ->whereBetween('period_date', [now()->subDays(30), now()])
            ->orderBy('period_date')
            ->get();

        return response()->json($data);
    }

    public function monthly(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        $data = $account->consumptionData()
            ->where('period_type', 'monthly')
            ->where('period_year', $request->year ?? now()->year)
            ->orderBy('period_month')
            ->get();

        return response()->json($data);
    }

    public function yearly(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        $data = $account->consumptionData()
            ->where('period_type', 'yearly')
            ->latest()
            ->take(5)
            ->get();

        return response()->json($data);
    }

    public function forecast(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        if (!$account) {
            return response()->json(['message' => 'No consumer account found.'], 404);
        }

        $prediction = AiPrediction::where('consumer_account_id', $account->id)
            ->where('prediction_type', 'bill_forecast')
            ->where('valid_until', '>=', now())
            ->first();

        if (!$prediction) {
            // Generate prediction on the fly
            $historicalData = $account->consumptionData()
                ->where('period_type', 'monthly')
                ->latest()
                ->take(6)
                ->get();

            $avgConsumption = $historicalData->avg('consumption_kwh');
            $predictedBill = $this->estimateBill($account, $avgConsumption);

            $prediction = AiPrediction::create([
                'consumer_account_id' => $account->id,
                'prediction_type' => 'bill_forecast',
                'period' => 'next_month',
                'predicted_value' => $predictedBill['total'],
                'confidence_score' => 85.00,
                'factors' => [
                    'average_consumption' => $avgConsumption,
                    'seasonal_factor' => 1.05,
                    'trend' => 'stable',
                ],
                'recommendations' => [
                    'Consider energy-efficient appliances to reduce consumption.',
                    'Peak hours are 6PM-9PM; shift usage to off-peak.',
                ],
                'prediction_date' => now(),
                'valid_until' => now()->addMonth(),
            ]);
        }

        return response()->json([
            'prediction' => $prediction,
            'next_month_estimated' => [
                'consumption_kwh' => round($prediction->predicted_value / 12, 2),
                'estimated_bill' => $prediction->predicted_value,
                'confidence' => $prediction->confidence_score,
            ],
            'recommendations' => $prediction->recommendations,
        ]);
    }

    public function savingTips(): JsonResponse
    {
        $tips = EnergySavingTip::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json($tips);
    }

    public function adjustPlan(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'target_reduction_percent' => 'required|numeric|min:1|max:50',
        ]);

        $account = $request->user()->consumerAccount;
        $avgMonthly = $account->consumptionData()
            ->where('period_type', 'monthly')
            ->latest()
            ->take(3)
            ->get()
            ->avg('consumption_kwh');

        $targetKwh = $avgMonthly * (1 - $validated['target_reduction_percent'] / 100);
        $estimatedSavings = $this->estimateBill($account, $avgMonthly)['total'] - $this->estimateBill($account, $targetKwh)['total'];

        return response()->json([
            'current_average' => round($avgMonthly, 2),
            'target_kwh' => round($targetKwh, 2),
            'reduction_percent' => $validated['target_reduction_percent'],
            'estimated_monthly_savings' => round(max($estimatedSavings, 0), 2),
            'recommendations' => [
                'Replace incandescent bulbs with LED (save 5-10% of bill)',
                'Unplug appliances when not in use (save 3-5%)',
                'Set aircon to 25°C (save 10-15%)',
                'Use inverter-type appliances',
                'Maximize natural lighting during daytime',
            ],
        ]);
    }

    private function estimateBill($account, float $kwh): array
    {
        $rate = $account->rate ?? 12.50;
        $generation = $kwh * 5.50;
        $transmission = $kwh * 1.20;
        $systemLoss = $kwh * 0.80;
        $distribution = $kwh * 2.50;
        $subsidies = $kwh * 0.30;
        $subtotal = $generation + $transmission + $systemLoss + $distribution + $subsidies;
        $vat = $subtotal * 0.12;
        $total = $subtotal + $vat;

        return [
            'generation' => round($generation, 2),
            'transmission' => round($transmission, 2),
            'system_loss' => round($systemLoss, 2),
            'distribution' => round($distribution, 2),
            'subsidies' => round($subsidies, 2),
            'subtotal' => round($subtotal, 2),
            'vat' => round($vat, 2),
            'total' => round($total, 2),
        ];
    }
}
