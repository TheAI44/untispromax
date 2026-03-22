# UntisProMax Mobile App

React Native mobile application for UntisProMax using Expo for fast development and deployment.

## 📋 Features

- **Authentication**: Firebase-based login/signup with persistent sessions
- **Timetable**: View weekly WebUntis schedule with lessons
- **Homework**: Create, edit, and track homework assignments
- **Calendar**: Manage events and important dates
- **Chat**: Real-time messaging with classmates
- **Recovery Plan**: View alternate schedule when absent
- **Settings**: Profile management and app preferences
- **Offline Support**: AsyncStorage caching with queue-based sync
- **Real-time Sync**: Firebase Firestore listeners for live updates
- **Push Notifications**: Expo Notifications + Firebase Cloud Messaging

## 🎯 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: @react-navigation/native (bottom tabs + stack)
- **State Management**: React Context API
- **Database**: Firebase Firestore + Firebase Auth
- **Storage**: AsyncStorage (local caching)
- **Notifications**: Expo Notifications + FCM
- **UI Toolkit**: React Native built-ins + Ionicons

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed
- Expo CLI: `npm install -g expo-cli`
- Firebase project set up at https://console.firebase.google.com
- Android emulator or physical device (Android/iOS)

### Installation

1. **Clone and navigate to mobile folder:**
   ```bash
   cd untispromax/mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase credentials:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase project credentials from [Firebase Console](https://console.firebase.google.com)
   - Credentials needed:
     - API Key
     - Auth Domain
     - Project ID
     - Storage Bucket
     - Messaging Sender ID
     - App ID

4. **Start the development server:**
   ```bash
   expo start
   ```

5. **Run on device/emulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on physical device

## 📁 Project Structure

```
mobile/
├── src/
│   ├── App.tsx                    # Root component with providers
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication & session management
│   │   └── DataContext.tsx        # Firestore data & CRUD operations
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx    # Login form
│   │   │   └── SignupScreen.tsx   # Registration form
│   │   ├── home/
│   │   │   └── HomeScreen.tsx     # Dashboard with upcoming homework
│   │   ├── timetable/
│   │   │   └── TimetableScreen.tsx # Weekly schedule
│   │   ├── homework/
│   │   │   └── HomeworkScreen.tsx # Homework list & management
│   │   ├── calendar/
│   │   │   └── CalendarScreen.tsx # Events calendar
│   │   ├── recovery/
│   │   │   └── RecoveryScreen.tsx # Sick day planning
│   │   ├── settings/
│   │   │   └── SettingsScreen.tsx # User preferences
│   │   └── SplashScreen.tsx       # Loading screen
│   ├── navigation/
│   │   └── AppNavigator.tsx       # Navigation structure (6 tabs)
│   ├── services/firebase/
│   │   └── config.ts             # Firebase initialization
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   └── utils/                    # Placeholder for utilities (coming soon)
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## 🔐 Authentication Flow

1. **Splash Screen**: App checks if user is already logged in
   - Checks AsyncStorage for quick startup
   - Verifies session with Firebase Auth
   
2. **Login/Signup**: Firebase Auth handles user creation
   - Password hashed by Firebase
   - User profile created in Firestore

3. **Session Persistence**: 
   - Firebase Auth token kept in memory during session
   - AsyncStorage backup for instant app startup on next launch

4. **Logout**: Clears both Firebase session and local storage

## 🔄 Real-time Data Sync

### Firestore Listeners
All data is synchronized in real-time via `onSnapshot` listeners in `DataContext`:
- **Homework collection**: Auto-updates when assignments change
- **Events collection**: Reflects calendar changes across devices
- **Chats collection**: Live message updates

### Offline-First Caching
- Data cached locally with AsyncStorage
- Queue pending changes while offline
- Auto-sync when connection restored

## 🔔 Push Notifications (Phase 4)

[Documentation coming in Phase 4 implementation]

- Expo Notifications for alert handling
- Firebase Cloud Messaging for delivery
- Device tokens auto-stored in Firestore
- Deep linking from notification taps

## 🛠️ Development Workflow

### Adding a New Screen

1. Create file in `src/screens/{feature}/{FeatureScreen}.tsx`
2. Use `SafeAreaView` wrapper from react-native-safe-area-context
3. Import and use `useAuth()` and/or `useData()` hooks
4. Add to navigation in `AppNavigator.tsx`

### Accessing User Data

```typescript
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function MyScreen() {
  const { user } = useAuth();
  const { homework, addHomework } = useData();
  
  // Use user and data in your component
}
```

### Example: Adding Homework

```typescript
const { addHomework } = useData();

await addHomework({
  userId: user.uid,
  subject: 'Mathematik',
  description: 'Aufgaben Seite 42-45',
  dueDate: new Date('2024-03-15'),
  completed: false,
});
```

## 📱 Supported Platforms

- **iOS**: 13.0+ (via EAS Build)
- **Android**: 6.0+ (SDK 23+, via EAS Build or APK)
- **Web**: Development only (not recommended for production)

## 🚢 Deployment

### Preparing for App Stores

See `MOBILE_STRATEGY.md` Phase 5 for detailed instructions:

1. **Design Assets**:
   - App icon (1024x1024)
   - Splash screen
   - Screenshots for stores

2. **EAS Build Setup**:
   ```bash
   expo login
   eas build --platform ios
   eas build --platform android
   ```

3. **App Store Submission**:
   - Generate provisioning profiles
   - Create app listings
   - Submit for review

## 📚 Architecture & Design

Comprehensive architecture documentation available in `../MOBILE_STRATEGY.md`:
- Technology comparison matrix
- Code reuse strategy (65-70% from web)
- Offline-first architecture patterns
- Security rules for Firestore
- Push notification architecture
- 5-phase implementation roadmap

## 🐛 Troubleshooting

### Common Issues

**"Firebase credentials not found"**
- Run `cp .env.example .env.local`
- Add your Firebase credentials to `.env.local`
- Restart development server

**"Module not found" errors**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**"Android emulator won't start"**
- Check Android Studio installation
- Verify ANDROID_HOME environment variable
- Try: `emulator -list-avds` then `emulator -avd <name>`

**"App crashes on login"**
- Verify Firebase project allows password authentication
- Check .env.local credentials match Firebase Console
- Review device logs: `expo logs`

## 📝 Version History

- **v0.1.0** (Initial Scaffold)
  - Authentication system
  - Navigation structure
  - Core screens (stubs)
  - Firebase integration
  - Real-time listeners

## 🤝 Contributing

Follow TypeScript + React Native best practices:
- Use functional components with hooks
- Type all props and state
- Reuse components from existing patterns
- Keep screens under 300 lines
- Document non-obvious logic

## 📄 License

Same as UntisProMax web app

## 🔗 Related Files

- Web app: `../index.html`
- Architecture docs: `../MOBILE_STRATEGY.md`
- Teacher data: `../teachers.csv`
- Backend API: https://untispromax-server-1.onrender.com
- Firebase Console: https://console.firebase.google.com

---

**Status**: Phase 1 Complete (Auth + Basic Navigation)
**Next**: Phase 2 (Core Screen Implementation)
**Last Updated**: 2024
