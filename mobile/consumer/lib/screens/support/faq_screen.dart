import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/support_service.dart';

class FaqScreen extends StatefulWidget {
  const FaqScreen({super.key});

  @override
  State<FaqScreen> createState() => _FaqScreenState();
}

class _FaqScreenState extends State<FaqScreen> {
  final _service = SupportService();
  Map<String, dynamic>? _faqs;
  bool _isLoading = true;
  String? _expandedCategory;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await _service.getFaqs();
      setState(() {
        _faqs = data;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('FAQs')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _faqs == null || _faqs!.isEmpty
              ? const Center(child: Text('No FAQs available'))
              : ListView(
                  padding: const EdgeInsets.all(16),
                  children: _faqs!.entries.map((entry) {
                    final category = entry.key;
                    final items = entry.value as List;
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ExpansionTile(
                        title: Text(category, style: AntecoTheme.subtitle1),
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AntecoTheme.primaryBlue.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.question_mark, color: AntecoTheme.primaryBlue),
                        ),
                        children: items.map((faq) => Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(faq['question'] ?? '', style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
                              const SizedBox(height: 8),
                              Text(faq['answer'] ?? '', style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray)),
                              const Divider(height: 24),
                            ],
                          ),
                        )).toList(),
                      ),
                    );
                  }).toList(),
                ),
    );
  }
}
