import 'package:flutter/material.dart';
import 'firebase_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseTechnicianService.initialize();
  runApp(const AntecoTechnicianApp());
}

class AntecoTechnicianApp extends StatelessWidget {
  const AntecoTechnicianApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ANTECO Technician',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFFF6B00),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: Colors.black,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Color(0xFF1A1A1A),
        ),
      ),
      home: const TechnicianHomeScreen(),
    );
  }
}

class TechnicianHomeScreen extends StatefulWidget {
  const TechnicianHomeScreen({super.key});

  @override
  State<TechnicianHomeScreen> createState() => _TechnicianHomeScreenState();
}

class _TechnicianHomeScreenState extends State<TechnicianHomeScreen> {
  int _currentIndex = 0;
  final _service = FirebaseTechnicianService();
  List<Map<String, dynamic>> _workOrders = [];
  List<Map<String, dynamic>> _meterReadings = [];
  bool _loading = true;

  final _labels = ['Dashboard', 'Work Orders', 'Meter Reading'];
  final _icons = [Icons.dashboard_outlined, Icons.assignment_outlined, Icons.speed_outlined];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final orders = await _service.getWorkOrders();
      final readings = await _service.getMeterReadings();
      setState(() {
        _workOrders = orders;
        _meterReadings = readings;
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        title: Text(_labels[_currentIndex]),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () => _showNotifications(context),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFF6B00),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ],
      ),
      drawer: _buildDrawer(),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _DashboardTab(service: _service, workOrders: _workOrders, loading: _loading),
          _WorkOrdersTab(orders: _workOrders, loading: _loading),
          _MeterReadingTab(readings: _meterReadings, loading: _loading),
        ],
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Column(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    padding: const EdgeInsets.all(4),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset(
                        'assets/images/anteco.png',
                        width: 56,
                        height: 56,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text('ANTECO', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const Text('TECHNICIAN', style: TextStyle(fontSize: 11, color: Color(0xFFFF6B00), fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const Divider(height: 1, color: Colors.grey),
            const SizedBox(height: 8),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: List.generate(_labels.length, (i) {
                  return ListTile(
                    leading: Icon(_icons[i], color: _currentIndex == i ? const Color(0xFFFF6B00) : null),
                    title: Text(_labels[i], style: TextStyle(
                      fontWeight: _currentIndex == i ? FontWeight.w600 : FontWeight.normal,
                      color: _currentIndex == i ? const Color(0xFFFF6B00) : null,
                    )),
                    selected: _currentIndex == i,
                    selectedTileColor: const Color(0xFFFF6B00).withValues(alpha: 0.08),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    onTap: () {
                      setState(() => _currentIndex = i);
                      Navigator.pop(context);
                    },
                  );
                }),
              ),
            ),
            const Divider(height: 1, color: Colors.grey),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Profile'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _showNotifications(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E1E),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade600,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Notifications', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _notificationItem(Icons.assignment, 'New work order assigned', 'Main St, Unit 3 - Electrical', '5 min ago'),
            _notificationItem(Icons.check_circle, 'Meter reading completed', 'Smith residence - Meter #M-4421', '1 hr ago'),
            _notificationItem(Icons.warning_amber, 'Schedule change', 'Johnson appointment moved to 3 PM', '2 hr ago'),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _notificationItem(IconData icon, String title, String subtitle, String time) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFFFF6B00).withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: const Color(0xFFFF6B00), size: 20),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 13)),
      trailing: Text(time, style: const TextStyle(color: Colors.grey, fontSize: 11)),
    );
  }
}

class _DashboardTab extends StatelessWidget {
  final FirebaseTechnicianService service;
  final List<Map<String, dynamic>> workOrders;
  final bool loading;

  const _DashboardTab({required this.service, required this.workOrders, required this.loading});

