import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  FirebaseAuth get auth => FirebaseAuth.instance;
  FirebaseFirestore get db => FirebaseFirestore.instance;
  FirebaseStorage get storage => FirebaseStorage.instance;
  FirebaseMessaging get messaging => FirebaseMessaging.instance;

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

  // ── Auth ──
  Future<UserCredential> signInWithEmail(String email, String password) =>
      auth.signInWithEmailAndPassword(email: email, password: password);

  Future<UserCredential> registerWithEmail(String email, String password) =>
      auth.createUserWithEmailAndPassword(email: email, password: password);

  Future<void> signOut() => auth.signOut();

  User? get currentUser => auth.currentUser;

  // ── Firestore Consumers ──
  CollectionReference get consumers => db.collection('consumers');
  CollectionReference get bills => db.collection('bills');
  CollectionReference get outages => db.collection('outages');
  CollectionReference get transactions => db.collection('transactions');
  CollectionReference get notifications => db.collection('notifications');

  DocumentReference consumerDoc(String uid) => consumers.doc(uid);
  DocumentReference billDoc(String id) => bills.doc(id);
  DocumentReference outageDoc(String id) => outages.doc(id);

  // ── Storage ──
  Reference profilePhotos() => storage.ref('profiles');
  Reference billAttachments() => storage.ref('bills');
  Reference outagePhotos() => storage.ref('outages');

  // ── FCM ──
  Future<String?> getFcmToken() async {
    try {
      return await messaging.getToken();
    } catch (_) {
      return null;
    }
  }

  Future<void> requestNotificationPermission() async {
    await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
  }
}
