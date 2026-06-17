import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';

class FirebaseTechnicianService {
  static final FirebaseTechnicianService _instance = FirebaseTechnicianService._internal();
  factory FirebaseTechnicianService() => _instance;
  FirebaseTechnicianService._internal();

  static Future<void> initialize() async {
    await Firebase.initializeApp(
      options: FirebaseOptions(
        apiKey: 'AIzaSyAB5xg3MuXh4a8YBUHjhwplu-8_XLaafNo',
        appId: '1:741998841135:web:f92f86259de5260c77a5da',
        messagingSenderId: '741998841135',
        projectId: 'antecoconnect',
        storageBucket: 'antecoconnect.firebasestorage.app',
        authDomain: 'antecoconnect.firebaseapp.com',
      ),
    );
  }

  FirebaseAuth get auth => FirebaseAuth.instance;
  FirebaseFirestore get db => FirebaseFirestore.instance;
  FirebaseStorage get storage => FirebaseStorage.instance;

  CollectionReference get workOrders => db.collection('workOrders');
  CollectionReference get meterReadings => db.collection('meterReadings');
  CollectionReference get schedules => db.collection('readingSchedules');
}
