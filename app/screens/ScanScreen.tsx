import { verifyQR } from '@/utils/mockApi';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (permission?.granted === false) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const onBarcodeScanned = async (scanningResult: any) => {
    if (loading) return;
    try {
      setLoading(true);
      const qr = scanningResult.data;
      const result = await verifyQR(qr);
      // Navigate to result screen with scanned data
      router.push({ pathname: '/verify-result', params: { result: JSON.stringify(result) } });
    } catch (err) {
      console.warn('Scan error', err);
      setLoading(false);
    }
  };

  if (permission?.granted === false) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <Text variant="headlineSmall" style={styles.permissionText}>
            Camera permission needed
          </Text>
          <Button mode="contained" onPress={requestPermission} style={styles.permissionButton}>
            Grant Permission
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={onBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      >
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Verifying...</Text>
          </View>
        )}
        {!loading && (
          <View style={styles.overlay}>
            <Text style={styles.instructionText}>Point camera at QR code</Text>
            <View style={styles.scannerFrame} />
          </View>
        )}
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    position: 'absolute',
    top: 40,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fc7f03',
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    marginTop: 12,
  },
});