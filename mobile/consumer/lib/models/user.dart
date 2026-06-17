class UserModel {
  final int id;
  final String consumerCode;
  final String firstName;
  final String lastName;
  final String email;
  final String mobileNumber;
  final String? profilePhoto;
  final bool isVerified;
  final List<String> roles;

  UserModel({
    required this.id,
    required this.consumerCode,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.mobileNumber,
    this.profilePhoto,
    this.isVerified = false,
    this.roles = const [],
  });

  String get fullName => '$firstName $lastName';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      consumerCode: json['consumer_code'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      email: json['email'] ?? '',
      mobileNumber: json['mobile_number'] ?? '',
      profilePhoto: json['profile_photo'],
      isVerified: json['is_verified'] ?? false,
      roles: List<String>.from(json['roles'] ?? []),
    );
  }
}

class AccountModel {
  final int id;
  final String accountNumber;
  final String meterNumber;
  final String serviceAddress;
  final String connectionType;
  final String status;
  final String? poleNumber;
  final String? transformerNumber;
  final String? feeder;
  final double voltage;
  final double amperage;
  final double securityDeposit;

  AccountModel({
    required this.id,
    required this.accountNumber,
    required this.meterNumber,
    required this.serviceAddress,
    required this.connectionType,
    required this.status,
    this.poleNumber,
    this.transformerNumber,
    this.feeder,
    this.voltage = 220,
    this.amperage = 30,
    this.securityDeposit = 0,
  });

  factory AccountModel.fromJson(Map<String, dynamic> json) {
    return AccountModel(
      id: json['id'] ?? 0,
      accountNumber: json['account_number'] ?? '',
      meterNumber: json['meter_number'] ?? '',
      serviceAddress: json['service_address'] ?? '',
      connectionType: json['connection_type'] ?? '',
      status: json['status'] ?? '',
      poleNumber: json['pole_number'],
      transformerNumber: json['transformer_number'],
      feeder: json['feeder'],
      voltage: (json['voltage'] ?? 220).toDouble(),
      amperage: (json['amperage'] ?? 30).toDouble(),
      securityDeposit: (json['security_deposit'] ?? 0).toDouble(),
    );
  }
}
