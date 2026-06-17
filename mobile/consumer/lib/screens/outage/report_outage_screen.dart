import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/outage_service.dart';

class ReportOutageScreen extends StatefulWidget {
  const ReportOutageScreen({super.key});

  @override
  State<ReportOutageScreen> createState() => _ReportOutageScreenState();
}

class _ReportOutageScreenState extends State<ReportOutageScreen> {
  final _formKey = GlobalKey<FormState>();
  final _service = OutageService();
  final _descCtl = TextEditingController();
  final _addressCtl = TextEditingController();
  final _landmarkCtl = TextEditingController();

  String _selectedType = 'power_outage';
  String _selectedBarangay = '';
  String _selectedCity = '';
  String _selectedProvince = '';
  bool _isLoading = false;

  final List<String> _types = [
    'power_outage', 'low_voltage', 'high_voltage',
    'broken_meter', 'fallen_pole', 'transformer_issue', 'others',
  ];

  @override
  void dispose() {
    _descCtl.dispose();
    _addressCtl.dispose();
    _landmarkCtl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      await _service.reportOutage({
        'type': _selectedType,
        'barangay': _selectedBarangay,
        'city': _selectedCity,
        'province': _selectedProvince,
        'street_address': _addressCtl.text.trim(),
        'landmark': _landmarkCtl.text.trim() == '' ? null : _landmarkCtl.text.trim(),
        'latitude': '14.5995',
        'longitude': '120.9842',
        'description': _descCtl.text.trim(),
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Outage reported successfully!'), backgroundColor: AntecoTheme.successGreen),
      );
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed: $e'), backgroundColor: AntecoTheme.errorRed),
      );
    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Report Outage')),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('What type of issue?', style: AntecoTheme.subtitle1),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _types.map((type) {
                  final labels = {
                    'power_outage': 'Power Outage', 'low_voltage': 'Low Voltage',
                    'high_voltage': 'High Voltage', 'broken_meter': 'Broken Meter',
                    'fallen_pole': 'Fallen Pole', 'transformer_issue': 'Transformer Issue',
                    'others': 'Others',
                  };
                  return ChoiceChip(
                    label: Text(labels[type] ?? type),
                    selected: _selectedType == type,
                    onSelected: (v) => setState(() => _selectedType = type),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _addressCtl,
                decoration: const InputDecoration(
                  labelText: 'Street Address',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
                validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              Row(children: [
                Expanded(child: TextFormField(
                  decoration: const InputDecoration(labelText: 'Barangay'),
                  validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                  onChanged: (v) => _selectedBarangay = v,
                )),
                const SizedBox(width: 12),
                Expanded(child: TextFormField(
                  decoration: const InputDecoration(labelText: 'City'),
                  validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                  onChanged: (v) => _selectedCity = v,
                )),
              ]),
              const SizedBox(height: 16),
              TextFormField(
                controller: _landmarkCtl,
                decoration: const InputDecoration(labelText: 'Landmark (optional)', prefixIcon: Icon(Icons.flag_outlined)),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descCtl,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'Please describe the issue in detail...',
                  alignLabelWithHint: true,
                ),
                validator: (v) => (v?.length ?? 0) < 10 ? 'Please provide more details' : null,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _isLoading ? null : _submit,
                  icon: _isLoading
                      ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.send),
                  label: Text(_isLoading ? 'Submitting...' : 'Submit Report'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
