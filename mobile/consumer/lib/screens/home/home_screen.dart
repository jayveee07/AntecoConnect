import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../providers/theme_provider.dart';
import '../../config/theme.dart';
import '../../widgets/bill_card.dart';
import '../../widgets/action_button.dart';
import '../../widgets/stat_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardProvider>().loadDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final dashboard = context.watch<DashboardProvider>();
    final theme = context.watch<ThemeProvider>();

    return Scaffold(
      drawer: _buildDrawer(theme),
      body: _buildBody(auth, dashboard, theme),
    );
  }

  Widget _buildDrawer(ThemeProvider theme) {
    final activePath = ModalRoute.of(context)?.settings.name ?? '/home';
    final drawerItems = [
      ('/home', Icons.dashboard_outlined, 'Dashboard'),
      ('/payments', Icons.receipt_outlined, 'Bills & Payments'),
      ('/consumption', Icons.bolt_outlined, 'Usage'),
      ('/outages', Icons.warning_amber_outlined, 'Outages'),
      ('/service-requests', Icons.build_outlined, 'Services'),
      ('/support', Icons.headset_mic_outlined, 'Support'),
    ];

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
                  const Text('CONNECT', style: TextStyle(fontSize: 11, color: AntecoTheme.primaryOrange, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const Divider(height: 1),
            const SizedBox(height: 8),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: drawerItems.map((item) {
                  final active = activePath == item.$1;
                  return ListTile(
                    leading: Icon(item.$2, color: active ? AntecoTheme.primaryOrange : null),
                    title: Text(item.$3, style: TextStyle(
                      fontWeight: active ? FontWeight.w600 : FontWeight.normal,
                      color: active ? AntecoTheme.primaryOrange : null,
                    )),
                    selected: active,
                    selectedTileColor: AntecoTheme.primaryOrange.withValues(alpha: 0.08),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, item.$1);
                    },
                  );
                }).toList(),
              ),
            ),
            const Divider(height: 1),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Profile'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/profile');
              },
            ),
            ListTile(
              leading: const Icon(Icons.settings_outlined),
              title: const Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/settings');
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildBody(AuthProvider auth, DashboardProvider dashboard, ThemeProvider theme) {
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () => dashboard.loadDashboard(),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(auth, theme),
              const SizedBox(height: 20),
              if (dashboard.currentBill != null) _buildCurrentBillCard(dashboard),
              if (dashboard.dashboardData?['quick_actions'] != null) _buildQuickActions(dashboard),
              const SizedBox(height: 20),
              if (dashboard.monthlyConsumption.isNotEmpty) _buildConsumptionSection(dashboard),
              const SizedBox(height: 20),
              if (dashboard.interruptions.isNotEmpty) _buildInterruptionAlerts(dashboard),
              const SizedBox(height: 20),
              if (dashboard.billHistory.isNotEmpty) _buildRecentBills(dashboard),
              const SizedBox(height: 20),
              _buildUserInfoCard(auth),
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(AuthProvider auth, ThemeProvider theme) {
    return Row(
      children: [
        Builder(
          builder: (ctx) => IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => Scaffold.of(ctx).openDrawer(),
          ),
        ),
        CircleAvatar(
          radius: 24,
          backgroundColor: AntecoTheme.primaryBlue,
          child: Text(
            (auth.user?.firstName ?? 'U')[0].toUpperCase(),
            style: const TextStyle(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Good ${_greeting()},', style: AntecoTheme.body2.copyWith(color: AntecoTheme.lightGray)),
              Text(auth.user?.fullName ?? 'User', style: AntecoTheme.heading3),
            ],
          ),
        ),
        Stack(
          children: [
            IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () => Navigator.pushNamed(context, '/notifications'),
            ),
            Positioned(
              right: 8,
              top: 8,
              child: Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AntecoTheme.primaryOrange,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ],
        ),
        IconButton(
          icon: Icon(theme.isDarkMode ? Icons.light_mode : Icons.dark_mode),
          onPressed: () => theme.toggleTheme(),
        ),
      ],
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  }

  Widget _buildCurrentBillCard(DashboardProvider dashboard) {
    final bill = dashboard.currentBill!;
    final isOverdue = bill.isOverdue;
    final daysUntilDue = bill.daysUntilDue;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isOverdue
              ? [AntecoTheme.errorRed, AntecoTheme.errorRed.withValues(alpha: 0.8)]
              : [AntecoTheme.primaryBlue, AntecoTheme.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(color: (isOverdue ? AntecoTheme.errorRed : AntecoTheme.primaryBlue).withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 8)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(bill.billingPeriod, style: const TextStyle(color: Colors.white70, fontSize: 14)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: isOverdue ? Colors.white.withValues(alpha: 0.2) : Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  isOverdue ? 'OVERDUE' : 'DUE SOON',
                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text('Current Bill', style: TextStyle(color: Colors.white70, fontSize: 14)),
          Text(
            '₱${bill.totalAmountDue.toStringAsFixed(2)}',
            style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.schedule, color: Colors.white70, size: 16),
              const SizedBox(width: 6),
              Text(
                'Due: ${bill.dueDate}${isOverdue ? ' (${daysUntilDue.abs()} days ago)' : ' ($daysUntilDue days remaining)'}',
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/payments', arguments: bill),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AntecoTheme.electricYellow,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Pay Now', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 44,
                  child: OutlinedButton(
                    onPressed: () => Navigator.pushNamed(context, '/bill-detail', arguments: bill),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white38),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('View Details', style: TextStyle(fontWeight: FontWeight.w500)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(DashboardProvider dashboard) {
    final actions = dashboard.dashboardData!['quick_actions'] as List;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Quick Actions', style: AntecoTheme.subtitle1),
          const SizedBox(height: 12),
          Row(
            children: actions.map((action) {
              return Expanded(
                child: ActionButton(
                  icon: Icons.payments_outlined,
                  label: action['label'],
                  onTap: () => Navigator.pushNamed(context, action['route']),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: ActionButton(icon: Icons.download, label: 'Download Bill', onTap: () {})),
              Expanded(child: ActionButton(icon: Icons.history, label: 'Payment History', onTap: () {})),
              Expanded(child: ActionButton(icon: Icons.receipt_long, label: 'Billing History', onTap: () => Navigator.pushNamed(context, '/bill-detail'))),
              Expanded(child: ActionButton(icon: Icons.contact_support, label: 'Help Center', onTap: () => Navigator.pushNamed(context, '/support'))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildConsumptionSection(DashboardProvider dashboard) {
    final data = dashboard.monthlyConsumption;
    if (data.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Energy Consumption', style: AntecoTheme.subtitle1),
                TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/consumption'),
                  child: const Text('See All'),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: _buildBarChart(data),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBarChart(List data) {
    final maxKwh = data.fold<double>(0, (max, d) => d.consumptionKwh > max ? d.consumptionKwh : max);
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: data.reversed.take(6).toList().reversed.toList().asMap().entries.map((entry) {
        final item = entry.value;
        final height = maxKwh > 0 ? (item.consumptionKwh / maxKwh) * 160 : 0.0;
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text('${item.consumptionKwh.toStringAsFixed(0)}', style: const TextStyle(fontSize: 10, color: AntecoTheme.lightGray)),
                const SizedBox(height: 4),
                Container(
                  height: height.clamp(4.0, 160.0),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [AntecoTheme.primaryBlue, AntecoTheme.primaryLight],
                    ),
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
                const SizedBox(height: 4),
                Text('${item.periodMonth ?? ""}', style: const TextStyle(fontSize: 10, color: AntecoTheme.lightGray)),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildInterruptionAlerts(DashboardProvider dashboard) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Power Interruption Alerts', style: AntecoTheme.subtitle1),
        const SizedBox(height: 12),
        ...dashboard.interruptions.take(2).map((notice) => Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: notice.type == 'emergency' ? AntecoTheme.errorRed.withValues(alpha: 0.1) : AntecoTheme.warningOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                notice.type == 'emergency' ? Icons.warning : Icons.schedule,
                color: notice.type == 'emergency' ? AntecoTheme.errorRed : AntecoTheme.warningOrange,
              ),
            ),
            title: Text(notice.title, style: AntecoTheme.body2.copyWith(fontWeight: FontWeight.w600)),
            subtitle: Text('${notice.startTime} - ${notice.endTime}', style: AntecoTheme.caption),
          ),
        )),
      ],
    );
  }

  Widget _buildRecentBills(DashboardProvider dashboard) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Recent Bills', style: AntecoTheme.subtitle1),
        const SizedBox(height: 12),
        ...dashboard.billHistory.take(3).map((bill) => BillCard(bill: bill)),
      ],
    );
  }

  Widget _buildUserInfoCard(AuthProvider auth) {
    if (auth.user == null) return const SizedBox.shrink();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: AntecoTheme.primaryBlue,
              child: Text(auth.user!.firstName[0].toUpperCase(), style: const TextStyle(fontSize: 24, color: Colors.white)),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(auth.user!.fullName, style: AntecoTheme.subtitle1),
                  Text('Consumer Code: ${auth.user!.consumerCode}', style: AntecoTheme.caption),
                  Text(auth.user!.email, style: AntecoTheme.caption),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.settings_outlined),
              onPressed: () => Navigator.pushNamed(context, '/settings'),
            ),
          ],
        ),
      ),
    );
  }
}
