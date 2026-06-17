class OutageModel {
  final int id;
  final String ticketNumber;
  final String type;
  final String barangay;
  final String city;
  final String province;
  final String streetAddress;
  final String? landmark;
  final String description;
  final String priority;
  final String status;
  final String createdAt;
  final String? estimatedRestoration;
  final String? restoredAt;
  final List<OutageUpdate>? updates;

  OutageModel({
    required this.id,
    required this.ticketNumber,
    required this.type,
    required this.barangay,
    required this.city,
    required this.province,
    required this.streetAddress,
    this.landmark,
    required this.description,
    required this.priority,
    required this.status,
    required this.createdAt,
    this.estimatedRestoration,
    this.restoredAt,
    this.updates,
  });

  String get typeLabel {
    switch (type) {
      case 'power_outage': return 'Power Outage';
      case 'low_voltage': return 'Low Voltage';
      case 'high_voltage': return 'High Voltage';
      case 'broken_meter': return 'Broken Meter';
      case 'fallen_pole': return 'Fallen Pole';
      case 'transformer_issue': return 'Transformer Issue';
      default: return 'Other';
    }
  }

  String get priorityColor {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'gray';
    }
  }

  factory OutageModel.fromJson(Map<String, dynamic> json) => OutageModel(
    id: json['id'],
    ticketNumber: json['ticket_number'],
    type: json['type'],
    barangay: json['barangay'],
    city: json['city'],
    province: json['province'],
    streetAddress: json['street_address'],
    landmark: json['landmark'],
    description: json['description'],
    priority: json['priority'],
    status: json['status'],
    createdAt: json['created_at'],
    estimatedRestoration: json['estimated_restoration'],
    restoredAt: json['restored_at'],
    updates: (json['updates'] as List?)?.map((e) => OutageUpdate.fromJson(e)).toList(),
  );
}

class OutageUpdate {
  final String message;
  final String timestamp;

  OutageUpdate({required this.message, required this.timestamp});

  factory OutageUpdate.fromJson(Map<String, dynamic> json) => OutageUpdate(
    message: json['message'],
    timestamp: json['timestamp'],
  );
}

class InterruptionNotice {
  final int id;
  final String title;
  final String type;
  final String description;
  final List<String> affectedAreas;
  final String startTime;
  final String endTime;
  final String status;
  final String reason;

  InterruptionNotice({
    required this.id,
    required this.title,
    required this.type,
    required this.description,
    required this.affectedAreas,
    required this.startTime,
    required this.endTime,
    required this.status,
    required this.reason,
  });

  factory InterruptionNotice.fromJson(Map<String, dynamic> json) => InterruptionNotice(
    id: json['id'],
    title: json['title'],
    type: json['type'],
    description: json['description'],
    affectedAreas: List<String>.from(json['affected_areas'] ?? []),
    startTime: json['start_time'],
    endTime: json['end_time'],
    status: json['status'],
    reason: json['reason'],
  );
}
