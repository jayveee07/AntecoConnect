import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../config/theme.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameCtl = TextEditingController();
  final _lastNameCtl = TextEditingController();
  final _emailCtl = TextEditingController();
  final _mobileCtl = TextEditingController();
  final _passwordCtl = TextEditingController();
  final _confirmPwdCtl = TextEditingController();
  final _addressCtl = TextEditingController();
  final _barangayCtl = TextEditingController();
  final _cityCtl = TextEditingController();
  final _provinceCtl = TextEditingController();
  final _zipCtl = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _firstNameCtl.dispose();
    _lastNameCtl.dispose();
    _emailCtl.dispose();
    _mobileCtl.dispose();
    _passwordCtl.dispose();
    _confirmPwdCtl.dispose();
    _addressCtl.dispose();
    _barangayCtl.dispose();
    _cityCtl.dispose();
    _provinceCtl.dispose();
    _zipCtl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.register({
      'first_name': _firstNameCtl.text.trim(),
      'last_name': _lastNameCtl.text.trim(),
      'email': _emailCtl.text.trim(),
      'mobile_number': _mobileCtl.text.trim(),
      'password': _passwordCtl.text,
      'password_confirmation': _confirmPwdCtl.text,
      'address_line1': _addressCtl.text.trim(),
      'barangay': _barangayCtl.text.trim(),
      'city': _cityCtl.text.trim(),
      'province': _provinceCtl.text.trim(),
      'zip_code': _zipCtl.text.trim(),
    });

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (success) {
      Navigator.of(context).pushReplacementNamed('/home');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.error ?? 'Registration failed'), backgroundColor: AntecoTheme.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('Personal Information', style: AntecoTheme.heading3),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: TextFormField(controller: _firstNameCtl, decoration: const InputDecoration(labelText: 'First Name'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null)),
                    const SizedBox(width: 12),
                    Expanded(child: TextFormField(controller: _lastNameCtl, decoration: const InputDecoration(labelText: 'Last Name'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null)),
                  ],
                ),
                const SizedBox(height: 16),
                TextFormField(controller: _emailCtl, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Email Address'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
                const SizedBox(height: 16),
                TextFormField(controller: _mobileCtl, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Mobile Number', prefixText: '+63 '), validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
                const SizedBox(height: 24),
                const Text('Address', style: AntecoTheme.heading3),
                const SizedBox(height: 16),
                TextFormField(controller: _addressCtl, decoration: const InputDecoration(labelText: 'House/Street Address'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null),
                const SizedBox(height: 16),
                Row(children: [
                  Expanded(child: TextFormField(controller: _barangayCtl, decoration: const InputDecoration(labelText: 'Barangay'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null)),
                  const SizedBox(width: 12),
                  Expanded(child: TextFormField(controller: _cityCtl, decoration: const InputDecoration(labelText: 'City/Municipality'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null)),
                ]),
                const SizedBox(height: 16),
                Row(children: [
                  Expanded(child: TextFormField(controller: _provinceCtl, decoration: const InputDecoration(labelText: 'Province'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null)),
                  const SizedBox(width: 12),
                  Expanded(child: TextFormField(controller: _zipCtl, decoration: const InputDecoration(labelText: 'ZIP Code'), validator: (v) => v?.isEmpty ?? true ? 'Required' : null)),
                ]),
                const SizedBox(height: 24),
                const Text('Security', style: AntecoTheme.heading3),
                const SizedBox(height: 16),
                TextFormField(controller: _passwordCtl, obscureText: true, decoration: const InputDecoration(labelText: 'Password'), validator: (v) => (v?.length ?? 0) < 8 ? 'Minimum 8 characters' : null),
                const SizedBox(height: 16),
                TextFormField(controller: _confirmPwdCtl, obscureText: true, decoration: const InputDecoration(labelText: 'Confirm Password'), validator: (v) => v != _passwordCtl.text ? 'Passwords do not match' : null),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _isLoading ? null : _register,
                  child: _isLoading
                      ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text('Create Account'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
