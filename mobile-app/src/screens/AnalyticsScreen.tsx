import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { SensorData } from '../types';

interface AnalyticsScreenProps {
  historicalData: SensorData[];
  sensorData: SensorData | null;
}

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({
  historicalData,
  sensorData,
}: AnalyticsScreenProps) {
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#059669',
    },
  };

  const getChartData = (key: keyof SensorData) => {
    const recentData = historicalData.slice(-10);
    return {
      labels: recentData.map((_, index) => `${index + 1}`),
      datasets: [
        {
          data: recentData.map(item => item[key] as number),
          color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const getAnalytics = () => {
    if (historicalData.length < 10) return null;

    const recent = historicalData.slice(-20);
    const recentAvg = {
      temp: recent.reduce((sum, d) => sum + d.insideTemp, 0) / recent.length,
      moisture: recent.reduce((sum, d) => sum + d.moisture, 0) / recent.length,
      humidity: recent.reduce((sum, d) => sum + d.insideHumidity, 0) / recent.length,
      light: recent.reduce((sum, d) => sum + d.light, 0) / recent.length,
    };

    const growthScore = Math.min(
      100,
      Math.max(
        0,
        (recentAvg.temp >= 18 && recentAvg.temp <= 28 ? 25 : 0) +
          (recentAvg.moisture >= 40 && recentAvg.moisture <= 70 ? 25 : 0) +
          (recentAvg.humidity >= 50 && recentAvg.humidity <= 80 ? 25 : 0) +
          (recentAvg.light >= 300 ? 25 : (recentAvg.light / 300) * 25)
      )
    );

    return {
      recentAvg,
      growthScore: Math.round(growthScore),
    };
  };

  const analytics = getAnalytics();

  if (!analytics || historicalData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bar-chart" size={64} color="#9ca3af" />
        <Text style={styles.emptyTitle}>No Data Available</Text>
        <Text style={styles.emptyText}>
          Analytics will appear once sufficient historical data has been collected.
          Keep your system running to start seeing trends and insights.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* AI Growth Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Ionicons name="bulb" size={24} color="#059669" />
            <Text style={styles.scoreTitle}>AI Growth Optimization Score</Text>
          </View>
          <Text style={styles.scoreSubtitle}>
            Real-time assessment of growing conditions
          </Text>
          
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreValue}>{analytics.growthScore}%</Text>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreProgress, 
                  { width: `${analytics.growthScore}%` }
                ]} 
              />
            </View>
            <Text style={styles.scoreDescription}>
              {analytics.growthScore >= 80
                ? 'Excellent growing conditions'
                : analytics.growthScore >= 60
                  ? 'Good conditions with room for improvement'
                  : analytics.growthScore >= 40
                    ? 'Moderate conditions, adjustments needed'
                    : 'Poor conditions, immediate attention required'}
            </Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Temperature</Text>
            <Text style={styles.summaryValue}>
              {analytics.recentAvg.temp.toFixed(1)}°C
            </Text>
            <Text style={styles.summarySubtext}>20-reading average</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Soil Moisture</Text>
            <Text style={styles.summaryValue}>
              {analytics.recentAvg.moisture.toFixed(1)}%
            </Text>
            <Text style={styles.summarySubtext}>20-reading average</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Humidity</Text>
            <Text style={styles.summaryValue}>
              {analytics.recentAvg.humidity.toFixed(1)}%
            </Text>
            <Text style={styles.summarySubtext}>20-reading average</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Light Level</Text>
            <Text style={styles.summaryValue}>
              {Math.round(analytics.recentAvg.light)}
            </Text>
            <Text style={styles.summarySubtext}>20-reading average</Text>
          </View>
        </View>

        {/* Temperature Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Temperature Trends</Text>
          <Text style={styles.chartSubtitle}>Inside temperature over time</Text>
          {historicalData.length >= 2 && (
            <LineChart
              data={getChartData('insideTemp')}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {/* Moisture Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Soil Moisture Levels</Text>
          <Text style={styles.chartSubtitle}>Moisture percentage over time</Text>
          {historicalData.length >= 2 && (
            <LineChart
              data={getChartData('moisture')}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                propsForDots: {
                  ...chartConfig.propsForDots,
                  stroke: '#3b82f6',
                },
              }}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {/* Light Level Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Light Level Analysis</Text>
          <Text style={styles.chartSubtitle}>Photosynthetic light availability</Text>
          {historicalData.length >= 2 && (
            <BarChart
              data={getChartData('light')}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
              }}
              style={styles.chart}
            />
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8fafc',
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
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  scoreSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  scoreDisplay: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 10,
    color: '#9ca3af',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});