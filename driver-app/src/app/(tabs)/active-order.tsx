import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { products } from '../../data/products';
import { branches } from '../../data/branches';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// The card occupies this much of the screen when collapsed
const COLLAPSED_Y = SCREEN_HEIGHT * 0.65;
// The card top when fully expanded (leaves map peeking at top)
const EXPANDED_Y = SCREEN_HEIGHT * 0.1;

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY ?? '';

const mockBranch = branches.find((b: any) => b.id === 'br-1') || branches[0];
const REST_LNG = mockBranch.coordinates.lng;
const REST_LAT = mockBranch.coordinates.lat;
const USER_LNG = -99.133209;
const USER_LAT = 19.432608;

const orderItems = [products[1], products[3]];
const itemsDescription = orderItems.map((p) => `1x ${p.name}`).join(', ');
const totalPrice = orderItems.reduce((sum, p) => sum + p.price, 0).toFixed(2);

const mapHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    .leaflet-attribution-flag { display: none !important; }
    .custom-dot { width:14px; height:14px; border-radius:50%; border:3px solid #FFF; }
    .driver-marker {
      width:32px; height:32px; background:#1E1E1E; border-radius:50%;
      border:3px solid #FFF; display:flex; align-items:center; justify-content:center;
    }
    .driver-marker::after {
      content:''; width:12px; height:12px; background:#FFF; border-radius:50%;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var MAP_KEY = '${MAPTILER_KEY}';
    var restLat = ${REST_LAT}, restLng = ${REST_LNG};
    var userLat = ${USER_LAT}, userLng = ${USER_LNG};
    var map = L.map('map', { zoomControl:false, attributionControl:false })
      .setView([(restLat+userLat)/2, (restLng+userLng)/2], 14);
    L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key='+MAP_KEY,
      { maxZoom:19 }).addTo(map);
    var route = L.polyline([[restLat,restLng],[userLat,userLng]], {color:'#1E1E1E',weight:4}).addTo(map);
    map.fitBounds(route.getBounds(), { padding:[40,40] });
    L.marker([restLat,restLng], { icon: L.divIcon({ className:'', html:'<div class="custom-dot" style="background:#1E1E1E"></div>', iconSize:[14,14], iconAnchor:[7,7] }) }).addTo(map);
    L.marker([userLat,userLng], { icon: L.divIcon({ className:'', html:'<div class="custom-dot" style="background:#06C167"></div>', iconSize:[14,14], iconAnchor:[7,7] }) }).addTo(map);
    var driverIcon = L.divIcon({ className:'', html:'<div class="driver-marker"></div>', iconSize:[32,32], iconAnchor:[16,16] });
    var driver = L.marker([restLat,restLng], { icon:driverIcon }).addTo(map);
    var DURATION = 20000, start = Date.now();
    (function animate() {
      var t = ((Date.now()-start)%DURATION)/DURATION;
      driver.setLatLng([restLat+(userLat-restLat)*t, restLng+(userLng-restLng)*t]);
      requestAnimationFrame(animate);
    })();
  </script>
</body>
</html>`;

export default function ActiveOrderScreen() {
  const [orderState, setOrderState] = useState<'pending' | 'picking' | 'delivering'>('pending');

  // Animated Y position of the bottom sheet
  const sheetY = useRef(new Animated.Value(COLLAPSED_Y)).current;
  // Track which snap we're currently on so gestures are relative to it
  const currentSnap = useRef(COLLAPSED_Y);

  // PanResponder ONLY attached to the handle bar — avoids ScrollView conflicts
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        sheetY.setOffset(currentSnap.current);
        sheetY.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        // Clamp dragging between expanded and collapsed positions
        const next = currentSnap.current + g.dy;
        if (next >= EXPANDED_Y && next <= COLLAPSED_Y) {
          sheetY.setValue(g.dy);
        }
      },
      onPanResponderRelease: (_, g) => {
        sheetY.flattenOffset();
        const targetSnap = g.dy < -60 || g.vy < -0.5 ? EXPANDED_Y : COLLAPSED_Y;
        currentSnap.current = targetSnap;
        Animated.spring(sheetY, {
          toValue: targetSnap,
          useNativeDriver: true,
          bounciness: 4,
        }).start();
      },
    })
  ).current;

  const advanceState = () => {
    if (orderState === 'pending') setOrderState('picking');
    else if (orderState === 'picking') setOrderState('delivering');
    else {
      setOrderState('pending');
      router.navigate('/(tabs)/earnings');
    }
  };

  const getButtonText = () => {
    if (orderState === 'pending') return 'Aceptar Pedido';
    if (orderState === 'picking') return 'Confirmar Recolección';
    return 'Completar Entrega';
  };

  return (
    <View style={styles.container}>
      {/* Full-screen map as the base layer */}
      <WebView
        source={{ html: mapHtml }}
        style={StyleSheet.absoluteFillObject}
        scrollEnabled={false}
        javaScriptEnabled
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        cacheEnabled={false}
      />

      {/* Bottom sheet anchored to bottom of screen, animated by Y position */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: sheetY }] },
        ]}
      >
        {/* HANDLE — this is the ONLY part that captures pan gestures */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handleBar} />
        </View>

        {/* Scrollable content — PanResponder NOT attached here */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.title}>
            {orderState === 'pending' && 'Nuevo Pedido'}
            {orderState === 'picking' && 'Dirígete al Restaurante'}
            {orderState === 'delivering' && 'Entrega al Cliente'}
          </Text>

          <View style={styles.infoBlock}>
            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Feather name="map-pin" size={20} color="#1E1E1E" />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>Recolección</Text>
                <Text style={styles.infoValue}>
                  {mockBranch.name} – {mockBranch.address}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconBox}>
                <Feather name="user" size={20} color="#1E1E1E" />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>Entrega</Text>
                <Text style={styles.infoValue}>
                  Juan Pérez – Av. Insurgentes Sur 810, Apto 3
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.itemsBlock}>
            <Text style={styles.itemsTitle}>{itemsDescription}</Text>
            <Text style={styles.itemsSub}>
              Total a cobrar: ${totalPrice} (Pagado online) · Pedido #ord-1
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.chatBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/chat-customer')}
            >
              <Feather name="message-circle" size={20} color="#1E1E1E" />
              <Text style={styles.chatBtnText}>Chat Cliente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.chatBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/chat-support')}
            >
              <Feather name="help-circle" size={20} color="#1E1E1E" />
              <Text style={styles.chatBtnText}>Soporte</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.mainBtn}
            onPress={advanceState}
            activeOpacity={0.8}
          >
            <Text style={styles.mainBtnText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  // Sheet sits below screen initially; animated.translateY moves it into view
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    // Height: from EXPANDED_Y to bottom of screen, so all content fits when expanded
    height: SCREEN_HEIGHT - EXPANDED_Y,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  handleArea: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#1E1E1E',
    marginBottom: 20,
    textAlign: 'center',
  },

  infoBlock: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1E1E1E',
    fontFamily: 'Outfit_500Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 16,
    marginLeft: 56,
  },

  itemsBlock: { marginBottom: 20, paddingHorizontal: 8 },
  itemsTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: '#1E1E1E',
  },
  itemsSub: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: '#8E8E93',
    marginTop: 4,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  chatBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 9999,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chatBtnText: {
    color: '#1E1E1E',
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
  },

  mainBtn: {
    backgroundColor: '#06C167',
    borderRadius: 9999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  mainBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
});
