import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SensorData, ThresholdData } from '../types';
import GaugeCard from '../components/GaugeCard';
import ValueCard from '../components/ValueCard';
import BinaryCard from '../components/BinaryCard';

interface DataScreenProps {
  sensorData: SensorData | null;
  thresholds: ThresholdData;
  historicalData: SensorData[];
}

export default function DataScreen({
  sensorData,
  thresholds,
  historicalData,
}: DataScreenProps) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  if (!sensorData) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="sync" size={48} color="#059669" />
        <Text style={styles.loadingText}>Waiting for sensor data from ESP32...</Text>
      </View>
    );
  }

  const {
    insideTemp,
    outsideTemp,
    insideHumidity,
    outsideHumidity,
    rain,
    light,
    shed,
    valve,
    fan,
    moisture,
  } = sensorData;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Primary Metrics with Gauges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Metrics</Text>
          <View style={styles.gaugeGrid}>
            <GaugeCard
              title="Inside Temperature"
              value={insideTemp}
              unit="°C"
              max={50}
              threshold={parseFloat(thresholds.temp)}
              color="#ef4444"
            />
            <GaugeCard
              title="Soil Moisture"
              value={moisture}
              unit="%"
              max={100}
              threshold={parseInt(thresholds.moist)}
              color="#3b82f6"
            />
            <GaugeCard
              title="Inside Humidity"
              value={insideHumidity}
              unit="%"
              max={100}
              color="#10b981"
            />
          </View>
        </View>

        {/* Secondary Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Data</Text>
          <View style={styles.valueGrid}>
            <ValueCard
              title="Outside Temperature"
              value={`${outsideTemp} °C`}
              icon="thermometer-outline"
              color="#f59e0b"
            />
            <ValueCard
              title="Outside Humidity"
              value={`${outsideHumidity} %`}
              icon="cloud-outline"
              color="#6366f1"
            />
            <ValueCard
              title="Light Level"
              value={light.toString()}
              icon="sunny-outline"
              color="#eab308"
            />
            <ValueCard
              title="System Status"
              value="Online"
              icon="flash-outline"
              color="#059669"
            />
          </View>
        </View>

        {/* System Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Controls & Status</Text>
          <View style={styles.binaryGrid}>
            <BinaryCard
              title="Weather Status"
              isOn={rain === 1}
              onText="Raining"
              offText="Clear"
              icon="rainy"
            />
            <BinaryCard
              title="Greenhouse Door"
              isOn={shed === 1}
              onText="Open"
              offText="Closed"
              icon="home"
            />
            <BinaryCard
              title="Irrigation System"
              isOn={valve === 1}
              onText="Active"
              offText="Inactive"
              icon="water"
            />
            <BinaryCard
              title="Ventilation Fan"
              isOn={fan === 1}
              onText="Running"
              offText="Stopped"
              icon="refresh"
            />
          </View>
        </View>

        {/* Threshold Information */}
        <View style={styles.thresholdCard}>
          <Text style={styles.thresholdTitle}>Current Thresholds</Text>
          <View style={styles.thresholdGrid}>
            <View style={styles.thresholdItem}>
              <View style={styles.thresholdIcon}>
                <Ionicons name="thermometer" size={20} color="#ef4444" />
              </View>
              <View style={styles.thresholdInfo}>
                <Text style={styles.thresholdLabel}>Temperature Threshold</Text>
                <Text style={styles.thresholdValue}>{thresholds.temp}°C</Text>
              </View>
            </View>
            <View style={styles.thresholdItem}>
              <View style={styles.thresholdIcon}>
                <Ionicons name="water" size={20} color="#3b82f6" />
              </View>
              <View style={styles.thresholdInfo}>
                <Text style={styles.thresholdLabel}>Moisture Threshold</Text>
                <Text style={styles.thresholdValue}>{thresholds.moist}%</Text>
              </View>
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
  gaugeGrid: {
    gap: 12,
  },
  valueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  binaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  thresholdCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thresholdTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  thresholdGrid: {
    gap: 16,
  },
  thresholdItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thresholdInfo: {
    flex: 1,
  },
  thresholdLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  thresholdValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
});