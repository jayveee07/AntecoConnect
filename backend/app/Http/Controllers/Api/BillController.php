<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        if (!$account) {
            return response()->json(['message' => 'No consumer account found.'], 404);
        }

        $bills = $account->bills()
            ->orderBy('billing_date', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($bills);
    }

    public function current(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        if (!$account) {
            return response()->json(['message' => 'No consumer account found.'], 404);
        }

        $bill = $account->bills()
            ->where('status', 'unpaid')
            ->latest()
            ->first();

        if (!$bill) {
            return response()->json(['message' => 'No current bill found.'], 404);
        }

        return response()->json([
            'bill' => $bill,
            'breakdown' => [
                ['label' => 'Generation Charge', 'amount' => $bill->generation_charge],
                ['label' => 'Transmission Charge', 'amount' => $bill->transmission_charge],
                ['label' => 'System Loss Charge', 'amount' => $bill->system_loss_charge],
                ['label' => 'Distribution Charge', 'amount' => $bill->distribution_charge],
                ['label' => 'Subsidies Charge', 'amount' => $bill->subsidies_charge],
                ['label' => 'Lifeline Discount', 'amount' => -$bill->lifeline_discount],
                ['label' => 'Senior Discount', 'amount' => -$bill->senior_discount],
                ['label' => 'VAT (12%)', 'amount' => $bill->vat],
                ['label' => 'Franchise Tax', 'amount' => $bill->franchise_tax],
                ['label' => 'Penalty', 'amount' => $bill->penalty],
                ['label' => 'Other Charges', 'amount' => $bill->other_charges],
            ],
        ]);
    }

    public function show(Bill $bill): JsonResponse
    {
        $this->authorize('view', $bill);
        $bill->load('transactions');
        return response()->json($bill);
    }

    public function history(Request $request): JsonResponse
    {
        $account = $request->user()->consumerAccount;
        if (!$account) {
            return response()->json(['message' => 'No consumer account found.'], 404);
        }

        $bills = $account->bills()
            ->select(['id', 'bill_number', 'billing_period', 'total_amount_due', 'amount_paid', 'status', 'due_date', 'paid_at', 'consumption_kwh'])
            ->orderBy('billing_date', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($bills);
    }

    public function downloadPdf(Bill $bill): \Illuminate\Http\Response
    {
        $this->authorize('view', $bill);
        $account = $bill->consumerAccount;
        $user = $account->user;

        $pdf = Pdf::loadView('bills.pdf', compact('bill', 'account', 'user'));
        return $pdf->download("bill-{$bill->bill_number}.pdf");
    }

    public function downloadReceipt(Bill $bill): \Illuminate\Http\Response
    {
        $this->authorize('view', $bill);
        $transaction = $bill->transactions()->where('status', 'confirmed')->first();

        if (!$transaction) {
            abort(404, 'No confirmed payment found.');
        }

        $pdf = Pdf::loadView('bills.receipt', compact('bill', 'transaction'));
        return $pdf->download("receipt-{$bill->bill_number}.pdf");
    }
}
