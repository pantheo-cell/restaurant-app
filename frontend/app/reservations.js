import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('❌ Δεν υπάρχει token', 'Παρακαλώ συνδεθείτε ξανά');
        return;
      }

      const response = await fetch('http://192.168.1.5:5000/api/user/reservations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReservations(data);
      } else {
        Alert.alert('❌ Αποτυχία', data.message || 'Σφάλμα κατά την ανάκτηση');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Σφάλμα', 'Αδυναμία σύνδεσης με τον server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Οι κρατήσεις μου</Text>

      {reservations.length === 0 ? (
        <Text>Δεν υπάρχουν κρατήσεις.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemText}>🍽️ {item.restaurant_name} ({item.location})</Text>
              <Text style={styles.itemText}>📆 {item.reservation_date.split('T')[0]}</Text>
              <Text style={styles.itemText}>⏰ {item.reservation_time}</Text>
              <Text style={styles.itemText}>👥 {item.people_count} άτομα</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#eee',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
});