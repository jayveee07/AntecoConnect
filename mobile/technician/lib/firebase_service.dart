import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'config/firebase_config.dart';

class FirebaseTechnicianService {
  static final FirebaseTechnicianService _instance = FirebaseTechnicianService._internal();
  factory FirebaseTechnicianService() => _instance;
  FirebaseTechnicianService._internal();

  static Future<void> initialize() async {
    if (Firebase.apps.isNotEmpty) return;
    await Firebase.initializeApp(
      options: FirebaseOptions(
        apiKey: FirebaseConfig.apiKey,
        appId: FirebaseConfig.appId,
        messagingSenderId: FirebaseConfig.messagingSenderId,
        projectId: FirebaseConfig.projectId,
        storageBucket: FirebaseConfig.storageBucket,
        authDomain: FirebaseConfig.authDomain,
      ),
    );
  }

  FirebaseAuth get auth => FirebaseAuth.instance;
  FirebaseFirestore get db => FirebaseFirestore.instance;
  FirebaseStorage get storage => FirebaseStorage.instance;

  CollectionReference get workOrders => db.collection('workOrders');
  CollectionReference get meterReadings => db.collection('meterReadings');
  CollectionReference get schedules => db.collection('readingSchedules');

  Future<List<Map<String, dynamic>>> getWorkOrders() async {
    final snap = await workOrders.orderBy('createdAt', descending: true).get();
    return snap.docs.map((d) => {'id': d.id, ...d.data() as Map<String, dynamic>}).toList();
  }

  Future<List<Map<String, dynamic>>> getMeterReadings() async {
    final snap = await meterReadings.orderBy('scheduledDate', descending: true).get();
    return snap.docs.map((d) => {'id': d.id, ...d.data() as Map<String, dynamic>}).toList();
  }

  Future<void> updateWorkOrderStatus(String id, String status) async {
    await workOrders.doc(id).update({'status': status, 'updatedAt': FieldValue.serverTimestamp()});
  }

  Future<void> submitMeterReading(String id, Map<String, dynamic> data) async {
    await meterReadings.doc(id).update({
      ...data,
      'status': 'submitted',
      'submittedAt': FieldValue.serverTimestamp(),
    });
  }

  Future<UserCredential> signIn(String email, String password) async {
    return await auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> signOut() async {
    await auth.signOut();
  }
}
