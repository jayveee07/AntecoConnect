import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../config/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      appBar: AppBar(title: const Text('My Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 20),
            CircleAvatar(
              radius: 50,
              backgroundColor: AntecoTheme.primaryBlue,
              child: Text(
                user?.firstName[0].toUpperCase() ?? 'U',
                style: const TextStyle(fontSize: 40, color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 16),
            Text(user?.fullName ?? 'User', style: AntecoTheme.heading3),
            Text(user?.email ?? '', style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: (user?.isVerified ?? false) ? AntecoTheme.successGreen.withValues(alpha: 0.1) : AntecoTheme.warningOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                user?.isVerified ?? false ? 'Verified' : 'Unverified',
                style: TextStyle(
                  color: (user?.isVerified ?? false) ? AntecoTheme.successGreen : AntecoTheme.warningOrange,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Card(
              child: Column(
                children: [
                  _profileTile(Icons.person, 'First Name', user?.firstName ?? ''),
                  const Divider(height: 1),
                  _profileTile(Icons.person, 'Last Name', user?.lastName ?? ''),
                  const Divider(height: 1),
                  _profileTile(Icons.email, 'Email', user?.email ?? ''),
                  const Divider(height: 1),
                  _profileTile(Icons.phone, 'Mobile', user?.mobileNumber ?? ''),
                  const Divider(height: 1),
                  _profileTile(Icons.qr_code, 'Consumer Code', user?.consumerCode ?? ''),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: AntecoTheme.primaryBlue.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.settings, color: AntecoTheme.primaryBlue),
                ),
                title: const Text('Account Settings'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.pushNamed(context, '/settings'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _profileTile(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon, color: AntecoTheme.primaryBlue, size: 20),
      title: Text(label, style: AntecoTheme.caption),
      subtitle: Text(value, style: AntecoTheme.body2),
    );
  }
}