  @override
  Widget build(BuildContext context) {
    final assigned = workOrders.where((o) => o['status'] == 'assigned' || o['status'] == 'in_progress').length;
    final pending = workOrders.where((o) => o['status'] == 'pending').length;
    final doneToday = workOrders.where((o) => o['status'] == 'completed').length;

    return RefreshIndicator(
      onRefresh: () async {},
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: const Color(0xFFFF6B00),
                  child: const Text('JS', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Good Morning,', style: TextStyle(color: Colors.grey, fontSize: 14)),
                    const Text('Jose Santos', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(child: _StatCard(icon: Icons.assignment, label: 'Assigned', value: loading ? '...' : '$assigned', color: const Color(0xFFFF6B00))),
                const SizedBox(width: 12),
                Expanded(child: _StatCard(icon: Icons.pending, label: 'Pending', value: loading ? '...' : '$pending', color: Colors.orange)),
                const SizedBox(width: 12),
                Expanded(child: _StatCard(icon: Icons.check_circle, label: 'Done Today', value: loading ? '...' : '$doneToday', color: Colors.green)),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Today\'s Schedule', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Expanded(
              child: loading
                  ? const Center(child: CircularProgressIndicator())
                  : workOrders.isEmpty
                      ? const Center(child: Text('No work orders assigned', style: TextStyle(color: Colors.grey)))
                      : ListView(
                          children: workOrders.take(10).map((order) => _OrderCard(
                            type: order['type'] ?? 'Work Order',
                            address: order['address'] ?? '',
                            priority: order['priority'] ?? 'Normal',
                            status: order['status'] ?? 'Pending',
                          )).toList(),
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({required this.icon, required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade800),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ],
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final String type;
  final String address;
  final String priority;
  final String status;

  const _OrderCard({required this.type, required this.address, required this.priority, required this.status});

  Color _priorityColor() {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return Colors.red;
      case 'high':
        return Colors.red;
      case 'normal':
      case 'medium':
        return const Color(0xFFFF6B00);
      case 'low':
        return Colors.grey;
      default:
        return const Color(0xFFFF6B00);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade800),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFFF6B00).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.construction, color: Color(0xFFFF6B00)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(type, style: const TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(address, style: const TextStyle(color: Colors.grey, fontSize: 13)),
                Row(
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: _priorityColor().withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(priority, style: TextStyle(fontSize: 11, color: _priorityColor(), fontWeight: FontWeight.w600)),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(status, style: const TextStyle(fontSize: 11, color: Colors.green, fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.grey),
        ],
      ),
    );
  }
}

class _WorkOrdersTab extends StatelessWidget {
  final List<Map<String, dynamic>> orders;
  final bool loading;

  const _WorkOrdersTab({required this.orders, required this.loading});

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }
    return ListView(
      padding: const EdgeInsets.all(16),
      children: orders.map((order) => _OrderCard(
        type: order['type'] ?? 'Work Order',
        address: order['address'] ?? '',
        priority: order['priority'] ?? 'Normal',
        status: order['status'] ?? 'Pending',
      )).toList(),
    );
  }
}

class _MeterReadingTab extends StatelessWidget {
  final List<Map<String, dynamic>> readings;
  final bool loading;

  const _MeterReadingTab({required this.readings, required this.loading});

  @override
  Widget build(BuildContext context) {
    final scheduled = readings.where((r) => r['status'] == 'pending' || r['status'] == 'scheduled').length;
    final done = readings.where((r) => r['status'] == 'done' || r['status'] == 'submitted').length;
    final remaining = scheduled;

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1E1E),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade800),
                  ),
                  child: Column(
                    children: [
                      Text(loading ? '...' : '$scheduled', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFFFF6B00))),
                      const SizedBox(height: 4),
                      Text('Scheduled', style: TextStyle(color: Colors.grey.shade400)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1E1E),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade800),
                  ),
                  child: Column(
                    children: [
                      Text(loading ? '...' : '$done', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.green)),
                      const SizedBox(height: 4),
                      Text('Done', style: TextStyle(color: Colors.grey.shade400)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1E1E),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade800),
                  ),
                  child: Column(
                    children: [
                      Text(loading ? '...' : '$remaining', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.orange)),
                      const SizedBox(height: 4),
                      Text('Remaining', style: TextStyle(color: Colors.grey.shade400)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text('Assigned Meters', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : readings.isEmpty
                    ? const Center(child: Text('No meters assigned', style: TextStyle(color: Colors.grey)))
                    : ListView(
                        children: readings.map((r) => _MeterCard(
                          meter: r['meterNumber'] ?? r['meter'] ?? 'N/A',
                          name: r['consumerName'] ?? r['name'] ?? 'Unknown',
                          address: r['address'] ?? '',
                          status: r['status'] == 'done' || r['status'] == 'submitted' ? 'done' : 'pending',
                        )).toList(),
                      ),
          ),
        ],
      ),
    );
  }
}

class _MeterCard extends StatelessWidget {
  final String meter;
  final String name;
  final String address;
  final String status;

  const _MeterCard({required this.meter, required this.name, required this.address, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade800),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: status == 'done' ? Colors.green.withValues(alpha: 0.2) : const Color(0xFFFF6B00).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              status == 'done' ? Icons.check_circle : Icons.speed,
              color: status == 'done' ? Colors.green : const Color(0xFFFF6B00),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
                Text(meter, style: const TextStyle(color: Colors.grey, fontSize: 13, fontFamily: 'monospace')),
                Text(address, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: status == 'done' ? Colors.green.withValues(alpha: 0.2) : const Color(0xFFFF6B00).withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              status == 'done' ? 'Done' : 'Pending',
              style: TextStyle(fontSize: 11, color: status == 'done' ? Colors.green : const Color(0xFFFF6B00), fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
