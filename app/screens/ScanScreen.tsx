import { verifyQR } from '@/utils/mockApi';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
            <Text style={styles.subInstructionText}>Scan to verify medicine authenticity</Text>
            <View style={styles.scannerFrame} />
            
            {/* Report Suspicious Button */}
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => router.push('/report-suspicious' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.reportButtonText}>Report Suspicious Medicine</Text>
            </TouchableOpacity>
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
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    top: 60,
  },
  subInstructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    position: 'absolute',
    top: 90,
    opacity: 0.8,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fc7f03',
  },
  reportButton: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(252, 127, 3, 0.9)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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