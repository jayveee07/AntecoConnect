<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\OTPController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\OutageController;
use App\Http\Controllers\Api\InterruptionNoticeController;
use App\Http\Controllers\Api\ServiceRequestController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\ConsumptionController;
use App\Http\Controllers\Api\WorkOrderController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\Admin\BillingManagementController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\AnnouncementController;
use App\Http\Controllers\Api\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Api\Admin\RateController;

// Public Routes
Route::get('/auth/debug-db', function () {
    $pw = env('DB_PASSWORD');
    return response()->json([
        'pw_length' => strlen($pw),
        'pw_prefix' => substr($pw, 0, 4),
        'pw_suffix' => substr($pw, -4),
        'db_host' => env('DB_HOST'),
        'db_user' => env('DB_USERNAME'),
        'db_name' => env('DB_DATABASE'),
    ]);
});
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/firebase', [AuthController::class, 'firebaseLogin']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

Route::post('/otp/send', [OTPController::class, 'send']);
Route::post('/otp/verify', [OTPController::class, 'verify']);

// Public lookup
Route::get('/interruptions/active', [InterruptionNoticeController::class, 'active']);
Route::get('/faqs', [SupportTicketController::class, 'faqs']);

// Authenticated Consumer Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);
    Route::post('/profile/fcm-token', [ProfileController::class, 'updateFcmToken']);
    Route::delete('/profile', [ProfileController::class, 'deleteAccount']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Consumer Account
    Route::get('/account', [ProfileController::class, 'accountInfo']);

    // Bills
    Route::get('/bills', [BillController::class, 'index']);
    Route::get('/bills/current', [BillController::class, 'current']);
    Route::get('/bills/{bill}', [BillController::class, 'show']);
    Route::get('/bills/{bill}/pdf', [BillController::class, 'downloadPdf']);
    Route::get('/bills/{bill}/receipt', [BillController::class, 'downloadReceipt']);
    Route::get('/bills/history', [BillController::class, 'history']);

    // Payments
    Route::get('/payment-methods', [PaymentController::class, 'methods']);
    Route::post('/payments/initiate', [PaymentController::class, 'initiate']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirm']);
    Route::get('/payments/history', [TransactionController::class, 'history']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);

    // Consumption
    Route::get('/consumption', [ConsumptionController::class, 'index']);
    Route::get('/consumption/daily', [ConsumptionController::class, 'daily']);
    Route::get('/consumption/monthly', [ConsumptionController::class, 'monthly']);
    Route::get('/consumption/yearly', [ConsumptionController::class, 'yearly']);
    Route::get('/consumption/forecast', [ConsumptionController::class, 'forecast']);
    Route::get('/consumption/saving-tips', [ConsumptionController::class, 'savingTips']);
    Route::post('/consumption/adjust', [ConsumptionController::class, 'adjustPlan']);

    // Outages
    Route::post('/outages/report', [OutageController::class, 'report']);
    Route::get('/outages', [OutageController::class, 'index']);
    Route::get('/outages/{outage}', [OutageController::class, 'show']);
    Route::get('/outages/track/{ticketNumber}', [OutageController::class, 'track']);

    // Interruption Notices
    Route::get('/interruptions', [InterruptionNoticeController::class, 'index']);

    // Service Requests
    Route::apiResource('service-requests', ServiceRequestController::class);
    Route::post('/service-requests/{serviceRequest}/requirements', [ServiceRequestController::class, 'uploadRequirements']);
    Route::get('/service-requests/{serviceRequest}/track', [ServiceRequestController::class, 'track']);

    // Support Tickets
    Route::apiResource('support-tickets', SupportTicketController::class);
    Route::post('/support-tickets/{ticket}/messages', [SupportTicketController::class, 'sendMessage']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Reports
    Route::post('/reports/generate', [ReportController::class, 'generate']);
    Route::get('/reports/{report}/download', [ReportController::class, 'download']);

    // Documents
    Route::post('/documents/upload', [DocumentController::class, 'upload']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);
});

// Admin Routes
Route::middleware(['auth:sanctum', 'role:admin|supervisor|general_manager'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/dashboard/revenue', [AdminDashboardController::class, 'revenue']);
    Route::get('/dashboard/operations', [AdminDashboardController::class, 'operations']);

    // User Management
    Route::get('/users', [UserManagementController::class, 'index']);
    Route::get('/users/{user}', [UserManagementController::class, 'show']);
    Route::post('/users', [UserManagementController::class, 'store']);
    Route::put('/users/{user}', [UserManagementController::class, 'update']);
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy']);
    Route::post('/users/{user}/verify', [UserManagementController::class, 'verify']);

    // Consumer Accounts
    Route::get('/consumers', [UserManagementController::class, 'consumers']);
    Route::get('/consumers/{account}', [UserManagementController::class, 'consumerDetail']);

    // Billing Management
    Route::get('/billing', [BillingManagementController::class, 'index']);
    Route::post('/billing/generate', [BillingManagementController::class, 'generateBills']);
    Route::post('/billing/adjustment', [BillingManagementController::class, 'adjustment']);
    Route::post('/billing/rebill', [BillingManagementController::class, 'rebill']);
    Route::get('/billing/cycles', [BillingManagementController::class, 'cycles']);
    Route::post('/billing/cycles', [BillingManagementController::class, 'createCycle']);

    // Rates
    Route::apiResource('rates', RateController::class);

    // Payments
    Route::get('/payments', [BillingManagementController::class, 'payments']);
    Route::post('/payments/verify', [BillingManagementController::class, 'verifyPayment']);
    Route::get('/collections/report', [BillingManagementController::class, 'collectionReport']);

    // Meter Reading
    Route::get('/meter-readings', [BillingManagementController::class, 'meterReadings']);
    Route::post('/meter-readings/validate', [BillingManagementController::class, 'validateReading']);

    // Outages
    Route::get('/outages', [\App\Http\Controllers\Api\Admin\OutageManagementController::class, 'index']);
    Route::put('/outages/{outage}', [\App\Http\Controllers\Api\Admin\OutageManagementController::class, 'update']);
    Route::post('/outages/{outage}/assign', [\App\Http\Controllers\Api\Admin\OutageManagementController::class, 'assign']);

    // Work Orders
    Route::get('/work-orders', [\App\Http\Controllers\Api\Admin\WorkOrderController::class, 'index']);
    Route::post('/work-orders', [\App\Http\Controllers\Api\Admin\WorkOrderController::class, 'store']);
    Route::put('/work-orders/{workOrder}', [\App\Http\Controllers\Api\Admin\WorkOrderController::class, 'update']);
    Route::post('/work-orders/{workOrder}/assign', [\App\Http\Controllers\Api\Admin\WorkOrderController::class, 'assign']);

    // Service Requests
    Route::get('/service-requests', [\App\Http\Controllers\Api\Admin\ServiceRequestManagementController::class, 'index']);
    Route::put('/service-requests/{serviceRequest}', [\App\Http\Controllers\Api\Admin\ServiceRequestManagementController::class, 'update']);

    // Announcements
    Route::apiResource('announcements', AnnouncementController::class);

    // Reports
    Route::get('/reports', [AdminReportController::class, 'index']);
    Route::post('/reports/generate', [AdminReportController::class, 'generate']);

    // GIS Data
    Route::get('/gis/poles', [\App\Http\Controllers\Api\Admin\GisController::class, 'poles']);
    Route::get('/gis/transformers', [\App\Http\Controllers\Api\Admin\GisController::class, 'transformers']);
    Route::get('/gis/feeders', [\App\Http\Controllers\Api\Admin\GisController::class, 'feeders']);
    Route::get('/gis/service-areas', [\App\Http\Controllers\Api\Admin\GisController::class, 'serviceAreas']);
});

// Technician Routes
Route::middleware(['auth:sanctum', 'role:technician|meter_reader'])->prefix('technician')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Api\Technician\DashboardController::class, 'index']);
    Route::get('/work-orders', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'index']);
    Route::get('/work-orders/{workOrder}', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'show']);
    Route::put('/work-orders/{workOrder}/accept', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'accept']);
    Route::put('/work-orders/{workOrder}/start', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'start']);
    Route::put('/work-orders/{workOrder}/complete', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'complete']);
    Route::post('/work-orders/{workOrder}/photos', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'uploadPhotos']);
    Route::post('/work-orders/{workOrder}/signature', [\App\Http\Controllers\Api\Technician\WorkOrderController::class, 'uploadSignature']);

    Route::get('/meter-reading/schedule', [\App\Http\Controllers\Api\Technician\MeterReadingController::class, 'schedule']);
    Route::put('/meter-reading/reading', [\App\Http\Controllers\Api\Technician\MeterReadingController::class, 'submitReading']);
    Route::post('/meter-reading/photo', [\App\Http\Controllers\Api\Technician\MeterReadingController::class, 'uploadPhoto']);
});
