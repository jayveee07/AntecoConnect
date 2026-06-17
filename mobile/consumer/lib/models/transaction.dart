class TransactionModel {
  final int id;
  final String transactionNumber;
  final String type;
  final String paymentMethod;
  final double amount;
  final double fee;
  final double netAmount;
  final String? referenceNumber;
  final String status;
  final String? confirmedAt;
  final String createdAt;

  TransactionModel({
    required this.id,
    required this.transactionNumber,
    required this.type,
    required this.paymentMethod,
    required this.amount,
    required this.fee,
    required this.netAmount,
    this.referenceNumber,
    required this.status,
    this.confirmedAt,
    required this.createdAt,
  });

  String get paymentMethodLabel {
    switch (paymentMethod) {
      case 'gcash': return 'GCash';
      case 'maya': return 'Maya';
      case 'bank_transfer': return 'Bank Transfer';
      case 'credit_card': return 'Credit/Debit Card';
      case 'cash': return 'Cash';
      default: return paymentMethod;
    }
  }

  String get statusLabel {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  }

  factory TransactionModel.fromJson(Map<String, dynamic> json) => TransactionModel(
    id: json['id'],
    transactionNumber: json['transaction_number'],
    type: json['type'],
    paymentMethod: json['payment_method'],
    amount: (json['amount'] ?? 0).toDouble(),
    fee: (json['fee'] ?? 0).toDouble(),
    netAmount: (json['net_amount'] ?? 0).toDouble(),
    referenceNumber: json['reference_number'],
    status: json['status'],
    confirmedAt: json['confirmed_at'],
    createdAt: json['created_at'],
  );
}

class PaymentMethodModel {
  final int id;
  final String code;
  final String name;
  final String type;
  final String icon;
  final double feePercentage;
  final double feeFixed;

  PaymentMethodModel({
    required this.id,
    required this.code,
    required this.name,
    required this.type,
    required this.icon,
    required this.feePercentage,
    required this.feeFixed,
  });

  String get typeLabel {
    switch (type) {
      case 'ewallet': return 'E-Wallet';
      case 'bank': return 'Bank Transfer';
      case 'card': return 'Credit/Debit Card';
      case 'overthecounter': return 'Over-the-Counter';
      default: return type;
    }
  }

  factory PaymentMethodModel.fromJson(Map<String, dynamic> json) => PaymentMethodModel(
    id: json['id'],
    code: json['code'],
    name: json['name'],
    type: json['type'],
    icon: json['icon'] ?? '',
    feePercentage: (json['fee_percentage'] ?? 0).toDouble(),
    feeFixed: (json['fee_fixed'] ?? 0).toDouble(),
  );
}
