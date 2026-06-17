class ConsumptionData {
  final int id;
  final String periodType;
  final String periodDate;
  final int periodYear;
  final int? periodMonth;
  final double consumptionKwh;
  final double? peakConsumption;
  final double? averageDailyKwh;
  final double? estimatedCost;

  ConsumptionData({
    required this.id,
    required this.periodType,
    required this.periodDate,
    required this.periodYear,
    this.periodMonth,
    required this.consumptionKwh,
    this.peakConsumption,
    this.averageDailyKwh,
    this.estimatedCost,
  });

  factory ConsumptionData.fromJson(Map<String, dynamic> json) => ConsumptionData(
    id: json['id'],
    periodType: json['period_type'],
    periodDate: json['period_date'],
    periodYear: json['period_year'],
    periodMonth: json['period_month'],
    consumptionKwh: (json['consumption_kwh'] ?? 0).toDouble(),
    peakConsumption: (json['peak_consumption'] as num?)?.toDouble(),
    averageDailyKwh: (json['average_daily_kwh'] as num?)?.toDouble(),
    estimatedCost: (json['estimated_cost'] as num?)?.toDouble(),
  );
}

class AiForecast {
  final double predictedValue;
  final double confidenceScore;
  final List<String> recommendations;
  final Map<String, dynamic> nextMonthEstimate;

  AiForecast({
    required this.predictedValue,
    required this.confidenceScore,
    required this.recommendations,
    required this.nextMonthEstimate,
  });

  factory AiForecast.fromJson(Map<String, dynamic> json) => AiForecast(
    predictedValue: (json['prediction']?['predicted_value'] ?? 0).toDouble(),
    confidenceScore: (json['prediction']?['confidence_score'] ?? 0).toDouble(),
    recommendations: List<String>.from(json['recommendations'] ?? []),
    nextMonthEstimate: Map<String, dynamic>.from(json['next_month_estimated'] ?? {}),
  );
}

class EnergySavingTip {
  final int id;
  final String category;
  final String title;
  final String description;
  final double? estimatedSavings;
  final String difficulty;

  EnergySavingTip({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    this.estimatedSavings,
    required this.difficulty,
  });

  factory EnergySavingTip.fromJson(Map<String, dynamic> json) => EnergySavingTip(
    id: json['id'],
    category: json['category'],
    title: json['title'],
    description: json['description'],
    estimatedSavings: (json['estimated_savings_percent'] as num?)?.toDouble(),
    difficulty: json['difficulty'],
  );
}
