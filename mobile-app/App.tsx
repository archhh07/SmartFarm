import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DataScreen from './src/screens/DataScreen';
import StreamScreen from './src/screens/StreamScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Services
import { SensorDataService } from './src/services/SensorDataService';
import { NotificationService } from './src/services/NotificationService';

// Types
import { SensorData, AlertData } from './src/types';

const Tab = createBottomTabNavigator();

// Configuration
const ESP32_API_IP = "192.168.202.52";
const ESP32_CAM_STREAM_IP = "192.168.202.120";

export default function App() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [esp32Status, setEsp32Status] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [camStatus, setCamStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [thresholds, setThresholds] = useState({ temp: "30.0", moist: "40" });

  useEffect(() => {
    // Initialize notifications
    NotificationService.initialize();

    // Start data polling
    const dataService = new SensorDataService(ESP32_API_IP);
    
    const pollData = async () => {
      try {
        const status = await dataService.checkStatus();
        setEsp32Status(status ? 'connected' : 'disconnected');
        
        if (status) {
          const data = await dataService.fetchSensorData();
          if (data) {
            setSensorData(data.sensors);
            setThresholds(data.thresholds);
            
            // Add to historical data
            const timestamp = new Date().toISOString();
            setHistoricalData(prev => [...prev.slice(-99), { ...data.sensors, timestamp }]);
            
            // Check for alerts
            checkAlerts(data.sensors, data.thresholds);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setEsp32Status('disconnected');
      }
    };

    // Initial fetch
    pollData();
    
    // Set up polling interval
    const interval = setInterval(pollData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAlerts = (sensors: any, thresholds: any) => {
    const newAlerts: AlertData[] = [];
    const now = new Date();

    if (sensors.insideTemp > parseFloat(thresholds.temp)) {
      const alert: AlertData = {
        id: `temp-${now.getTime()}`,
        type: 'warning',
        title: 'High Temperature Alert',
        message: `Inside temperature (${sensors.insideTemp}°C) exceeds threshold (${thresholds.temp}°C)`,
        timestamp: now.toISOString(),
      };
      newAlerts.push(alert);
      
      // Send push notification
      NotificationService.sendNotification(
        'Temperature Alert',
        alert.message
      );
    }

    if (sensors.moisture < parseInt(thresholds.moist)) {
      const alert: AlertData = {
        id: `moisture-${now.getTime()}`,
        type: 'error',
        title: 'Low Soil Moisture Alert',
        message: `Soil moisture (${sensors.moisture}%) is below threshold (${thresholds.moist}%)`,
        timestamp: now.toISOString(),
      };
      newAlerts.push(alert);
      
      // Send push notification
      NotificationService.sendNotification(
        'Moisture Alert',
        alert.message
      );
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 49)]);
    }
  };

  const clearAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Data':
                iconName = focused ? 'analytics' : 'analytics-outline';
                break;
              case 'Stream':
                iconName = focused ? 'videocam' : 'videocam-outline';
                break;
              case 'Analytics':
                iconName = focused ? 'trending-up' : 'trending-up-outline';
                break;
              case 'Alerts':
                iconName = focused ? 'notifications' : 'notifications-outline';
                break;
              case 'Settings':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
              default:
                iconName = 'circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#059669',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },
          headerStyle: {
            backgroundColor: '#059669',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          options={{ title: 'Dashboard' }}
        >
          {() => (
            <HomeScreen
              esp32Status={esp32Status}
              camStatus={camStatus}
              sensorData={sensorData}
              alerts={alerts}
              historicalData={historicalData}
            />
          )}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Data" 
          options={{ title: 'Live Data' }}
        >
          {() => (
            <DataScreen
              sensorData={sensorData}
              thresholds={thresholds}
              historicalData={historicalData}
            />
          )}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Stream" 
          options={{ title: 'Camera' }}
        >
          {() => (
            <StreamScreen
              camStatus={camStatus}
              streamUrl={`http://${ESP32_CAM_STREAM_IP}:81/stream`}
            />
          )}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Analytics" 
          options={{ title: 'Analytics' }}
        >
          {() => (
            <AnalyticsScreen
              historicalData={historicalData}
              sensorData={sensorData}
            />
          )}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Alerts" 
          options={{ 
            title: 'Alerts',
            tabBarBadge: alerts.length > 0 ? alerts.length : undefined
          }}
        >
          {() => (
            <AlertsScreen
              alerts={alerts}
              onClearAlert={clearAlert}
              onClearAll={clearAllAlerts}
            />
          )}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Settings" 
          options={{ title: 'Settings' }}
        >
          {() => (
            <SettingsScreen
              currentThresholds={thresholds}
              esp32Ip={ESP32_API_IP}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}