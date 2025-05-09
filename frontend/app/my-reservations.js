
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Button, StyleSheet, Alert, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserReservations() {
  const [reservations, setReservations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', people: '' });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.1.5:5000/api/user/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Σφάλμα λήψης');
    }
  };

  const deleteReservation = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.5:5000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      Alert.alert(data.message);
      fetchReservations();
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Σφάλμα διαγραφής');
    }
  };

  const updateReservation = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.5:5000/api/reservations/${id}`, {
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
      console.error(error);
      Alert.alert('❌ Σφάλμα τροποποίησης');
    }
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
      <Text style={styles.header}>📋 Οι Κρατήσεις Μου</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.reservation_id.toString()}
        renderItem={renderItem}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
