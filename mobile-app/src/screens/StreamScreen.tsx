import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

interface StreamScreenProps {
  camStatus: 'connected' | 'disconnected' | 'checking';
  streamUrl: string;
}

const { width, height } = Dimensions.get('window');

export default function StreamScreen({ camStatus, streamUrl }: StreamScreenProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const handleRefresh = () => {
    setStreamError(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderStreamContent = () => {
    if (camStatus === 'connected' && !streamError) {
      return (
        <View style={styles.streamContainer}>
          <WebView
            source={{ uri: streamUrl }}
            style={styles.webview}
            onError={() => setStreamError(true)}
            onHttpError={() => setStreamError(true)}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <Ionicons name="sync" size={32} color="#059669" />
                <Text style={styles.loadingText}>Loading stream...</Text>
              </View>
            )}
          />
          
          {/* Stream Overlay */}
          <View style={styles.streamOverlay}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleRefresh}>
              <Ionicons name="refresh" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFullscreen}>
              <Ionicons name={isFullscreen ? "contract" : "expand"} size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.errorContainer}>
        <Ionicons name="videocam-off" size={64} color="#9ca3af" />
        <Text style={styles.errorTitle}>
          {camStatus === 'disconnected' || streamError ? 'Camera Disconnected' : 'Connecting to camera...'}
        </Text>
        <Text style={styles.errorMessage}>
          {streamError
            ? 'Failed to load stream. Check camera connection and try refreshing.'
            : 'Please ensure the ESP32-CAM is powered on and connected to WiFi.'}
        </Text>
        {(camStatus === 'disconnected' || streamError) && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Camera Feed</Text>
        <Text style={styles.headerSubtitle}>Real-time video monitoring from ESP32-CAM</Text>
      </View>

      {/* Stream */}
      <View style={[styles.streamWrapper, isFullscreen && styles.fullscreenStream]}>
        {renderStreamContent()}
      </View>

      {/* Stream Information */}
      {!isFullscreen && (
        <View style={styles.infoSection}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="videocam" size={20} color="#059669" />
                <Text style={styles.infoTitle}>Stream Quality</Text>
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Resolution:</Text>
                  <Text style={styles.infoValue}>Auto (VGA)</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Frame Rate:</Text>
                  <Text style={styles.infoValue}>~10 FPS</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Format:</Text>
                  <Text style={styles.infoValue}>MJPEG</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: camStatus === 'connected' ? '#059669' : '#ef4444' }
                ]} />
                <Text style={styles.infoTitle}>Connection Status</Text>
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <Text style={[
                    styles.infoValue,
                    { color: camStatus === 'connected' ? '#059669' : '#ef4444' }
                  ]}>
                    {camStatus.charAt(0).toUpperCase() + camStatus.slice(1)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Device:</Text>
                  <Text style={styles.infoValue}>ESP32-CAM</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Protocol:</Text>
                  <Text style={styles.infoValue}>HTTP Stream</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  streamWrapper: {
    backgroundColor: '#000',
    aspectRatio: 16 / 9,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fullscreenStream: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    borderRadius: 0,
    zIndex: 1000,
  },
  streamContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  streamOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    marginTop: 12,
  },
  infoSection: {
    padding: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
});