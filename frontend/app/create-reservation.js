
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CreateReservation() {
  const [restaurantId, setRestaurantId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('❌ Δεν είστε συνδεδεμένος');
        return;
      }

      const reservationData = {
        restaurant_id: Number(restaurantId),
        reservation_date: date,
        reservation_time: time,
        people_count: Number(people),
      };

      console.log('📦 Sending reservation data:', JSON.stringify(reservationData));
      console.log('🔐 Token:', token);

      const response = await fetch('http://192.168.1.29:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      console.log('📥 Response:', data);

      if (response.ok) {
        Alert.alert('✅ Κράτηση καταχωρήθηκε!');
        router.push('/profile');
      } else {
        Alert.alert('❌ Σφάλμα', data.error || 'Κάτι πήγε στραβά');
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      Alert.alert('❌ Σφάλμα σύνδεσης');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Νέα Κράτηση</Text>

      <TextInput
        style={styles.input}
        placeholder="ID Εστιατορίου"
        keyboardType="numeric"
        value={restaurantId}
        onChangeText={setRestaurantId}
      />

      <TextInput
        style={styles.input}
        placeholder="Ημερομηνία (π.χ. 2025-05-01)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Ώρα (π.χ. 20:00:00)"
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={styles.input}
        placeholder="Αριθμός ατόμων"
        keyboardType="numeric"
        value={people}
        onChangeText={setPeople}
      />

      <Button title="Κράτηση" onPress={handleSubmit} />
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
