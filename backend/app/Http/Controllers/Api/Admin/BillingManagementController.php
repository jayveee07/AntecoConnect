<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\ConsumerAccount;
use App\Models\Transaction;
use App\Models\BillReading;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillingManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bills = Bill::with('consumerAccount.user')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->billing_period, fn($q) => $q->where('billing_period', $request->billing_period))
            ->when($request->search, fn($q) => $q->whereHas('consumerAccount', fn($q) => $q
                ->where('account_number', 'like', "%{$request->search}%")
                ->orWhere('meter_number', 'like', "%{$request->search}%")))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($bills);
    }

    public function generateBills(Request $request): JsonResponse
    {
        $request->validate([
            'billing_period' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $accounts = ConsumerAccount::where('status', 'active')->get();
        $generated = 0;

        foreach ($accounts as $account) {
            $lastBill = $account->bills()->latest()->first();

            $previousReading = $lastBill ? $lastBill->current_reading : 0;
            $currentReading = $previousReading + rand(50, 400); // Simulated reading

            // Check if bill already exists for this period
            if ($account->bills()->where('billing_period', $request->billing_period)->exists()) {
                continue;
            }

            $consumption = $currentReading - $previousReading;

            // Rate calculation (simplified)
            $generationCharge = $consumption * 5.50;
            $transmissionCharge = $consumption * 1.20;
            $systemLossCharge = $consumption * 0.80;
            $distributionCharge = $consumption * 2.50;
            $subsidiesCharge = $consumption * 0.30;
            $subtotal = $generationCharge + $transmissionCharge + $systemLossCharge + $distributionCharge + $subsidiesCharge;
            $vat = $subtotal * 0.12;
            $totalDue = $subtotal + $vat;

            Bill::create([
                'consumer_account_id' => $account->id,
                'bill_number' => 'BL-' . strtoupper(uniqid()),
                'billing_period' => $request->billing_period,
                'billing_date' => now(),
                'due_date' => $request->due_date,
                'previous_reading' => $previousReading,
                'current_reading' => $currentReading,
                'consumption_kwh' => $consumption,
                'previous_reading_date' => $lastBill?->billing_date ?? now()->subMonth(),
                'current_reading_date' => now(),
                'consumption_days' => 30,
                'generation_charge' => $generationCharge,
                'transmission_charge' => $transmissionCharge,
                'system_loss_charge' => $systemLossCharge,
                'distribution_charge' => $distributionCharge,
                'subsidies_charge' => $subsidiesCharge,
                'vat' => $vat,
                'total_amount_due' => $totalDue,
                'status' => 'unpaid',
            ]);

            $generated++;
        }

        return response()->json([
            'message' => "Generated {$generated} bills for period {$request->billing_period}.",
            'generated_count' => $generated,
        ]);
    }

    public function adjustment(Request $request): JsonResponse
    {
        $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'amount' => 'required|numeric',
            'reason' => 'required|string',
        ]);

        $bill = Bill::findOrFail($request->bill_id);
        $bill->update([
            'other_charges' => $bill->other_charges + $request->amount,
            'total_amount_due' => $bill->total_amount_due + $request->amount,
            'notes' => ($bill->notes ? $bill->notes . "\n" : '') . "Adjustment: {$request->reason} (₱" . number_format($request->amount, 2) . ")",
        ]);

        return response()->json(['message' => 'Bill adjusted.', 'bill' => $bill]);
    }

    public function rebill(Request $request): JsonResponse
    {
        $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'new_reading' => 'required|numeric',
        ]);

        $bill = Bill::findOrFail($request->bill_id);
        $newConsumption = $request->new_reading - $bill->previous_reading;

        $bill->update([
            'current_reading' => $request->new_reading,
            'consumption_kwh' => $newConsumption,
            'status' => 'unpaid',
        ]);

        return response()->json(['message' => 'Bill recalculated.', 'bill' => $bill->fresh()]);
    }

    public function cycles(): JsonResponse
    {
        $cycles = Bill::select('billing_period')
            ->distinct()
            ->orderBy('billing_period', 'desc')
            ->get()
            ->pluck('billing_period');

        return response()->json($cycles);
    }

    public function createCycle(Request $request): JsonResponse
    {
        $request->validate([
            'billing_period' => 'required|string|unique:bills,billing_period',
            'due_date' => 'required|date|after:today',
            'disconnection_date' => 'required|date|after:due_date',
        ]);

        return response()->json(['message' => 'Billing cycle created. Ready for bill generation.']);
    }

    public function payments(Request $request): JsonResponse
    {
        $transactions = Transaction::with('consumerAccount.user', 'bill')
            ->where('type', 'payment')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->method, fn($q) => $q->where('payment_method', $request->method))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($transactions);
    }

    public function verifyPayment(Request $request): JsonResponse
    {
        $request->validate([
            'transaction_id' => 'required|exists:transactions,id',
            'status' => 'required|in:confirmed,failed',
        ]);

        $transaction = Transaction::findOrFail($request->transaction_id);
        $transaction->update([
            'status' => $request->status,
            'confirmed_at' => $request->status === 'confirmed' ? now() : null,
        ]);

        if ($request->status === 'confirmed') {
            $transaction->bill->update([
                'amount_paid' => $transaction->bill->amount_paid + $transaction->amount,
                'balance' => max(0, $transaction->bill->total_amount_due - $transaction->bill->amount_paid - $transaction->amount),
                'payment_status' => 'paid',
                'status' => 'paid',
                'paid_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Payment ' . $request->status . '.', 'transaction' => $transaction->fresh()]);
    }

    public function collectionReport(Request $request): JsonResponse
    {
        $startDate = $request->start_date ?? now()->startOfMonth();
        $endDate = $request->end_date ?? now()->endOfMonth();

        $totalBilled = Bill::whereBetween('created_at', [$startDate, $endDate])->sum('total_amount_due');
        $totalCollected = Transaction::where('status', 'confirmed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('amount');

        $byMethod = Transaction::where('status', 'confirmed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('payment_method')
            ->get();

        return response()->json([
            'period' => ['start' => $startDate, 'end' => $endDate],
            'total_billed' => $totalBilled,
            'total_collected' => $totalCollected,
            'collection_rate' => $totalBilled > 0 ? round(($totalCollected / $totalBilled) * 100, 2) : 0,
            'by_method' => $byMethod,
            'daily_collection' => Transaction::where('status', 'confirmed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')
                ->get(),
        ]);
    }

    public function meterReadings(Request $request): JsonResponse
    {
        $readings = BillReading::with('bill.consumerAccount.user')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->date, fn($q) => $q->whereDate('created_at', $request->date))
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($readings);
    }

    public function validateReading(Request $request): JsonResponse
    {
        $request->validate([
            'reading_id' => 'required|exists:bill_readings,id',
            'status' => 'required|in:validated,rejected',
            'remarks' => 'nullable|string',
        ]);

        $reading = BillReading::findOrFail($request->reading_id);
        $reading->update([
            'status' => $request->status,
            'remarks' => $request->remarks,
        ]);

        return response()->json(['message' => 'Reading ' . $request->status . '.', 'reading' => $reading]);
    }
}
