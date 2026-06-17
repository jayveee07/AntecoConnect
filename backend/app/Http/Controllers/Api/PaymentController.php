<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function methods(): JsonResponse
    {
        $methods = PaymentGateway::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'code' => $m->code,
                'name' => $m->name,
                'type' => $m->type,
                'fee_percentage' => $m->fee_percentage,
                'fee_fixed' => $m->fee_fixed,
                'icon' => match($m->code) {
                    'gcash' => 'https://cdn.anteconect.com/icons/gcash.svg',
                    'maya' => 'https://cdn.anteconect.com/icons/maya.svg',
                    'bank_bpi' => 'https://cdn.anteconect.com/icons/bpi.svg',
                    'card' => 'https://cdn.anteconect.com/icons/credit-card.svg',
                    default => 'https://cdn.anteconect.com/icons/payment.svg',
                },
            ]);

        return response()->json($methods);
    }

    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'bill_id' => 'required|exists:bills,id',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        $account = $user->consumerAccount;

        $bill = $account->bills()->findOrFail($validated['bill_id']);

        $transaction = Transaction::create([
            'consumer_account_id' => $account->id,
            'bill_id' => $bill->id,
            'transaction_number' => 'TXN-' . strtoupper(uniqid()),
            'type' => 'payment',
            'payment_method' => $validated['payment_method'],
            'payment_channel' => 'mobile',
            'amount' => $validated['amount'],
            'fee' => 0,
            'net_amount' => $validated['amount'],
            'status' => 'pending',
        ]);

        // TODO: Integrate with payment gateway
        // Generate payment URL or QR code

        return response()->json([
            'message' => 'Payment initiated.',
            'transaction' => $transaction,
            'payment_url' => "https://pay.anteconect.com/{$transaction->transaction_number}",
            'qr_code' => "https://api.anteconect.com/qr/payment/{$transaction->transaction_number}",
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'transaction_number' => 'required|string|exists:transactions,transaction_number',
            'reference_number' => 'required|string',
        ]);

        $transaction = Transaction::where('transaction_number', $validated['transaction_number'])->first();

        $transaction->update([
            'reference_number' => $validated['reference_number'],
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);

        $transaction->bill->update([
            'amount_paid' => $transaction->bill->amount_paid + $transaction->amount,
            'balance' => $transaction->bill->total_amount_due - ($transaction->bill->amount_paid + $transaction->amount),
            'payment_status' => 'paid',
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        return response()->json([
            'message' => 'Payment confirmed successfully.',
            'transaction' => $transaction,
        ]);
    }
}
