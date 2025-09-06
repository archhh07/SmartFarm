import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertData } from '../types';
import AlertCard from '../components/AlertCard';

interface AlertsScreenProps {
  alerts: AlertData[];
  onClearAlert: (id: string) => void;
  onClearAll: () => void;
}

export default function AlertsScreen({
  alerts,
  onClearAlert,
  onClearAll,
}: AlertsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'warning' | 'error'>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.type === filter;
  });

  const alertCounts = {
    all: alerts.length,
    warning: alerts.filter((a) => a.type === 'warning').length,
    error: alerts.filter((a) => a.type === 'error').length,
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Alerts',
      'Are you sure you want to clear all alerts?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: onClearAll },
      ]
    );
  };

  const FilterButton = ({ 
    type, 
    label, 
    count 
  }: { 
    type: 'all' | 'warning' | 'error'; 
    label: string; 
    count: number; 
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === type && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === type && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
      {count > 0 && (
        <View
          style={[
            styles.filterBadge,
            filter === type && styles.filterBadgeActive,
          ]}
        >
          <Text
            style={[
              styles.filterBadgeText,
              filter === type && styles.filterBadgeTextActive,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>System Alerts</Text>
          <Text style={styles.headerSubtitle}>
            Monitor and manage system notifications
          </Text>
        </View>
        {alerts.length > 0 && (
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearAll}>
            <Ionicons name="trash" size={16} color="white" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            <FilterButton type="all" label="All Alerts" count={alertCounts.all} />
            <FilterButton type="warning" label="Warnings" count={alertCounts.warning} />
            <FilterButton type="error" label="Errors" count={alertCounts.error} />
          </View>
        </ScrollView>
      </View>

      {/* Alerts List */}
      <ScrollView style={styles.alertsList}>
        {filteredAlerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            {alerts.length === 0 ? (
              <>
                <Ionicons name="checkmark-circle" size={64} color="#059669" />
                <Text style={styles.emptyTitle}>All Clear!</Text>
                <Text style={styles.emptyText}>
                  No active alerts. Your smart farm system is operating normally.
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="filter" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>No {filter} alerts</Text>
                <Text style={styles.emptyText}>
                  No alerts match the current filter. Try selecting a different filter option.
                </Text>
              </>
            )}
          </View>
        ) : (
          <View style={styles.alertsContainer}>
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClear={() => onClearAlert(alert.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Alert Statistics */}
      {alerts.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="notifications" size={20} color="#059669" />
              <Text style={styles.statValue}>{alerts.length}</Text>
              <Text style={styles.statLabel}>Total Alerts</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="warning" size={20} color="#f59e0b" />
              <Text style={styles.statValue}>{alertCounts.warning}</Text>
              <Text style={styles.statLabel}>Warnings</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text style={styles.statValue}>{alertCounts.error}</Text>
              <Text style={styles.statLabel}>Errors</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flex: 1,
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
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearAllText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#059669',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  filterBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  filterBadgeTextActive: {
    color: 'white',
  },
  alertsList: {
    flex: 1,
  },
  alertsContainer: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});