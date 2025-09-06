# Smart Farm Mobile App

A React Native mobile application for monitoring and controlling your smart farm IoT system.

## Features

- **Real-time Monitoring**: View live sensor data from ESP32 devices
- **Live Camera Feed**: Stream video from ESP32-CAM
- **Analytics Dashboard**: Historical data analysis with charts
- **Smart Alerts**: Push notifications for threshold violations
- **Remote Control**: Adjust system thresholds remotely
- **Cross-platform**: Works on both iOS and Android

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Expo Go app on your mobile device (for testing)

## Installation

1. Navigate to the mobile app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Update ESP32 IP addresses in `App.tsx`:
```typescript
const ESP32_API_IP = "YOUR_ESP32_IP_HERE";
const ESP32_CAM_STREAM_IP = "YOUR_ESP32_CAM_IP_HERE";
```

## Development

### Start the development server:
```bash
npm start
```

### Run on specific platforms:
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

### Testing on Physical Device

1. Install Expo Go from App Store (iOS) or Google Play Store (Android)
2. Scan the QR code displayed in the terminal
3. The app will load on your device

## Building for Production

### Prerequisites for building:
- EAS CLI: `npm install -g eas-cli`
- Expo account (create at expo.dev)

### Build commands:
```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## Project Structure

```
mobile-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   ├── services/           # API and notification services
│   └── types/              # TypeScript type definitions
├── assets/                 # Images, icons, and other assets
├── App.tsx                 # Main application component
└── app.json               # Expo configuration
```

## Configuration

### ESP32 Setup
Make sure your ESP32 devices are:
1. Connected to the same WiFi network as your mobile device
2. Running the smart farm firmware
3. Accessible via HTTP requests

### Notifications
The app automatically requests notification permissions on startup. Make sure to allow notifications to receive alerts.

## Troubleshooting

### Common Issues:

1. **Cannot connect to ESP32**:
   - Verify ESP32 IP addresses in `App.tsx`
   - Ensure devices are on the same network
   - Check ESP32 is powered on and running

2. **Camera stream not loading**:
   - Verify ESP32-CAM IP address
   - Check camera is properly connected
   - Ensure stream endpoint is accessible

3. **Build errors**:
   - Clear cache: `expo r -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## Features Overview

### Home Screen
- System status overview
- Key metrics display
- Recent alerts
- Quick system health check

### Data Screen
- Real-time sensor readings
- Gauge displays for critical metrics
- System control status
- Threshold information

### Stream Screen
- Live camera feed from ESP32-CAM
- Fullscreen viewing mode
- Stream quality information
- Connection status

### Analytics Screen
- Historical data charts
- AI growth optimization score
- Trend analysis
- Performance insights

### Alerts Screen
- Active alert management
- Filter by alert type
- Alert statistics
- Clear individual or all alerts

### Settings Screen
- Threshold configuration
- App preferences
- System information
- About section

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.