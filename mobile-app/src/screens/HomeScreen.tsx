import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SensorData, AlertData } from '../types';
import StatusCard from '../components/StatusCard';
import MetricCard from '../components/MetricCard';
import AlertCard from '../components/AlertCard';

interface HomeScreenProps {
  esp32Status: 'connected' | 'disconnected' | 'checking';
  camStatus: 'connected' | 'disconnected' | 'checking';
  sensorData: SensorData | null;
  alerts: AlertData[];
  historicalData: SensorData[];
}

export default function HomeScreen({
  esp32Status,
  camStatus,
  sensorData,
  alerts,
  historicalData,
}: HomeScreenProps) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh logic would go here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const recentAlerts = alerts.slice(0, 3);

  const getSystemHealth = () => {
    if (esp32Status === 'connected' && camStatus === 'connected') {
      return { status: 'excellent', message: 'All systems operational', color: '#059669' };
    } else if (esp32Status === 'connected' || camStatus === 'connected') {
      return { status: 'good', message: 'Partial connectivity', color: '#f59e0b' };
    } else {
      return { status: 'poor', message: 'Connection issues detected', color: '#ef4444' };
    }
  };

  const systemHealth = getSystemHealth();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#059669', '#10b981']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Smart Farm Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time monitoring and control</Text>
        
        <View style={styles.healthIndicator}>
          <Ionicons 
            name={systemHealth.status === 'excellent' ? 'checkmark-circle' : 'alert-circle'} 
            size={20} 
            color="white" 
          />
          <Text style={styles.healthText}>{systemHealth.message}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusGrid}>
            <StatusCard
              title="ESP32 Controller"
              status={esp32Status}
              icon="hardware-chip"
              description="Main control unit"
            />
            <StatusCard
              title="Camera Feed"
              status={camStatus}
              icon="videocam"
              description="Live monitoring"
            />
            <StatusCard
              title="Active Alerts"
              status={alerts.length > 0 ? 'warning' : 'connected'}
              icon="notifications"
              description={`${alerts.length} alerts`}
              customValue={alerts.length}
            />
            <StatusCard
              title="Data Points"
              status="connected"
              icon="analytics"
              description="Historical records"
              customValue={historicalData.length}
            />
          </View>
        </View>

        {/* Key Metrics */}
        {sensorData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Inside Temperature"
                value={sensorData.insideTemp}
                unit="°C"
                icon="thermometer"
                color="#ef4444"
              />
              <MetricCard
                title="Soil Moisture"
                value={sensorData.moisture}
                unit="%"
                icon="water"
                color="#3b82f6"
              />
              <MetricCard
                title="Inside Humidity"
                value={sensorData.insideHumidity}
                unit="%"
                icon="cloud"
                color="#10b981"
              />
              <MetricCard
                title="Light Level"
                value={sensorData.light}
                unit=""
                icon="sunny"
                color="#f59e0b"
              />
            </View>
          </View>
        )}

        {/* Recent Alerts */}
        {recentAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {recentAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact />
            ))}
          </View>
        )}

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Smart Farm</Text>
          <Text style={styles.welcomeText}>
            Your intelligent farming companion is monitoring your crops 24/7. 
            Use the tabs below to explore live sensor data, view camera feeds, 
            analyze trends, and configure system settings.
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.featureText}>Real-time monitoring</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.featureText}>Automated alerts</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.featureText}>Historical analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.featureText}>Remote control</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  healthText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
});