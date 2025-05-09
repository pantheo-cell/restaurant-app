import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    Alert.alert('🔁 Πατήθηκε το κουμπί register');
    console.log('✅ Register attempt with:', name, email, password);

    try {
      const response = await fetch('http://192.168.1.29:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Εγγραφή επιτυχής!', 'Μπορείς τώρα να συνδεθείς');
        router.push('/login');
      } else {
        Alert.alert('❌ Αποτυχία εγγραφής', data.error || 'Κάτι πήγε στραβά');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Σφάλμα', 'Δοκίμασε ξανά αργότερα');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Εγγραφή</Text>

      <TextInput
        style={styles.input}
        placeholder="Όνομα"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Κωδικός"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Εγγραφή" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});