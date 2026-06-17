class BillModel {
  final int id;
  final String billNumber;
  final String billingPeriod;
  final String billingDate;
  final String dueDate;
  final double previousReading;
  final double currentReading;
  final double consumptionKwh;
  final double generationCharge;
  final double transmissionCharge;
  final double systemLossCharge;
  final double distributionCharge;
  final double subsidiesCharge;
  final double vat;
  final double totalAmountDue;
  final double amountPaid;
  final double balance;
  final String status;
  final String? paidAt;
  final String? paymentReference;

  BillModel({
    required this.id,
    required this.billNumber,
    required this.billingPeriod,
    required this.billingDate,
    required this.dueDate,
    required this.previousReading,
    required this.currentReading,
    required this.consumptionKwh,
    required this.generationCharge,
    required this.transmissionCharge,
    required this.systemLossCharge,
    required this.distributionCharge,
    required this.subsidiesCharge,
    required this.vat,
    required this.totalAmountDue,
    required this.amountPaid,
    required this.balance,
    required this.status,
    this.paidAt,
    this.paymentReference,
  });

  bool get isPaid => status == 'paid';
  bool get isOverdue => status == 'unpaid' && DateTime.parse(dueDate).isBefore(DateTime.now());
  int get daysUntilDue => DateTime.now().difference(DateTime.parse(dueDate)).inDays;

  factory BillModel.fromJson(Map<String, dynamic> json) {
    return BillModel(
      id: json['id'] ?? 0,
      billNumber: json['bill_number'] ?? '',
      billingPeriod: json['billing_period'] ?? '',
      billingDate: json['billing_date'] ?? '',
      dueDate: json['due_date'] ?? '',
      previousReading: (json['previous_reading'] ?? 0).toDouble(),
      currentReading: (json['current_reading'] ?? 0).toDouble(),
      consumptionKwh: (json['consumption_kwh'] ?? 0).toDouble(),
      generationCharge: (json['generation_charge'] ?? 0).toDouble(),
      transmissionCharge: (json['transmission_charge'] ?? 0).toDouble(),
      systemLossCharge: (json['system_loss_charge'] ?? 0).toDouble(),
      distributionCharge: (json['distribution_charge'] ?? 0).toDouble(),
      subsidiesCharge: (json['subsidies_charge'] ?? 0).toDouble(),
      vat: (json['vat'] ?? 0).toDouble(),
      totalAmountDue: (json['total_amount_due'] ?? 0).toDouble(),
      amountPaid: (json['amount_paid'] ?? 0).toDouble(),
      balance: (json['balance'] ?? 0).toDouble(),
      status: json['status'] ?? '',
      paidAt: json['paid_at'],
      paymentReference: json['payment_reference'],
    );
  }

  Map<String, dynamic> get breakdown => {
    'Generation Charge': generationCharge,
    'Transmission Charge': transmissionCharge,
    'System Loss Charge': systemLossCharge,
    'Distribution Charge': distributionCharge,
    'Subsidies Charge': subsidiesCharge,
    'VAT (12%)': vat,
  };
}

class BillHistory {
  final int id;
  final String billNumber;
  final String billingPeriod;
  final double totalAmountDue;
  final double amountPaid;
  final String status;
  final String dueDate;
  final String? paidAt;
  final double consumptionKwh;

  BillHistory({
    required this.id,
    required this.billNumber,
    required this.billingPeriod,
    required this.totalAmountDue,
    required this.amountPaid,
    required this.status,
    required this.dueDate,
    this.paidAt,
    required this.consumptionKwh,
  });

  factory BillHistory.fromJson(Map<String, dynamic> json) => BillHistory(
    id: json['id'],
    billNumber: json['bill_number'],
    billingPeriod: json['billing_period'],
    totalAmountDue: (json['total_amount_due'] ?? 0).toDouble(),
    amountPaid: (json['amount_paid'] ?? 0).toDouble(),
    status: json['status'],
    dueDate: json['due_date'],
    paidAt: json['paid_at'],
    consumptionKwh: (json['consumption_kwh'] ?? 0).toDouble(),
  );
}
