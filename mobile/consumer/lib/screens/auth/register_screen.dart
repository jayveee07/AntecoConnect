import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
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
  final _otpCtl = TextEditingController();
  int _step = 1;
  bool _isLoading = false;
  bool _sendingOtp = false;
  bool _verifyingOtp = false;
  String _simulatedOtp = '';
  String? _error;
  UserCredential? _createdUser;

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
    _otpCtl.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _error = null;
      _isLoading = true;
    });

    try {
      final cred = await FirebaseAuth.instance.createUserWithEmailAndPassword(
        _emailCtl.text.trim(),
        _passwordCtl.text,
      );
      _createdUser = cred;

      if (!mounted) return;
      setState(() => _step = 3);
      _sendOtp();
    } on FirebaseAuthException catch (e) {
      final msg = e.code == 'email-already-in-use'
          ? 'An account with this email already exists'
          : e.code == 'weak-password'
              ? 'Password must be at least 6 characters'
              : e.message ?? 'Registration failed';
      setState(() => _error = msg);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _sendOtp() async {
    setState(() {
      _error = null;
      _sendingOtp = true;
    });

    try {
      final code = (100000 + DateTime.now().millisecondsSinceEpoch % 900000).toString();
      _simulatedOtp = code;
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Your OTP code: $code (sent to ${_emailCtl.text.trim()})'), backgroundColor: AntecoTheme.primaryOrange),
      );
    } catch (_) {
      setState(() => _error = 'Failed to send OTP');
    } finally {
      if (mounted) setState(() => _sendingOtp = false);
    }
  }

  Future<void> _verifyOtp() async {
    if (_otpCtl.text.trim().length != 6) {
      setState(() => _error = 'Enter a valid 6-digit OTP code');
      return;
    }

    setState(() {
      _error = null;
      _verifyingOtp = true;
    });

    try {
      if (_otpCtl.text.trim() == _simulatedOtp) {
        final user = _createdUser!.user;
        await FirebaseFirestore.instance.collection('users').doc(user.uid).set({
          'uid': user.uid,
          'role': 'consumer',
          'first_name': _firstNameCtl.text.trim(),
          'last_name': _lastNameCtl.text.trim(),
          'email': _emailCtl.text.trim(),
          'mobile_number': _mobileCtl.text.trim(),
          'phoneNumber': _mobileCtl.text.trim(),
          'address_line1': _addressCtl.text.trim(),
          'barangay': _barangayCtl.text.trim(),
          'city': _cityCtl.text.trim(),
          'province': _provinceCtl.text.trim(),
          'zip_code': _zipCtl.text.trim(),
          'isEmailVerified': true,
          'accountStatus': 'active',
          'is_verified': false,
          'createdAt': FieldValue.serverTimestamp(),
          'updatedAt': FieldValue.serverTimestamp(),
        });

        if (!mounted) return;
        Navigator.of(context).pushReplacementNamed('/home');
      } else {
        setState(() => _error = 'Invalid verification code');
        try {
          await _createdUser?.user.delete();
        } catch (_) {}
      }
    } catch (e) {
      setState(() => _error = e.toString());
      try {
        await _createdUser?.user.delete();
      } catch (_) {}
    } finally {
      if (mounted) setState(() => _verifyingOtp = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_step == 3 ? 'Verify Email' : 'Create Account')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (_error != null)
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(
                      color: AntecoTheme.errorRed.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AntecoTheme.errorRed.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: AntecoTheme.errorRed, size: 20),
                        const SizedBox(width: 8),
                        Expanded(child: Text(_error!, style: TextStyle(color: AntecoTheme.errorRed, fontSize: 13))),
                      ],
                    ),
                  ),
                if (_step == 1) ...[
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
                    onPressed: _isLoading ? null : () {
                      if (!_formKey.currentState!.validate()) return;
                      setState(() { _step = 2; _error = null; });
                    },
                    child: _isLoading
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('Next Step'),
                  ),
                ],
                if (_step == 2) ...[
                  const Text('Review & Confirm', style: AntecoTheme.heading3),
                  const SizedBox(height: 16),
                  _reviewField('Name', '${_firstNameCtl.text.trim()} ${_lastNameCtl.text.trim()}'),
                  _reviewField('Email', _emailCtl.text.trim()),
                  _reviewField('Mobile', '+63 ${_mobileCtl.text.trim()}'),
                  _reviewField('Address', '${_addressCtl.text.trim()}, ${_barangayCtl.text.trim()}, ${_cityCtl.text.trim()}'),
                  const SizedBox(height: 32),
                  Row(children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => setState(() { _step = 1; _error = null; }),
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade300),
                        child: const Text('Back'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleRegister,
                        child: _isLoading
                            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Text('Create Account'),
                      ),
                    ),
                  ]),
                ],
                if (_step == 3) ...[
                  const SizedBox(height: 16),
                  const Icon(Icons.email_outlined, size: 64, color: AntecoTheme.primaryOrange),
                  const SizedBox(height: 16),
                  Text(
                    'Verify your email address',
                    textAlign: TextAlign.center,
                    style: AntecoTheme.heading3,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'An OTP has been sent to ${_emailCtl.text.trim()}',
                    textAlign: TextAlign.center,
                    style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray),
                  ),
                  const SizedBox(height: 24),
                  TextFormField(
                    controller: _otpCtl,
                    keyboardType: TextInputType.number,
                    maxLength: 6,
                    decoration: const InputDecoration(
                      labelText: 'OTP Code',
                      hintText: '000000',
                      counterText: '',
                    ),
                    validator: (v) => (v?.length ?? 0) != 6 ? 'Enter 6-digit code' : null,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _verifyingOtp ? null : _verifyOtp,
                    child: _verifyingOtp
                        ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('Verify Email'),
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    onPressed: _sendingOtp ? null : _sendOtp,
                    child: Text(_sendingOtp ? 'Resending...' : 'Resend OTP'),
                  ),
                ],
                if (_step > 1 && _step < 4)
                  Padding(
                    padding: const EdgeInsets.only(top: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [1, 2, 3].map((s) {
                        final active = s <= _step;
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: active ? 32 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: active ? AntecoTheme.primaryOrange : Colors.grey.shade300,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _reviewField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(label, style: TextStyle(color: AntecoTheme.lightGray, fontSize: 13)),
          ),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }
}
