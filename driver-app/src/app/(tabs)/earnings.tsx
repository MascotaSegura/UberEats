import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function EarningsScreen() {
  const deliveries = [
    { id: 'ord-1', customer: 'Juan Pérez', destination: 'Col. Centro - Av. Insurgentes Sur 810', time: '14:30', amount: '$298.00' },
    { id: 'ord-2', customer: 'María Gómez', destination: 'Blvd. Valle Verde 1450, Col. Norte', time: '13:15', amount: '$179.00' },
    { id: 'ord-3', customer: 'Carlos López', destination: 'Col. Roma Norte - Sonora 55', time: '12:00', amount: '$450.00' },
  ];

  const total = deliveries.reduce((acc, curr) => acc + parseFloat(curr.amount.replace('$', '')), 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ganancias</Text>
        <Text style={styles.headerSubtitle}>Hoy</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.iconContainer}>
          <Feather name="dollar-sign" size={24} color="#1E1E1E" />
        </View>
        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        <Text style={styles.totalLabel}>Ganancias Totales</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Historial de Entregas</Text>
        
        <View style={styles.deliveriesList}>
          {deliveries.map((item) => (
            <View key={item.id} style={styles.deliveryCard}>
              <View style={styles.deliveryIcon}>
                <Feather name="check-circle" size={20} color="#06C167" />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={styles.destinationName}>{item.customer}</Text>
                <Text style={styles.timeText}>{item.destination} • {item.time}</Text>
              </View>
              <Text style={styles.amountText}>+{item.amount}</Text>
            </View>
          ))}
        </View>
      </View>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    height: 80,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
    color: '#06C167',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginBottom: 16,
    marginLeft: 8,
  },
  deliveriesList: {
    gap: 12,
  },
  deliveryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#E5F7ED',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deliveryInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1E1E1E',
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginTop: 2,
  },
  amountText: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
  },
});
