import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const flagImages: Record<string, any> = {
  mx: require('../../assets/images/flags/mx.png'),
  us: require('../../assets/images/flags/us.png'),
  es: require('../../assets/images/flags/es.png'),
  ar: require('../../assets/images/flags/ar.png'),
  co: require('../../assets/images/flags/co.png'),
  cl: require('../../assets/images/flags/cl.png'),
  pe: require('../../assets/images/flags/pe.png'),
  br: require('../../assets/images/flags/br.png'),
};

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [countryIso, setCountryIso] = useState('mx');
  const [showCountryModal, setShowCountryModal] = useState(false);

  const countryCodes = [
    { code: '+52', iso: 'mx', label: 'México' },
    { code: '+1',  iso: 'us', label: 'EE.UU.' },
    { code: '+34', iso: 'es', label: 'España' },
    { code: '+54', iso: 'ar', label: 'Argentina' },
    { code: '+57', iso: 'co', label: 'Colombia' },
    { code: '+56', iso: 'cl', label: 'Chile' },
    { code: '+51', iso: 'pe', label: 'Perú' },
    { code: '+55', iso: 'br', label: 'Brasil' },
  ];

  const selectCountry = (c: { code: string; iso: string }) => {
    setCountryCode(c.code);
    setCountryIso(c.iso);
    setShowCountryModal(false);
  };

  const handleLogin = () => {
    // Basic simulation logic
    if (phone.length > 5) {
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="truck" size={48} color="#1E1E1E" />
          </View>
          <Text style={styles.title}>Driver App</Text>
          <Text style={styles.subtitle}>Panel de Repartidores</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Número de Teléfono</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.countrySelector}
              activeOpacity={0.8}
              onPress={() => setShowCountryModal(true)}
            >
              <Image 
                source={flagImages[countryIso]} 
                style={styles.countryFlagImage} 
                resizeMode="cover"
              />
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Feather name="chevron-down" size={16} color="#1E1E1E" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="555 123 4567"
              placeholderTextColor="#8E8E93"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, phone.length > 5 ? styles.buttonActive : styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={phone.length <= 5}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Ingresar al Sistema</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showCountryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={() => setShowCountryModal(false)}
          />
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona tu país</Text>
            {countryCodes.map((c) => (
              <TouchableOpacity 
                key={c.code} 
                style={[
                  styles.countryItem, 
                  countryCode === c.code && styles.countryItemActive
                ]}
                activeOpacity={0.8}
                onPress={() => selectCountry(c)}
              >
                <View style={styles.countryItemLeft}>
                  <Image 
                    source={flagImages[c.iso]} 
                    style={styles.countryFlagImage} 
                    resizeMode="cover"
                  />
                  <Text style={styles.countryItemLabel}>{c.label}</Text>
                </View>
                <Text style={styles.countryItemCode}>{c.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // flat design: no shadow!
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1E1E1E',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 56,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECECEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    marginRight: 12,
    gap: 6,
  },
  countryFlagImage: {
    width: 22,
    height: 15,
    borderRadius: 2,
  },
  countryCodeText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1E1E1E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#1E1E1E',
  },
  button: {
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  buttonActive: {
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,30,30,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginBottom: 16,
    textAlign: 'center',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  countryItemActive: {
    backgroundColor: '#F3F4F6',
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countryItemLabel: {
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#1E1E1E',
  },
  countryItemCode: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
  },
});
