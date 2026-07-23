import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ChatCustomerScreen() {
  const [message, setMessage] = useState('');
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <Feather name="x" size={20} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cliente (Juan Pérez)</Text>
        </View>
      
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.chatArea}>
          <View style={styles.messageBubbleLeft}>
            <Text style={styles.messageTextLeft}>Hola, ¿falta mucho para que llegue mi pedido?</Text>
          </View>
          <Text style={styles.messageTime}>14:32</Text>

          <View style={styles.messageBubbleRight}>
            <Text style={styles.messageTextRight}>Hola, ya estoy en camino. Llego en 5 minutos.</Text>
          </View>
          <Text style={styles.messageTimeRight}>14:33</Text>
        </ScrollView>

        <View style={styles.inputArea}>
          <View style={styles.inputPill}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#8E8E93"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !message.trim() ? styles.sendButtonDisabled : null]} 
              disabled={!message.trim()}
              activeOpacity={0.8}
            >
              <Feather name="send" size={16} color="#FFF" style={{ marginLeft: -2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: { fontSize: 16, fontFamily: 'Outfit_600SemiBold', color: '#1E1E1E' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  chatArea: { padding: 16 },
  
  messageBubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderTopLeftRadius: 2,
    maxWidth: '80%',
  },
  messageTextLeft: { color: '#1E1E1E', fontSize: 15, fontFamily: 'Outfit_400Regular' },
  messageTime: { color: '#8E8E93', fontSize: 11, fontFamily: 'Outfit_500Medium', marginTop: 4, marginBottom: 16, alignSelf: 'flex-start', paddingHorizontal: 4 },
  
  messageBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderTopRightRadius: 2,
    maxWidth: '80%',
  },
  messageTextRight: { color: '#FFF', fontSize: 15, fontFamily: 'Outfit_400Regular' },
  messageTimeRight: { color: '#8E8E93', fontSize: 11, fontFamily: 'Outfit_500Medium', marginTop: 4, marginBottom: 16, alignSelf: 'flex-end', paddingHorizontal: 4 },
  
  inputArea: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  inputPill: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    padding: 6,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: '#1E1E1E',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
