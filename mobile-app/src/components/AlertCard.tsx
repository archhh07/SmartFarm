import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertData } from '../types';

interface AlertCardProps {
  alert: AlertData;
  onClear?: () => void;
  compact?: boolean;
}

export default function AlertCard({ alert, onClear, compact = false }: AlertCardProps) {
  const getAlertStyle = () => {
    switch (alert.type) {
      case 'error':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
          textColor: '#ef4444',
          iconColor: '#ef4444',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
          textColor: '#f59e0b',
          iconColor: '#f59e0b',
        };
      default:
        return {
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderColor: 'rgba(5, 150, 105, 0.2)',
          textColor: '#059669',
          iconColor: '#059669',
        };
    }
  };

  const style = getAlertStyle();
  const timeAgo = new Date(alert.timestamp).toLocaleString();

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
        <View style={[styles.compactIcon, { backgroundColor: style.backgroundColor }]}>
          <Ionicons name={getAlertIcon() as any} size={16} color={style.iconColor} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{alert.title}</Text>
          <Text style={styles.compactMessage} numberOfLines={1}>{alert.message}</Text>
        </View>
        <Text style={styles.compactTime}>{timeAgo}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: style.backgroundColor }]}>
            <Ionicons name={getAlertIcon() as any} size={20} color={style.iconColor} />
          </View>
          <View style={styles.headerText}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{alert.title}</Text>
              <View style={[styles.typeBadge, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
                <Text style={[styles.typeText, { color: style.textColor }]}>
                  {alert.type.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.message}>{alert.message}</Text>
            <Text style={styles.timestamp}>Triggered: {timeAgo}</Text>
          </View>
        </View>
      </View>
      
      {onClear && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Ionicons name="close" size={16} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  compactIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactContent: {
    flex: 1,
    gap: 2,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  compactMessage: {
    fontSize: 12,
    color: '#6b7280',
  },
  compactTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
});