import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.logo}>⚡</Text>
        <Text style={styles.title}>ANTECO Connect</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  logo: { fontSize: 64, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#111827', marginBottom: 12 },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
