import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/service_request_service.dart';

class CreateServiceRequestScreen extends StatefulWidget {
  const CreateServiceRequestScreen({super.key});

  @override
  State<CreateServiceRequestScreen> createState() => _CreateServiceRequestScreenState();
}

class _CreateServiceRequestScreenState extends State<CreateServiceRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _service = ServiceRequestService();
  final _notesCtl = TextEditingController();

  String _selectedType = 'new_connection';
  String? _selectedDate;
  String? _selectedTime;
  bool _isLoading = false;

  final List<Map<String, String>> _types = [
    {'value': 'new_connection', 'label': 'New Connection'},
    {'value': 'reconnection', 'label': 'Reconnection'},
    {'value': 'change_ownership', 'label': 'Change Ownership'},
    {'value': 'meter_transfer', 'label': 'Meter Transfer'},
    {'value': 'service_upgrade', 'label': 'Service Upgrade'},
    {'value': 'temporary_connection', 'label': 'Temporary Connection'},
    {'value': 'meter_calibration', 'label': 'Meter Calibration'},
    {'value': 'others', 'label': 'Others'},
  ];

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      await _service.createRequest({
        'type': _selectedType,
        'preferred_date': _selectedDate,
        'preferred_time': _selectedTime,
        'notes': _notesCtl.text.trim(),
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Service request submitted!'), backgroundColor: AntecoTheme.successGreen),
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
  void dispose() {
    _notesCtl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New Service Request')),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Service Type', style: AntecoTheme.subtitle1),
              const SizedBox(height: 12),
              ..._types.map((t) => RadioListTile<String>(
                value: t['value']!,
                groupValue: _selectedType,
                title: Text(t['label']!),
                onChanged: (v) => setState(() => _selectedType = v!),
                contentPadding: EdgeInsets.zero,
              )),
              const SizedBox(height: 24),
              const Text('Preferred Schedule', style: AntecoTheme.subtitle1),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Preferred Date',
                        prefixIcon: Icon(Icons.calendar_today),
                      ),
                      readOnly: true,
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now().add(const Duration(days: 1)),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 90)),
                        );
                        if (date != null) setState(() => _selectedDate = date.toIso8601String().split('T')[0]);
                      },
                      controller: TextEditingController(text: _selectedDate ?? ''),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextFormField(
                      decoration: const InputDecoration(
                        labelText: 'Preferred Time',
                        prefixIcon: Icon(Icons.access_time),
                      ),
                      readOnly: true,
                      onTap: () async {
                        final time = await showTimePicker(context: context, initialTime: TimeOfDay.now());
                        if (time != null) setState(() => _selectedTime = '${time.hour}:${time.minute}');
                      },
                      controller: TextEditingController(text: _selectedTime ?? ''),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesCtl,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Additional Notes (optional)',
                  alignLabelWithHint: true,
                ),
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
                  label: Text(_isLoading ? 'Submitting...' : 'Submit Request'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
