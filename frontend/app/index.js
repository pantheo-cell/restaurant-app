import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Button, StyleSheet, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockRestaurants = [
  {
    id: 1,
    name: 'Pizza Palace',
    location: 'Athens',
    image: require('../assets/images/pizza.jpg'),
  },
  {
    id: 2,
    name: 'Souvlaki House',
    location: 'Thessaloniki',
    image: require('../assets/images/souvlaki.jpg'),
  },
  {
    id: 3,
    name: 'Vegan Vibes',
    location: 'Patras',
    image: require('../assets/images/vegan.jpg'),
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      console.log('🔑 Token on home:', storedToken);
      setToken(storedToken);
    };
    checkToken();
  }, []);

  const handleReservationClick = (restaurantId) => {
    if (!token) {
      Alert.alert('🔒 Σύνδεση απαιτείται');
      router.push('/login');
    } else {
      router.push('/create-reservation');
    }
  };

  const renderRestaurant = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
      <Button title="Κράτηση" onPress={() => handleReservationClick(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {!token ? (
          <>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.headerLink}>Σύνδεση</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.headerLink}>Εγγραφή</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>🍽️ Εστιατόρια</Text>

      <FlatList
        data={mockRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
    marginBottom: 10, gap: 20,
  },
  headerLink: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  profileIcon: { fontSize: 26 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  card: {
    marginBottom: 20, padding: 15, borderRadius: 10, backgroundColor: '#f9f9f9',
    shadowColor: '#ccc', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  image: { width: '100%', height: 180, borderRadius: 8, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold' },
  location: { fontSize: 16, marginBottom: 10, color: '#666' },
});
