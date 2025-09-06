import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

interface GaugeCardProps {
  title: string;
  value: number;
  unit: string;
  max: number;
  threshold?: number;
  color: string;
}

export default function GaugeCard({
  title,
  value,
  unit,
  max,
  threshold,
  color,
}: GaugeCardProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isOverThreshold = threshold && value > threshold;
  const displayColor = isOverThreshold ? '#ef4444' : color;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${displayColor}20` }]}>
          <Ionicons name="analytics" size={16} color={displayColor} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.gaugeContainer}>
          <Svg width={100} height={100} viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <Circle
              cx="50"
              cy="50"
              r="45"
              stroke={displayColor}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </Svg>
          <View style={styles.gaugeCenter}>
            <Text style={[styles.gaugeValue, { color: displayColor }]}>{value}</Text>
            <Text style={styles.gaugeUnit}>{unit}</Text>
          </View>
        </View>

        <View style={styles.info}>
          {threshold && (
            <Text style={styles.threshold}>
              Threshold: {threshold}{unit}
            </Text>
          )}
          <Text style={styles.percentage}>{percentage.toFixed(0)}% of max</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gaugeContainer: {
    position: 'relative',
    marginRight: 16,
  },
  gaugeCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gaugeUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  threshold: {
    fontSize: 12,
    color: '#6b7280',
  },
  percentage: {
    fontSize: 12,
    color: '#9ca3af',
  },
});