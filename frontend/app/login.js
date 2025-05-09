import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('✅ Login attempt:', email, password);

    try {
      const response = await fetch('http://192.168.1.29:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 API response:', data);

      if (!data.token) {
        Alert.alert('⚠️ Δεν λάβαμε token από τον server');
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('email', email);

      const saved = await AsyncStorage.getItem('token');
      console.log('💾 Token saved locally:', saved);

      Alert.alert('✅ Σύνδεση επιτυχής!');
      router.replace('/'); // επιστροφή στην αρχική
    } catch (err) {
      console.error('❌ Network error:', err);
      Alert.alert('Σφάλμα', 'Πρόβλημα σύνδεσης με τον server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Σύνδεση</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Κωδικός πρόσβασης"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Σύνδεση" onPress={handleLogin} />

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>Δεν έχεις λογαριασμό; Εγγραφή</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  registerText: {
    marginTop: 20,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
