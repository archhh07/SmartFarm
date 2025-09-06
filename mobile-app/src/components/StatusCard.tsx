import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusCardProps {
  title: string;
  status: 'connected' | 'disconnected' | 'checking' | 'warning';
  icon: string;
  description: string;
  customValue?: number;
}

export default function StatusCard({
  title,
  status,
  icon,
  description,
  customValue,
}: StatusCardProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          text: customValue !== undefined ? customValue.toString() : 'Connected',
          color: '#059669',
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          statusIcon: 'checkmark-circle',
        };
      case 'disconnected':
        return {
          text: 'Disconnected',
          color: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          statusIcon: 'alert-triangle',
        };
      case 'warning':
        return {
          text: customValue !== undefined ? customValue.toString() : 'Warning',
          color: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          statusIcon: 'warning',
        };
      default:
        return {
          text: 'Checking...',
          color: '#6b7280',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          statusIcon: 'time',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: statusInfo.backgroundColor }]}>
          <Ionicons name={icon as any} size={20} color={statusInfo.color} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      
      <View style={[styles.statusContainer, { backgroundColor: statusInfo.backgroundColor }]}>
        <Ionicons name={statusInfo.statusIcon as any} size={16} color={statusInfo.color} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});