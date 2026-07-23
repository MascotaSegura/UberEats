import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { products } from '../../data/products';
import { branches } from '../../data/branches';

export default function DashboardScreen() {
  const [isOnline, setIsOnline] = useState(false);

  const mockBranch = branches.find((b: any) => b.id === 'br-1') || branches[0];
  const orderItems = [products[1], products[3]];
  
  const itemsDescription = orderItems.map(p => `1x ${p.name}`).join(', ');
  
  const mockOrder = {
    id: 'ord-1',
    restaurant: `${mockBranch.name} - ${mockBranch.address}`,
    customer: 'Juan Pérez',
    distance: '2.5 km',
    price: `$${orderItems.reduce((sum, p) => sum + p.price, 0).toFixed(2)}`,
    items: itemsDescription,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, Carlos M.</Text>
          <Text style={styles.subtitle}>
            {isOnline ? 'Buscando pedidos...' : 'Estás desconectado'}
          </Text>
        </View>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => setIsOnline(!isOnline)}
          style={[styles.customSwitch, isOnline && styles.customSwitchActive]}
        >
          <View style={[styles.switchThumb, isOnline && styles.switchThumbActive]} />
        </TouchableOpacity>
      </View>

      {!isOnline ? (
        <View style={styles.emptyState}>
          <Feather name="moon" size={48} color="#8E8E93" />
          <Text style={styles.emptyText}>Conéctate para recibir pedidos</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Nuevo Pedido Disponible</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderPrice}>{mockOrder.price}</Text>
              <Text style={styles.orderDistance}>{mockOrder.distance}</Text>
            </View>
            <View style={styles.orderLocations}>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={16} color="#1E1E1E" />
                <Text style={styles.locationText}>{mockOrder.restaurant}</Text>
              </View>
              <View style={styles.locationRow}>
                <Feather name="user" size={16} color="#1E1E1E" />
                <Text style={styles.locationText}>{mockOrder.customer}</Text>
              </View>
              <View style={styles.locationRow}>
                <Feather name="package" size={16} color="#8E8E93" />
                <Text style={[styles.locationText, { color: '#8E8E93', fontSize: 14 }]}>{mockOrder.items}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.acceptButton}
              activeOpacity={0.8}
              onPress={() => router.navigate('/(tabs)/active-order')}
            >
              <Text style={styles.acceptButtonText}>Ver y Aceptar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 80,
    backgroundColor: '#FFF',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  customSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECECEE',
    padding: 2,
    justifyContent: 'center',
  },
  customSwitchActive: {
    backgroundColor: '#06C167',
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    fontFamily: 'Outfit_500Medium',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginBottom: 16,
    marginLeft: 8,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderPrice: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
  },
  orderDistance: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#06C167',
    backgroundColor: '#E5F7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  orderLocations: {
    gap: 12,
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#1E1E1E',
  },
  acceptButton: {
    backgroundColor: '#06C167',
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});
