import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SensorDataService } from '../services/SensorDataService';
import { ThresholdData } from '../types';

interface SettingsScreenProps {
  currentThresholds: ThresholdData;
  esp32Ip: string;
}

export default function SettingsScreen({
  currentThresholds,
  esp32Ip,
}: SettingsScreenProps) {
  const [temp, setTemp] = useState(currentThresholds.temp);
  const [moist, setMoist] = useState(currentThresholds.moist);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const dataService = new SensorDataService(esp32Ip);
      const success = await dataService.updateThresholds(temp, moist);
      
      if (success) {
        Alert.alert('Success', 'Thresholds updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update thresholds. Please check your connection.');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed. Check device IP and network.');
    }
    
    setIsUpdating(false);
  };

  const handleReset = () => {
    setTemp(currentThresholds.temp);
    setMoist(currentThresholds.moist);
  };

  const SettingCard = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode; 
  }) => (
    <View style={styles.settingCard}>
      <Text style={styles.settingTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({ 
    icon, 
    label, 
    value, 
    onPress 
  }: { 
    icon: string; 
    label: string; 
    value?: string; 
    onPress?: () => void; 
  }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingRowLeft}>
        <Ionicons name={icon as any} size={20} color="#6b7280" />
        <Text style={styles.settingRowLabel}>{label}</Text>
      </View>
      {value && <Text style={styles.settingRowValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Threshold Settings */}
        <SettingCard title="Automation Thresholds">
          <Text style={styles.settingDescription}>
            These values determine when automated systems like the fan or water valve will activate.
          </Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Ionicons name="thermometer" size={16} color="#ef4444" />
                <Text style={styles.inputLabel}>Temperature Threshold</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={temp}
                  onChangeText={setTemp}
                  placeholder="30.0"
                  keyboardType="numeric"
                />
                <Text style={styles.inputUnit}>°C</Text>
              </View>
              <Text style={styles.inputHelp}>
                Fan will activate when inside temperature exceeds this value
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Ionicons name="water" size={16} color="#3b82f6" />
                <Text style={styles.inputLabel}>Soil Moisture Threshold</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={moist}
                  onChangeText={setMoist}
                  placeholder="40"
                  keyboardType="numeric"
                />
                <Text style={styles.inputUnit}>%</Text>
              </View>
              <Text style={styles.inputHelp}>
                Irrigation system will activate when soil moisture falls below this value
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleUpdate}
                disabled={isUpdating}
              >
                <Ionicons name="save" size={16} color="white" />
                <Text style={styles.primaryButtonText}>
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleReset}
              >
                <Ionicons name="refresh" size={16} color="#6b7280" />
                <Text style={styles.secondaryButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SettingCard>

        {/* App Preferences */}
        <SettingCard title="App Preferences">
          <View style={styles.switchRow}>
            <View style={styles.switchRowLeft}>
              <Ionicons name="moon" size={20} color="#6b7280" />
              <View style={styles.switchRowText}>
                <Text style={styles.switchRowLabel}>Dark Mode</Text>
                <Text style={styles.switchRowDescription}>
                  Toggle between light and dark themes
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#e5e7eb', true: '#059669' }}
              thumbColor={isDarkMode ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchRowLeft}>
              <Ionicons name="notifications" size={20} color="#6b7280" />
              <View style={styles.switchRowText}>
                <Text style={styles.switchRowLabel}>Push Notifications</Text>
                <Text style={styles.switchRowDescription}>
                  Receive alerts for threshold violations
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e7eb', true: '#059669' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </SettingCard>

        {/* System Information */}
        <SettingCard title="System Information">
          <SettingRow
            icon="hardware-chip"
            label="ESP32 Controller IP"
            value={esp32Ip}
          />
          <SettingRow
            icon="phone-portrait"
            label="App Version"
            value="v1.0.0"
          />
          <SettingRow
            icon="calendar"
            label="Last Updated"
            value={new Date().toLocaleDateString()}
          />
          <SettingRow
            icon="color-palette"
            label="Theme"
            value={isDarkMode ? 'Dark' : 'Light'}
          />
        </SettingCard>

        {/* About */}
        <SettingCard title="About">
          <SettingRow
            icon="information-circle"
            label="Help & Support"
          />
          <SettingRow
            icon="document-text"
            label="Privacy Policy"
          />
          <SettingRow
            icon="shield-checkmark"
            label="Terms of Service"
          />
          <SettingRow
            icon="star"
            label="Rate App"
          />
        </SettingCard>
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
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputUnit: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  inputHelp: {
    fontSize: 12,
    color: '#9ca3af',
    lineHeight: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#059669',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchRowText: {
    marginLeft: 12,
    flex: 1,
  },
  switchRowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  switchRowDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingRowLabel: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  settingRowValue: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
});