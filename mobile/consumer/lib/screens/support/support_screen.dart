import 'package:flutter/material.dart';
import '../../config/theme.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Customer Support')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildContactCard(context, Icons.phone, 'Hotline', AppConfig.supportHotline, 'Available 24/7'),
            const SizedBox(height: 12),
            _buildContactCard(context, Icons.email, 'Email', AppConfig.supportEmail, 'Response within 24 hours'),
            const SizedBox(height: 12),
            _buildContactCard(context, Icons.chat, 'Live Chat', 'Chat with our support team', 'Available 6AM - 10PM'),
            const SizedBox(height: 24),
            Card(
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.help_outline, color: AntecoTheme.primaryBlue),
                ),
                title: const Text('FAQs'),
                subtitle: const Text('Frequently asked questions'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.pushNamed(context, '/faqs'),
              ),
            ),
            Card(
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AntecoTheme.warningOrange.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.confirmation_number, color: AntecoTheme.warningOrange),
                ),
                title: const Text('My Tickets'),
                subtitle: const Text('View your support tickets'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.pushNamed(context, '/support'),
              ),
            ),
            const SizedBox(height: 24),
            const Text('Send us a message', style: AntecoTheme.subtitle1),
            const SizedBox(height: 12),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Subject',
                prefixIcon: Icon(Icons.subject),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              maxLines: 5,
              decoration: const InputDecoration(
                labelText: 'Message',
                alignLabelWithHint: true,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {},
                child: const Text('Submit Ticket'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContactCard(BuildContext context, IconData icon, String title, String value, String subtitle) {
    return Card(
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: AntecoTheme.primaryBlue),
        ),
        title: Text(title),
        subtitle: Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        trailing: Text(subtitle, style: AntecoTheme.caption),
      ),
    );
  }
}

class AppConfig {
  static const String supportHotline = '1800-123-4567';
  static const String supportEmail = 'support@anteconect.com';
}
