import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theme_provider.dart';
import '../../config/theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<ThemeProvider>();
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Appearance', style: AntecoTheme.subtitle1),
          const SizedBox(height: 8),
          Card(
            child: SwitchListTile(
              secondary: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: Icon(theme.isDarkMode ? Icons.dark_mode : Icons.light_mode, color: AntecoTheme.primaryBlue),
              ),
              title: const Text('Dark Mode'),
              subtitle: Text(theme.isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'),
              value: theme.isDarkMode,
              onChanged: (_) => theme.toggleTheme(),
            ),
          ),
          const SizedBox(height: 24),
          const Text('Security', style: AntecoTheme.subtitle1),
          const SizedBox(height: 8),
          Card(
            child: SwitchListTile(
              secondary: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.fingerprint, color: AntecoTheme.primaryBlue),
              ),
              title: const Text('Biometric Login'),
              subtitle: const Text('Use fingerprint or face to login'),
              value: theme.useBiometric,
              onChanged: (v) => theme.setBiometric(v),
            ),
          ),
          Card(
            child: ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.lock_outline, color: AntecoTheme.primaryBlue),
              ),
              title: const Text('Change Password'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
          ),
          const SizedBox(height: 24),
          const Text('Notifications', style: AntecoTheme.subtitle1),
          const SizedBox(height: 8),
          Card(
            child: SwitchListTile(
              secondary: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.notifications, color: AntecoTheme.primaryBlue),
              ),
              title: const Text('Push Notifications'),
              subtitle: const Text('Receive bill reminders and alerts'),
              value: true,
              onChanged: (_) {},
            ),
          ),
          Card(
            child: SwitchListTile(
              secondary: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.sms, color: AntecoTheme.primaryBlue),
              ),
              title: const Text('SMS Alerts'),
              subtitle: const Text('Receive outage and payment alerts'),
              value: true,
              onChanged: (_) {},
            ),
          ),
          const SizedBox(height: 24),
          const Text('Account', style: AntecoTheme.subtitle1),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: AntecoTheme.errorRed.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.logout, color: AntecoTheme.errorRed),
              ),
              title: const Text('Logout'),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Are you sure you want to logout?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.pop(ctx);
                          auth.logout();
                          Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: AntecoTheme.errorRed),
                        child: const Text('Logout', style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 32),
          Center(
            child: Text(
              'ANTECO CONNECT v1.0.0',
              style: AntecoTheme.caption,
            ),
          ),
        ],
      ),
    );
  }
}
