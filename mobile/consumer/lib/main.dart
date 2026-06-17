import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/firebase_service.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/dashboard_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/auth/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/billing/bill_detail_screen.dart';
import 'screens/payments/payment_screen.dart';
import 'screens/outage/report_outage_screen.dart';
import 'screens/outage/outage_tracking_screen.dart';
import 'screens/outage/outage_list_screen.dart';
import 'screens/services/service_requests_screen.dart';
import 'screens/services/create_service_request_screen.dart';
import 'screens/support/support_screen.dart';
import 'screens/support/ticket_detail_screen.dart';
import 'screens/support/faq_screen.dart';
import 'screens/consumption/consumption_screen.dart';
import 'screens/consumption/forecast_screen.dart';
import 'screens/consumption/saving_tips_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/notifications/notifications_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseService.initialize();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DashboardProvider()),
      ],
      child: const AntecoConnectApp(),
    ),
  );
}

class AntecoConnectApp extends StatelessWidget {
  const AntecoConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'ANTECO CONNECT',
      debugShowCheckedModeBanner: false,
      theme: AntecoTheme.lightTheme,
      darkTheme: AntecoTheme.darkTheme,
      themeMode: themeProvider.themeMode,
      home: const SplashScreen(),
      routes: {
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const HomeScreen(),
        '/bill-detail': (_) => const BillDetailScreen(),
        '/payments': (_) => const PaymentScreen(),
        '/report-outage': (_) => const ReportOutageScreen(),
        '/outage-tracking': (_) => const OutageTrackingScreen(),
        '/outages': (_) => const OutageListScreen(),
        '/service-requests': (_) => const ServiceRequestsScreen(),
        '/create-service-request': (_) => const CreateServiceRequestScreen(),
        '/support': (_) => const SupportScreen(),
        '/ticket-detail': (_) => const TicketDetailScreen(),
        '/faqs': (_) => const FaqScreen(),
        '/consumption': (_) => const ConsumptionScreen(),
        '/forecast': (_) => const ForecastScreen(),
        '/saving-tips': (_) => const SavingTipsScreen(),
        '/profile': (_) => const ProfileScreen(),
        '/settings': (_) => const SettingsScreen(),
        '/notifications': (_) => const NotificationsScreen(),
      },
    );
  }
}
