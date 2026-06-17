import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/support_service.dart';

class TicketDetailScreen extends StatefulWidget {
  const TicketDetailScreen({super.key});

  @override
  State<TicketDetailScreen> createState() => _TicketDetailScreenState();
}

class _TicketDetailScreenState extends State<TicketDetailScreen> {
  final _service = SupportService();
  final _messageCtl = TextEditingController();
  Map<String, dynamic>? _ticket;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // In a real app, get ticket ID from arguments
    setState(() => _isLoading = false);
  }

  Future<void> _sendMessage() async {
    if (_messageCtl.text.trim().isEmpty) return;
    try {
      await _service.sendMessage(1, _messageCtl.text.trim());
      _messageCtl.clear();
      _load();
    } catch (_) {}
  }

  @override
  void dispose() {
    _messageCtl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ticket #TKT-...')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Technical Issue', style: AntecoTheme.subtitle1),
                              const SizedBox(height: 8),
                              Text('Having trouble with my meter reading...', style: AntecoTheme.body2),
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AntecoTheme.warningOrange.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Text('Open', style: TextStyle(color: AntecoTheme.warningOrange, fontSize: 12, fontWeight: FontWeight.w600)),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildMessageBubble('Good day! How can we help you?', true),
                      _buildMessageBubble('I noticed my bill is higher than usual this month.', false),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 8)],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _messageCtl,
                          decoration: const InputDecoration(
                            hintText: 'Type a message...',
                            border: OutlineInputBorder(),
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      IconButton.filled(
                        onPressed: _sendMessage,
                        icon: const Icon(Icons.send),
                        color: AntecoTheme.primaryBlue,
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildMessageBubble(String message, bool isStaff) {
    return Align(
      alignment: isStaff ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isStaff ? AntecoTheme.primaryBlue.withValues(alpha: 0.1) : AntecoTheme.primaryBlue,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomRight: isStaff ? const Radius.circular(16) : Radius.zero,
            bottomLeft: isStaff ? Radius.zero : const Radius.circular(16),
          ),
        ),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        child: Text(
          message,
          style: TextStyle(color: isStaff ? null : Colors.white),
        ),
      ),
    );
  }
}
