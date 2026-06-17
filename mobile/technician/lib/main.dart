import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ANTECO Technician'),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.person_outline), onPressed: () {}),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          _DashboardTab(),
          _WorkOrdersTab(),
          _MeterReadingTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color(0xFF1A1A1A),
        selectedItemColor: const Color(0xFFFF6B00),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'Work Orders'),
          BottomNavigationBarItem(icon: Icon(Icons.speed), label: 'Meter Reading'),
        ],
      ),
    );
  }
}

class _DashboardTab extends StatelessWidget {
  const _DashboardTab();

  @override
  Widget build(BuildContext context) {
    return Padding(
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
              Expanded(child: _StatCard(icon: Icons.assignment, label: 'Assigned', value: '5', color: const Color(0xFFFF6B00))),
              const SizedBox(width: 12),
              Expanded(child: _StatCard(icon: Icons.pending, label: 'Pending', value: '2', color: Colors.orange)),
              const SizedBox(width: 12),
              Expanded(child: _StatCard(icon: Icons.check_circle, label: 'Done Today', value: '3', color: Colors.green)),
            ],
          ),
          const SizedBox(height: 24),
          const Text('Today\'s Schedule', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Expanded(
            child: ListView(
              children: [
                _OrderCard(type: 'Meter Replacement', address: '123 Rizal St., San Roque', priority: 'High', status: 'In Progress'),
                _OrderCard(type: 'Reconnection', address: '456 Mabini St., Barangay 1', priority: 'Normal', status: 'Assigned'),
                _OrderCard(type: 'Service Inspection', address: '789 Luna St.', priority: 'Low', status: 'Pending'),
              ],
            ),
          ),
        ],
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
                        color: priority == 'High' ? Colors.red.withValues(alpha: 0.2) : const Color(0xFFFF6B00).withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(priority, style: TextStyle(fontSize: 11, color: priority == 'High' ? Colors.red : const Color(0xFFFF6B00), fontWeight: FontWeight.w600)),
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
  const _WorkOrdersTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        _OrderCard(type: 'Meter Replacement', address: '123 Rizal St., San Roque', priority: 'High', status: 'In Progress'),
        _OrderCard(type: 'Reconnection', address: '456 Mabini St., Barangay 1', priority: 'Normal', status: 'Assigned'),
        _OrderCard(type: 'Service Inspection', address: '789 Luna St.', priority: 'Low', status: 'Pending'),
        _OrderCard(type: 'Emergency Repair', address: '321 Rizal St., Poblacion', priority: 'Urgent', status: 'Assigned'),
        _OrderCard(type: 'Meter Replacement', address: '654 Mabini St.', priority: 'Normal', status: 'Pending'),
      ],
    );
  }
}

class _MeterReadingTab extends StatelessWidget {
  const _MeterReadingTab();

  @override
  Widget build(BuildContext context) {
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
                      const Text('15', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFFFF6B00))),
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
                      const Text('8', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.green)),
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
                      const Text('7', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.orange)),
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
            child: ListView(
              children: [
                _MeterCard(meter: 'MTR-12345', name: 'Juan Dela Cruz', address: '123 Rizal St.', status: 'pending'),
                _MeterCard(meter: 'MTR-12346', name: 'Maria Santos', address: '456 Mabini St.', status: 'done'),
                _MeterCard(meter: 'MTR-12347', name: 'Pedro Reyes', address: '789 Luna St.', status: 'pending'),
              ],
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
