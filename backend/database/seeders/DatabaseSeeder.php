<?php

namespace Database\Seeders;

use App\Models\AiPrediction;
use App\Models\Announcement;
use App\Models\Bill;
use App\Models\BillReading;
use App\Models\ConsumerAccount;
use App\Models\ConsumerRate;
use App\Models\ConsumptionData;
use App\Models\Document;
use App\Models\ElectricPole;
use App\Models\EnergySavingTip;
use App\Models\Faq;
use App\Models\Feeder;
use App\Models\InterruptionNotice;
use App\Models\MeterReadingSchedule;
use App\Models\Outage;
use App\Models\PaymentGateway;
use App\Models\Report;
use App\Models\ServiceArea;
use App\Models\ServiceRequest;
use App\Models\SupportTicket;
use App\Models\TicketMessage;
use App\Models\Transaction;
use App\Models\Transformer;
use App\Models\User;
use App\Models\WorkOrder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $consumer1 = User::create([
            'first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juan@example.com',
            'mobile_number' => '09171234567', 'password' => bcrypt('password123'),
            'address_line1' => '123 Rizal St', 'barangay' => 'Poblacion', 'city' => 'Tagum City',
            'province' => 'Davao del Norte', 'zip_code' => '8100', 'consumer_code' => 'ANT-CON001',
            'is_verified' => true, 'email_verified_at' => now(), 'is_active' => true,
        ]);
        $consumer1->assignRole('consumer');

        $consumer2 = User::create([
            'first_name' => 'Maria', 'last_name' => 'Santos', 'email' => 'maria@example.com',
            'mobile_number' => '09179876543', 'password' => bcrypt('password123'),
            'address_line1' => '456 Mabini Ave', 'barangay' => 'Buenavista', 'city' => 'Tagum City',
            'province' => 'Davao del Norte', 'zip_code' => '8100', 'consumer_code' => 'ANT-CON002',
            'is_verified' => true, 'email_verified_at' => now(), 'is_active' => true,
        ]);
        $consumer2->assignRole('consumer');

        $admin = User::create([
            'first_name' => 'Admin', 'last_name' => 'User', 'email' => 'admin@anteco.com',
            'mobile_number' => '09170000001', 'password' => bcrypt('admin123'),
            'address_line1' => 'Admin Office', 'barangay' => 'Poblacion', 'city' => 'Tagum City',
            'province' => 'Davao del Norte', 'zip_code' => '8100', 'consumer_code' => 'ANT-ADM001',
            'is_verified' => true, 'email_verified_at' => now(), 'is_active' => true,
        ]);
        $admin->assignRole('admin');

        $tech = User::create([
            'first_name' => 'Pedro', 'last_name' => 'Tech', 'email' => 'tech@anteco.com',
            'mobile_number' => '09170000002', 'password' => bcrypt('tech123'),
            'address_line1' => 'Service Center', 'barangay' => 'Magugpo', 'city' => 'Tagum City',
            'province' => 'Davao del Norte', 'zip_code' => '8100', 'consumer_code' => 'ANT-TCH001',
            'is_verified' => true, 'email_verified_at' => now(), 'is_active' => true,
        ]);
        $tech->assignRole('technician');

        // 2. Consumer Rates
        ConsumerRate::create(['rate_code' => 'RES-001', 'description' => 'Residential Rate Tier 1', 'consumer_type' => 'residential', 'generation_charge' => 4.50, 'transmission_charge' => 0.80, 'system_loss_charge' => 0.50, 'distribution_charge' => 1.20, 'subsidies_charge' => 0.30, 'lifeline_discount' => 0.00, 'senior_discount' => 0.00, 'vat_rate' => 12.00, 'franchise_tax' => 2.00, 'is_active' => true]);
        ConsumerRate::create(['rate_code' => 'COM-001', 'description' => 'Commercial Rate', 'consumer_type' => 'commercial', 'generation_charge' => 5.20, 'transmission_charge' => 0.90, 'system_loss_charge' => 0.55, 'distribution_charge' => 1.50, 'subsidies_charge' => 0.25, 'lifeline_discount' => 0.00, 'senior_discount' => 0.00, 'vat_rate' => 12.00, 'franchise_tax' => 2.00, 'is_active' => true]);

        // 3. FAQs
        Faq::create(['category' => 'billing', 'question' => 'How do I view my bill?', 'answer' => 'You can view your bill by logging into your account and navigating to the Billing section.', 'is_published' => true, 'sort_order' => 1]);
        Faq::create(['category' => 'outage', 'question' => 'How do I report an outage?', 'answer' => 'Go to the Outages section and click Report Outage. Fill in the details and submit.', 'is_published' => true, 'sort_order' => 2]);

        // 4. Energy Saving Tips
        EnergySavingTip::create(['category' => 'lighting', 'title' => 'Switch to LED Bulbs', 'description' => 'Replace incandescent bulbs with LED to save up to 80% on lighting costs.', 'estimated_savings_percent' => 15.00, 'difficulty' => 'easy', 'is_active' => true, 'sort_order' => 1]);
        EnergySavingTip::create(['category' => 'appliances', 'title' => 'Unplug Idle Electronics', 'description' => 'Devices on standby still consume power. Unplug when not in use.', 'estimated_savings_percent' => 5.00, 'difficulty' => 'easy', 'is_active' => true, 'sort_order' => 2]);

        // 5. Feeders
        Feeder::create(['feeder_code' => 'FDR-001', 'name' => 'Tagum North Feeder', 'substation' => 'Tagum Main Substation', 'voltage_level' => '13.8kV', 'capacity_mva' => 25.00, 'current_load_mva' => 18.50, 'status' => 'normal']);
        Feeder::create(['feeder_code' => 'FDR-002', 'name' => 'Tagum South Feeder', 'substation' => 'Tagum Main Substation', 'voltage_level' => '13.8kV', 'capacity_mva' => 20.00, 'current_load_mva' => 14.20, 'status' => 'normal']);

        // 6. Transformers
        Transformer::create(['transformer_number' => 'XFRM-001', 'type' => 'distribution', 'capacity_kva' => '100', 'voltage_primary' => '13.8kV', 'voltage_secondary' => '240V', 'phase_type' => 'single', 'latitude' => '7.4478', 'longitude' => '125.8040', 'barangay' => 'Poblacion', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'pole_number' => 'POL-001', 'feeder' => 'FDR-001', 'status' => 'active', 'installation_date' => now()->subYears(2), 'consumers_served' => 45]);
        Transformer::create(['transformer_number' => 'XFRM-002', 'type' => 'distribution', 'capacity_kva' => '250', 'voltage_primary' => '13.8kV', 'voltage_secondary' => '480V', 'phase_type' => 'three', 'latitude' => '7.4500', 'longitude' => '125.8100', 'barangay' => 'Buenavista', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'pole_number' => 'POL-002', 'feeder' => 'FDR-002', 'status' => 'active', 'installation_date' => now()->subYears(1), 'consumers_served' => 78]);

        // 7. Electric Poles
        ElectricPole::create(['pole_number' => 'POL-001', 'pole_type' => 'concrete', 'latitude' => '7.4478', 'longitude' => '125.8040', 'barangay' => 'Poblacion', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'status' => 'active', 'feeder' => 'FDR-001', 'transformer_number' => 'XFRM-001']);
        ElectricPole::create(['pole_number' => 'POL-002', 'pole_type' => 'steel', 'latitude' => '7.4500', 'longitude' => '125.8100', 'barangay' => 'Buenavista', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'status' => 'active', 'feeder' => 'FDR-002', 'transformer_number' => 'XFRM-002']);

        // 8. Payment Gateways
        PaymentGateway::create(['code' => 'gcash', 'name' => 'GCash', 'type' => 'ewallet', 'is_active' => true, 'fee_percentage' => 1.50, 'fee_fixed' => 5.00, 'config' => ['merchant_id' => 'ANTECO-GCASH'], 'sort_order' => 1]);
        PaymentGateway::create(['code' => 'bayad_center', 'name' => 'Bayad Center', 'type' => 'overthecounter', 'is_active' => true, 'fee_percentage' => 0.00, 'fee_fixed' => 10.00, 'config' => ['partner_code' => 'ANTECO-BAYAD'], 'sort_order' => 2]);

        // 9. Consumer Accounts
        $acct1 = ConsumerAccount::create(['user_id' => $consumer1->id, 'account_number' => 'ANT-ACC-00001', 'meter_number' => 'MTR-00001', 'service_address' => '123 Rizal St, Poblacion, Tagum City', 'connection_type' => 'residential', 'phase_type' => 'single-phase', 'status' => 'active', 'has_smart_meter' => true, 'meter_multiplier' => 1.00, 'feeder' => 'FDR-001', 'connection_date' => now()->subMonths(6)]);
        $acct2 = ConsumerAccount::create(['user_id' => $consumer2->id, 'account_number' => 'ANT-ACC-00002', 'meter_number' => 'MTR-00002', 'service_address' => '456 Mabini Ave, Buenavista, Tagum City', 'connection_type' => 'residential', 'phase_type' => 'single-phase', 'status' => 'active', 'has_smart_meter' => false, 'meter_multiplier' => 1.00, 'feeder' => 'FDR-002', 'connection_date' => now()->subMonths(3)]);

        // 10. Service Areas
        ServiceArea::create(['name' => 'Tagum City Center', 'code' => 'SA-TAG-001', 'barangay' => 'Poblacion', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'assigned_team_id' => $tech->id]);
        ServiceArea::create(['name' => 'Tagum North District', 'code' => 'SA-TAG-002', 'barangay' => 'Buenavista', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'assigned_team_id' => $tech->id]);

        // 11. Outages
        $outage1 = Outage::create(['ticket_number' => 'OUT-2024-001', 'reported_by' => $consumer1->id, 'type' => 'power_outage', 'barangay' => 'Poblacion', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'street_address' => '123 Rizal St', 'latitude' => '7.4478', 'longitude' => '125.8040', 'description' => 'No power in our area since 2pm', 'priority' => 'high', 'status' => 'resolved', 'cause' => 'weather', 'affected_consumers' => 120, 'estimated_restoration' => now()->subHours(3), 'restored_at' => now()->subHours(2)]);
        $outage2 = Outage::create(['ticket_number' => 'OUT-2024-002', 'reported_by' => $consumer2->id, 'type' => 'low_voltage', 'barangay' => 'Buenavista', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'street_address' => '456 Mabini Ave', 'latitude' => '7.4500', 'longitude' => '125.8100', 'description' => 'Lights flickering for the past hour', 'priority' => 'medium', 'status' => 'in_progress', 'cause' => 'equipment_failure', 'affected_consumers' => 45, 'estimated_restoration' => now()->addHours(2)]);

        // 12. Interruption Notices
        InterruptionNotice::create(['title' => 'Scheduled Maintenance - Tagum North', 'type' => 'scheduled', 'description' => 'Annual line maintenance along National Highway', 'affected_areas' => ['Poblacion', 'Mankilam'], 'start_time' => now()->addDays(7)->setHour(9), 'end_time' => now()->addDays(7)->setHour(17), 'status' => 'upcoming', 'reason' => 'Line maintenance and tree trimming', 'created_by' => $admin->id]);
        InterruptionNotice::create(['title' => 'Emergency Repair - Buenavista', 'type' => 'emergency', 'description' => 'Emergency repair of damaged transformer', 'affected_areas' => ['Buenavista', 'Magugpo'], 'start_time' => now()->addDays(2)->setHour(8), 'end_time' => now()->addDays(2)->setHour(16), 'status' => 'upcoming', 'reason' => 'Transformer replacement', 'created_by' => $admin->id]);

        // 13. Support Tickets
        $ticket1 = SupportTicket::create(['ticket_number' => 'TKT-2024-001', 'user_id' => $consumer1->id, 'category' => 'billing', 'subject' => 'Incorrect billing amount', 'description' => 'My bill for this month is too high compared to last month.', 'priority' => 'medium', 'status' => 'open']);
        $ticket2 = SupportTicket::create(['ticket_number' => 'TKT-2024-002', 'user_id' => $consumer2->id, 'category' => 'account', 'subject' => 'Request for new connection', 'description' => 'I would like to apply for a new electrical connection for my new house.', 'priority' => 'low', 'status' => 'open']);

        // 14. Announcements
        Announcement::create(['title' => 'System Maintenance Tonight', 'content' => 'Our billing system will be under maintenance from 12AM to 4AM.', 'type' => 'maintenance', 'priority' => 'high', 'is_push_notification' => true, 'is_active' => true, 'published_at' => now(), 'created_by' => $admin->id]);
        Announcement::create(['title' => 'New Payment Partner', 'content' => 'We are pleased to announce our partnership with GCash for online payments.', 'type' => 'general', 'priority' => 'low', 'is_push_notification' => true, 'is_active' => true, 'published_at' => now(), 'created_by' => $admin->id]);

        // 15. Meter Reading Schedules
        MeterReadingSchedule::create(['meter_reader_id' => $tech->id, 'reading_date' => now()->addDays(5), 'route_code' => 'RTE-001', 'assigned_meters' => ['MTR-00001', 'MTR-00002'], 'status' => 'pending', 'total_meters' => 2, 'read_meters' => 0]);
        MeterReadingSchedule::create(['meter_reader_id' => $tech->id, 'reading_date' => now()->addDays(10), 'route_code' => 'RTE-002', 'assigned_meters' => ['MTR-00003', 'MTR-00004', 'MTR-00005'], 'status' => 'pending', 'total_meters' => 3, 'read_meters' => 0]);

        // 16. Service Requests
        $sr1 = ServiceRequest::create(['request_number' => 'SR-2024-001', 'user_id' => $consumer1->id, 'consumer_account_id' => $acct1->id, 'type' => 'reconnection', 'status' => 'approved', 'preferred_date' => now()->addDays(3), 'assigned_to' => $tech->id]);
        $sr2 = ServiceRequest::create(['request_number' => 'SR-2024-002', 'user_id' => $consumer2->id, 'consumer_account_id' => $acct2->id, 'type' => 'meter_calibration', 'status' => 'submitted', 'preferred_date' => now()->addDays(7)]);

        // 17. Bills
        $bill1 = Bill::create(['consumer_account_id' => $acct1->id, 'bill_number' => 'BILL-2024-06-001', 'billing_period' => '2024-06', 'billing_date' => now()->subDays(10), 'due_date' => now()->addDays(5), 'previous_reading' => 1000, 'current_reading' => 1250, 'consumption_kwh' => 250, 'previous_reading_date' => now()->subMonths(1), 'current_reading_date' => now()->subDays(10), 'consumption_days' => 30, 'generation_charge' => 1125, 'transmission_charge' => 200, 'system_loss_charge' => 125, 'distribution_charge' => 300, 'subsidies_charge' => 75, 'vat' => 220, 'franchise_tax' => 36, 'total_amount_due' => 2081, 'amount_paid' => 2081, 'balance' => 0, 'status' => 'paid', 'payment_status' => 'paid', 'paid_at' => now()->subDays(5)]);
        $bill2 = Bill::create(['consumer_account_id' => $acct1->id, 'bill_number' => 'BILL-2024-07-001', 'billing_period' => '2024-07', 'billing_date' => now()->subDays(5), 'due_date' => now()->addDays(20), 'previous_reading' => 1250, 'current_reading' => 1520, 'consumption_kwh' => 270, 'previous_reading_date' => now()->subDays(10), 'current_reading_date' => now()->subDays(5), 'consumption_days' => 31, 'generation_charge' => 1215, 'transmission_charge' => 216, 'system_loss_charge' => 135, 'distribution_charge' => 324, 'subsidies_charge' => 81, 'vat' => 238, 'franchise_tax' => 39, 'total_amount_due' => 2248, 'amount_paid' => 0, 'balance' => 2248, 'status' => 'unpaid', 'payment_status' => 'unpaid']);
        $bill3 = Bill::create(['consumer_account_id' => $acct2->id, 'bill_number' => 'BILL-2024-06-002', 'billing_period' => '2024-06', 'billing_date' => now()->subDays(10), 'due_date' => now()->subDays(2), 'previous_reading' => 800, 'current_reading' => 1020, 'consumption_kwh' => 220, 'previous_reading_date' => now()->subMonths(1), 'current_reading_date' => now()->subDays(10), 'consumption_days' => 30, 'generation_charge' => 990, 'transmission_charge' => 176, 'system_loss_charge' => 110, 'distribution_charge' => 264, 'subsidies_charge' => 66, 'vat' => 193, 'franchise_tax' => 32, 'total_amount_due' => 1831, 'amount_paid' => 1831, 'balance' => 0, 'status' => 'paid', 'payment_status' => 'paid', 'paid_at' => now()->subDays(6)]);
        $bill4 = Bill::create(['consumer_account_id' => $acct2->id, 'bill_number' => 'BILL-2024-07-002', 'billing_period' => '2024-07', 'billing_date' => now()->subDays(5), 'due_date' => now()->addDays(20), 'previous_reading' => 1020, 'current_reading' => 1300, 'consumption_kwh' => 280, 'previous_reading_date' => now()->subDays(10), 'current_reading_date' => now()->subDays(5), 'consumption_days' => 31, 'generation_charge' => 1260, 'transmission_charge' => 224, 'system_loss_charge' => 140, 'distribution_charge' => 336, 'subsidies_charge' => 84, 'vat' => 245, 'franchise_tax' => 40, 'total_amount_due' => 2329, 'amount_paid' => 0, 'balance' => 2329, 'status' => 'unpaid', 'payment_status' => 'unpaid']);

        // 18. Work Orders
        WorkOrder::create(['work_order_number' => 'WO-2024-001', 'type' => 'repair', 'priority' => 'emergency', 'status' => 'completed', 'assigned_to' => $tech->id, 'supervisor_id' => $admin->id, 'outage_id' => $outage1->id, 'address' => '123 Rizal St', 'barangay' => 'Poblacion', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'scheduled_start' => now()->subDays(2), 'scheduled_end' => now()->subDays(2)->addHours(4), 'started_at' => now()->subDays(2), 'completed_at' => now()->subDays(2)->addHours(3), 'description' => 'Clear fallen tree from power line', 'completion_notes' => 'Tree removed, power restored.']);
        WorkOrder::create(['work_order_number' => 'WO-2024-002', 'type' => 'reconnection', 'priority' => 'urgent', 'status' => 'in_progress', 'assigned_to' => $tech->id, 'supervisor_id' => $admin->id, 'service_request_id' => $sr1->id, 'address' => '456 Mabini Ave', 'barangay' => 'Buenavista', 'city' => 'Tagum City', 'province' => 'Davao del Norte', 'scheduled_start' => now()->addDays(3), 'scheduled_end' => now()->addDays(3)->addHours(2), 'description' => 'Reconnect service for customer']);

        // 19. Transactions
        Transaction::create(['consumer_account_id' => $acct1->id, 'bill_id' => $bill1->id, 'processed_by' => $consumer1->id, 'transaction_number' => 'TXN-2024-06-001', 'type' => 'payment', 'payment_method' => 'gcash', 'amount' => 2081, 'fee' => 31.22, 'net_amount' => 2049.78, 'reference_number' => 'GCASH-REF-001', 'status' => 'confirmed', 'confirmed_at' => now()->subDays(5)]);
        Transaction::create(['consumer_account_id' => $acct2->id, 'bill_id' => $bill3->id, 'processed_by' => $consumer2->id, 'transaction_number' => 'TXN-2024-06-002', 'type' => 'payment', 'payment_method' => 'cash', 'amount' => 1831, 'fee' => 0, 'net_amount' => 1831, 'reference_number' => 'CASH-REF-001', 'status' => 'confirmed', 'confirmed_at' => now()->subDays(6)]);

        // 20. Bill Readings
        BillReading::create(['bill_id' => $bill1->id, 'meter_reader_id' => $tech->id, 'reading_value' => 1250, 'reading_type' => 'current', 'source' => 'manual', 'status' => 'validated']);
        BillReading::create(['bill_id' => $bill2->id, 'meter_reader_id' => $tech->id, 'reading_value' => 1520, 'reading_type' => 'current', 'source' => 'manual', 'status' => 'validated']);

        // 21. Consumption Data
        ConsumptionData::create(['consumer_account_id' => $acct1->id, 'period_type' => 'monthly', 'period_date' => now()->subMonth(), 'period_year' => now()->year, 'period_month' => now()->subMonth()->month, 'consumption_kwh' => 250, 'estimated_cost' => 2081, 'status' => 'actual']);
        ConsumptionData::create(['consumer_account_id' => $acct1->id, 'period_type' => 'monthly', 'period_date' => now(), 'period_year' => now()->year, 'period_month' => now()->month, 'consumption_kwh' => 270, 'estimated_cost' => 2248, 'status' => 'estimated']);
        ConsumptionData::create(['consumer_account_id' => $acct2->id, 'period_type' => 'monthly', 'period_date' => now()->subMonth(), 'period_year' => now()->year, 'period_month' => now()->subMonth()->month, 'consumption_kwh' => 220, 'estimated_cost' => 1831, 'status' => 'actual']);
        ConsumptionData::create(['consumer_account_id' => $acct2->id, 'period_type' => 'monthly', 'period_date' => now(), 'period_year' => now()->year, 'period_month' => now()->month, 'consumption_kwh' => 280, 'estimated_cost' => 2329, 'status' => 'estimated']);

        // 22. Ai Predictions
        AiPrediction::create(['consumer_account_id' => $acct1->id, 'prediction_type' => 'consumption_forecast', 'period' => 'next_month', 'predicted_value' => 265, 'confidence_score' => 85.00, 'factors' => ['season' => 'rainy', 'historical_avg' => 260], 'recommendations' => ['Consider energy-saving measures during peak hours'], 'prediction_date' => now(), 'valid_until' => now()->addMonth()]);
        AiPrediction::create(['consumer_account_id' => $acct2->id, 'prediction_type' => 'consumption_forecast', 'period' => 'next_month', 'predicted_value' => 275, 'confidence_score' => 82.00, 'factors' => ['season' => 'rainy', 'historical_avg' => 250], 'recommendations' => ['Check for appliance efficiency'], 'prediction_date' => now(), 'valid_until' => now()->addMonth()]);

        // 23. Ticket Messages
        TicketMessage::create(['ticket_id' => $ticket1->id, 'user_id' => $consumer1->id, 'message' => 'My bill for July seems unusually high. Can you please check?', 'is_staff_reply' => false]);
        TicketMessage::create(['ticket_id' => $ticket1->id, 'user_id' => $admin->id, 'message' => 'We will review your bill and get back to you within 24 hours.', 'is_staff_reply' => true]);
        TicketMessage::create(['ticket_id' => $ticket2->id, 'user_id' => $consumer2->id, 'message' => 'I need a new connection for my new address.', 'is_staff_reply' => false]);

        // 24. Reports
        Report::create(['report_number' => 'RPT-2024-001', 'type' => 'billing', 'format' => 'pdf', 'status' => 'completed', 'parameters' => ['period' => 'June 2024'], 'generated_by' => $admin->id, 'generated_at' => now()]);
        Report::create(['report_number' => 'RPT-2024-002', 'type' => 'outage', 'format' => 'pdf', 'status' => 'completed', 'parameters' => ['period' => 'Q2 2024'], 'generated_by' => $admin->id, 'generated_at' => now()]);

        // 25. Documents
        Document::create(['document_number' => 'DOC-2024-001', 'documentable_type' => 'App\Models\User', 'documentable_id' => $consumer1->id, 'type' => 'identification', 'category' => 'government_id', 'file_name' => 'valid_id.pdf', 'file_path' => 'documents/valid_id.pdf', 'mime_type' => 'application/pdf', 'file_size' => 102400, 'description' => 'Government-issued ID', 'is_verified' => true, 'verified_at' => now(), 'verified_by' => $admin->id]);
        Document::create(['document_number' => 'DOC-2024-002', 'documentable_type' => 'App\Models\ServiceRequest', 'documentable_id' => $sr1->id, 'type' => 'contract', 'category' => 'contract', 'file_name' => 'signed_contract.pdf', 'file_path' => 'documents/signed_contract.pdf', 'mime_type' => 'application/pdf', 'file_size' => 204800, 'description' => 'Signed service contract']);
    }
}
