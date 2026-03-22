# Setup Checklist

Complete this checklist to get the UntisProMax mobile app running on your development machine.

## ✅ Prerequisites

- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Firebase project created at https://console.firebase.google.com
- [ ] Android Studio with emulator OR physical Android device
- [ ] Xcode with iOS emulator OR physical iPhone (for iOS development - macOS only)

## ✅ Project Setup

- [ ] Clone the UntisProMax repository
- [ ] Navigate to `mobile` folder: `cd untispromax/mobile`
- [ ] Copy environment template: `cp .env.example .env.local`
- [ ] Open Firebase Console and copy project credentials
- [ ] Paste credentials into `.env.local`:
  ```
  EXPO_PUBLIC_FIREBASE_API_KEY=...
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  EXPO_PUBLIC_FIREBASE_APP_ID=...
  ```
- [ ] Install dependencies: `npm install`
- [ ] Clear cache (if needed): `expo start -c`

## ✅ Firebase Configuration

- [ ] Enable Email/Password authentication in Firebase Console
  - Go to Authentication → Sign-in method
  - Enable Email/Password
- [ ] Create user collection structure in Firestore:
  - [ ] Create collection `users`
  - [ ] Create collection `homework`
  - [ ] Create collection `events`
  - [ ] Create collection `chats`
- [ ] Set up Firebase security rules (copy from MOBILE_STRATEGY.md → Phase 1 section)

## ✅ Development Server

- [ ] Start Expo development server: `expo start`
- [ ] You should see QR code and options:
  ```
  i - open iOS Simulator
  a - open Android Emulator
  w - open in browser
  ```

## ✅ Run on Device/Emulator

### Option 1: Android Emulator
- [ ] Open Android Studio
- [ ] Start Android Virtual Device (AVD)
- [ ] Press `a` in Expo terminal to open app in emulator

### Option 2: iOS Simulator (macOS only)
- [ ] Press `i` in Expo terminal to open app in simulator

### Option 3: Physical Device
- [ ] Download Expo Go app from App Store or Google Play
- [ ] Scan QR code shown in Expo terminal with Expo Go app
- [ ] App should load on your device

## ✅ Test Authentication

- [ ] Click "Sign up" on splash screen
- [ ] Create test account:
  - [ ] Name: Test User
  - [ ] Email: test@example.com
  - [ ] Password: TestPassword123!
- [ ] Verify user created in Firebase Console
  - Go to Authentication → Users
  - Your test account should appear
- [ ] HomeScreen should load (may be empty if no homework exists)

## ✅ Test Data Creation (Optional)

- [ ] Go to Firebase Console → Firestore Database
- [ ] Create test homework document:
  ```json
  {
    "userId": "[your_test_user_uid]",
    "subject": "Mathematik",
    "description": "Test homework",
    "dueDate": "[future_date]",
    "completed": false
  }
  ```
- [ ] Open app and verify homework appears on HomeScreen

## ✅ Development Ready

- [ ] App starts without errors
- [ ] Authentication works (signup/login)
- [ ] Navigation tabs are accessible
- [ ] HomeScreen loads without crashing
- [ ] Real-time data syncs from Firestore

## 📝 Troubleshooting

If you encounter issues:

1. **"Module not found" or dependency errors**
   - Delete `node_modules`: `rm -rf node_modules`
   - Reinstall: `npm install`
   - Clear cache: `expo start -c`

2. **Firebase credentials not loading**
   - Verify `.env.local` file exists in `mobile/` directory
   - Check Firebase Console for correct project ID
   - Restart development server after changing .env

3. **Emulator won't start**
   - Android: `emulator -list-avds` to see available emulators
   - iOS: Ensure Xcode is installed and updated
   - Try rebuilding: `expo start -c`

4. **App crashes on login**
   - Check Firebase Console for enabled authentication methods
   - Verify `.env.local` credentials match Firebase project
   - Check device logs: `expo logs`

5. **"Cannot find module" in specific screens**
   - Ensure all screen files exist in their directories
   - Check import paths are correct (relative from component file)
   - Run `npm install` again if dependencies are missing

## 🚀 Next Steps

Once setup is complete:

1. **Read Architecture** → Review `../MOBILE_STRATEGY.md` for overall design
2. **Explore Codebase** → Review `src/context/AuthContext.tsx` and `DataContext.tsx` to understand data flow
3. **Implement Screens** → Fill in placeholder screens following existing patterns
4. **Add Features** → Implement homework CRUD, file uploads, offline caching
5. **Test Builds** → Create EAS builds for iOS/Android testing

## 📞 Support

- Expo Docs: https://docs.expo.dev/
- Firebase Docs: https://firebase.google.com/docs
- React Native Docs: https://reactnative.dev/

---

**Happy coding! 🚀**
