
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet, Alert, TextInput, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', people: '' });
  const router = useRouter();

  useEffect(() => {
    getUserInfo();
    fetchReservations();
  }, []);

  const getUserInfo = async () => {
    const userEmail = await AsyncStorage.getItem('email');
    setEmail(userEmail || '—');
  };

  const fetchReservations = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.1.29:5000/api/user/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('❌ Σφάλμα κατά το fetchReservations:', error);
      Alert.alert('❌ Σφάλμα λήψης κρατήσεων');
    } finally {
      setLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.29:5000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      Alert.alert(data.message);
      fetchReservations();
    } catch (error) {
      console.error('❌ Σφάλμα διαγραφής:', error);
      Alert.alert('❌ Σφάλμα διαγραφής');
    }
  };

  const updateReservation = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.29:5000/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_date: form.date,
          reservation_time: form.time,
          people_count: Number(form.people),
        }),
      });
      const data = await res.json();
      Alert.alert(data.message);
      setEditing(null);
      setForm({ date: '', time: '', people: '' });
      fetchReservations();
    } catch (error) {
      console.error('❌ Σφάλμα τροποποίησης:', error);
      Alert.alert('❌ Σφάλμα τροποποίησης');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('email');
    Alert.alert('Αποσυνδεθήκατε');
    router.replace('/');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.restaurant_name}</Text>
      <Text>📍 {item.location}</Text>
      <Text>📅 {item.reservation_date}</Text>
      <Text>⏰ {item.reservation_time}</Text>
      <Text>👥 {item.people_count}</Text>

      {editing === item.reservation_id ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ημερομηνία"
            value={form.date}
            onChangeText={(text) => setForm((f) => ({ ...f, date: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Ώρα"
            value={form.time}
            onChangeText={(text) => setForm((f) => ({ ...f, time: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Άτομα"
            keyboardType="numeric"
            value={form.people}
            onChangeText={(text) => setForm((f) => ({ ...f, people: text }))}
          />
          <Button title="Αποθήκευση" onPress={() => updateReservation(item.reservation_id)} />
        </>
      ) : (
        <View style={styles.buttonRow}>
          <Button title="✏ Τροποποίηση" onPress={() => {
            setEditing(item.reservation_id);
            setForm({
              date: item.reservation_date,
              time: item.reservation_time,
              people: String(item.people_count),
            });
          }} />
          <Button title="🗑 Διαγραφή" onPress={() => deleteReservation(item.reservation_id)} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Το Προφίλ Μου</Text>
      <Text style={styles.email}>Email: {email}</Text>
      <Text style={styles.section}>📋 Οι Κρατήσεις Μου</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : reservations.length === 0 ? (
        <Text style={{ marginTop: 10 }}>Δεν υπάρχουν κρατήσεις.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="🚪 Αποσύνδεση" color="#d11a2a" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
