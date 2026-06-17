<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsumerRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RateController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(ConsumerRate::where('is_active', true)->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rate_code' => 'required|string|max:20|unique:consumer_rates',
            'description' => 'required|string',
            'consumer_type' => 'required|string',
            'generation_charge' => 'required|numeric',
            'transmission_charge' => 'required|numeric',
            'system_loss_charge' => 'required|numeric',
            'distribution_charge' => 'required|numeric',
            'subsidies_charge' => 'required|numeric',
            'lifeline_discount' => 'numeric',
            'senior_discount' => 'numeric',
            'vat_rate' => 'numeric',
        ]);

        $rate = ConsumerRate::create($validated);

        return response()->json(['message' => 'Rate created.', 'data' => $rate], 201);
    }

    public function update(Request $request, ConsumerRate $rate): JsonResponse
    {
        $validated = $request->validate([
            'generation_charge' => 'sometimes|numeric',
            'transmission_charge' => 'sometimes|numeric',
            'system_loss_charge' => 'sometimes|numeric',
            'distribution_charge' => 'sometimes|numeric',
            'subsidies_charge' => 'sometimes|numeric',
            'is_active' => 'sometimes|boolean',
        ]);

        $rate->update($validated);

        return response()->json(['message' => 'Rate updated.', 'data' => $rate->fresh()]);
    }
}
