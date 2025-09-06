import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BinaryCardProps {
  title: string;
  isOn: boolean;
  onText: string;
  offText: string;
  icon: string;
}

export default function BinaryCard({
  title,
  isOn,
  onText,
  offText,
  icon,
}: BinaryCardProps) {
  const statusColor = isOn ? '#059669' : '#6b7280';
  const backgroundColor = isOn ? 'rgba(5, 150, 105, 0.1)' : 'rgba(107, 114, 128, 0.1)';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor }]}>
          <Ionicons name={icon as any} size={16} color={statusColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={[styles.statusContainer, { backgroundColor }]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {isOn ? onText : offText}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});