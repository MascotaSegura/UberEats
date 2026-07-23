import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Feather name="user" size={32} color="#FFF" />
          </View>
          <Text style={styles.name}>Carlos M.</Text>
          <Text style={styles.phone}>+52 555 123 4567</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="star" size={20} color="#06C167" />
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Feather name="check-circle" size={20} color="#06C167" />
              <Text style={styles.statValue}>1,240</Text>
              <Text style={styles.statLabel}>Entregas</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuList}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8}>
            <View style={styles.menuIcon}>
              <Feather name="settings" size={20} color="#1E1E1E" />
            </View>
            <Text style={styles.menuText}>Configuración de la Cuenta</Text>
            <Feather name="chevron-right" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.8} onPress={() => router.push('/chat-support')}>
            <View style={styles.menuIcon}>
              <Feather name="help-circle" size={20} color="#1E1E1E" />
            </View>
            <Text style={styles.menuText}>Centro de Ayuda</Text>
            <Feather name="chevron-right" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={confirmLogout}>
            <Feather name="log-out" size={20} color="#1E1E1E" />
            <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={() => setShowLogoutModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Feather name="log-out" size={32} color="#FF3B30" />
            </View>
            <Text style={styles.modalTitle}>¿Cerrar Sesión?</Text>
            <Text style={styles.modalSubtitle}>Tendrás que volver a ingresar para usar la app.</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]} 
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnDanger]} 
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnDangerText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    height: 80,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Outfit_500Medium',
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  menuList: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#1E1E1E',
  },
  logoutWrapper: {
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 40,
  },
  logoutBtn: {
    backgroundColor: '#E5E5E7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 9999,
    gap: 8,
  },
  logoutBtnText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30,30,30,0.4)',
  },
  modalContent: {
    width: 320,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalIconBox: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalBtnCancelText: {
    color: '#1E1E1E',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  modalBtnDanger: {
    backgroundColor: '#FF3B30',
  },
  modalBtnDangerText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});
