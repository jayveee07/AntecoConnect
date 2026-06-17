<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\TicketMessage;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tickets = $request->user()->supportTickets()
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|in:billing,technical,account,others',
            'subject' => 'required|string|max:200',
            'description' => 'required|string',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240',
        ]);

        $validated['ticket_number'] = 'TKT-' . strtoupper(uniqid());
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'open';

        $ticket = SupportTicket::create($validated);

        return response()->json([
            'message' => 'Support ticket created.',
            'ticket' => $ticket,
        ], 201);
    }

    public function show(SupportTicket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);
        $ticket->load('messages.user', 'assignedTo');

        return response()->json($ticket);
    }

    public function sendMessage(Request $request, SupportTicket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        $validated = $request->validate([
            'message' => 'required|string',
            'attachments' => 'nullable|array',
        ]);

        $message = TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'attachments' => $validated['attachments'] ?? null,
            'is_staff_reply' => $request->user()->hasRole(['admin', 'supervisor']),
        ]);

        $ticket->update(['status' => 'in_progress']);

        return response()->json([
            'message' => 'Message sent.',
            'data' => $message,
        ]);
    }

    public function faqs(): JsonResponse
    {
        $faqs = Faq::where('is_published', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('category');

        return response()->json($faqs);
    }
}
