# UntisProMax Mobile Strategy & Implementation Plan

**Document Date:** March 2026  
**Target Platforms:** iOS, Android  
**Goal:** Feature parity with web app + native app store distribution

---

## 1. CODEBASE ANALYSIS

### Current Architecture
- **Frontend:** Single-file HTML/CSS/JS (~3500+ lines)
- **Backend:** Node.js server on Render.com (`untispromax-server-1.onrender.com`)
- **Database:** Firebase Firestore + Firebase Authentication
- **Key Features:**
  - WebUntis timetable integration (via custom server)
  - Chat system with real-time messaging
  - Homework/task management
  - Calendar/events
  - Recovery page (sick/absent management)
  - Mensaplan (school cafeteria menu with OCR)
  - File uploads
  - Light/dark theme support
  - Mobile-responsive design

### Data Layer Architecture
```
Frontend (Web) ──→ Firebase Auth + Firestore
         └────────→ Render Server (WebUntis proxy)

Firestore Collections:
  ├── appdata
  │   ├── homework []
  │   ├── events []
  │   ├── chats {}
  │   ├── users {}
  │   ├── wishes []
  │   ├── recovery {}
  │   ├── timetables {}
  │   └── mensaplan {}
  └── (user-specific docs)
```

### Features Using Render Backend
- WebUntis timetable pulling (`/timetable?offset=0,1`)
- Mensaplan scraping (future endpoint)

### Features Using Firebase
- **Authentication:** Email/password + signup validation
- **Real-time Sync:** All data collections
- **File Storage:** Chat uploads, profile photos (base64 in Firestore)
- **Offline:** LocalStorage + Firestore sync

---

## 2. RECOMMENDED APPROACH: Capacitor + React Native Hybrid

### Decision Matrix

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **React Native** | Shared code, large ecosystem, strong Firebase support | Steeper learning curve, slower iteration, platform inconsistencies | ✅ **Best for long-term** |
| **Capacitor** | Reuse existing HTML/CSS/JS, fast MVP, minimal learning | Limited to mobile web wrapper, slower performance than native | ⚠️ Easy start but limited |
| **Flutter** | Excellent performance, beautiful native UI, strong Firebase | Dart learning, can't reuse JS code, separate codebase | ❌ Overkill for your use case |
| **PWA Wrapper** | Ultra-fast to build, offline support | App store rejection risk, poor notifications, limited native features | ⚠️ Not viable for stores |

### **Selected Strategy: React Native (Expo)**

**Why Expo?**
1. ✅ **Code Reuse:** Can extract 60-70% of business logic (Firebase utilities, data models, state management)
2. ✅ **Fast Iteration:** Over-the-air updates ('Expo Updates')
3. ✅ **Firebase Ecosystem:** Native libraries for Auth, Firestore, Storage
4. ✅ **Store Submission:** Seamless iOS/Android app store integration
5. ✅ **Offline Support:** AsyncStorage + Firestore offline persistence
6. ✅ **Team Learning:** If you know JS, you already know React Native
7. ✅ **Maintainability:** Single codebase for iOS/Android + web (via shared utils)

**Secondary Option: Capacitor** (for low-effort MVP)
- If you want to launch a mobile app in 2-3 weeks without rewriting
- Wrap existing web app with Capacitor
- Later migrate to React Native for better performance

---

## 3. ARCHITECTURE DESIGN

### Folder Structure (Recommended)

```
untispromax/
├── web/                          # Existing web app
│   └── index.html
│
├── mobile/                        # React Native mobile apps
│   ├── app.json                  # Expo config
│   ├── package.json
│   ├── eas.json                  # Expo Application Services config
│   ├── babel.config.js
│   ├── tsconfig.json
│   │
│   ├── src/
│   │   ├── screens/              # Screen components
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── SignupScreen.tsx
│   │   │   │   └── SignupStepScreen.tsx
│   │   │   ├── home/
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   └── MensaWidget.tsx
│   │   │   ├── timetable/
│   │   │   │   ├── TimetableScreen.tsx
│   │   │   │   └── DayLessonsScreen.tsx
│   │   │   ├── homework/
│   │   │   │   ├── HomeworkScreen.tsx
│   │   │   │   └── HomeworkDetailScreen.tsx
│   │   │   ├── calendar/
│   │   │   │   └── CalendarScreen.tsx
│   │   │   ├── recovery/
│   │   │   │   └── RecoveryScreen.tsx
│   │   │   └── settings/
│   │   │       └── SettingsScreen.tsx
│   │   │
│   │   ├── services/             # Shared business logic
│   │   │   ├── firebase/
│   │   │   │   ├── auth.ts       # Firebase Auth wrapper
│   │   │   │   ├── firestore.ts  # Firestore CRUD operations
│   │   │   │   ├── storage.ts    # Firebase Storage
│   │   │   │   └── offline.ts    # Offline sync logic
│   │   │   ├── api/
│   │   │   │   ├── untis.ts      # Render server calls
│   │   │   │   └── mensa.ts      # Mensaplan scraping
│   │   │   ├── notifications.ts  # Push notifications + local
│   │   │   ├── cache.ts          # AsyncStorage caching
│   │   │   └── logger.ts         # Error logging
│   │   │
│   │   ├── context/              # Global state (React Context)
│   │   │   ├── AuthContext.tsx
│   │   │   ├── DataContext.tsx   # Homework, events, chats
│   │   │   └── SyncContext.tsx   # Offline sync status
│   │   │
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Avatar.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   ├── timetable/
│   │   │   │   ├── LessonCard.tsx
│   │   │   │   └── DoublehourConnector.tsx
│   │   │   └── homework/
│   │   │       └── HomeworkCard.tsx
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useFirestore.ts
│   │   │   ├── useOfflineSync.ts
│   │   │   ├── useCaching.ts
│   │   │   └── usePushNotifications.ts
│   │   │
│   │   ├── types/                # TypeScript interfaces
│   │   │   ├── index.ts
│   │   │   └── firebase.ts
│   │   │
│   │   ├── utils/                # Helpers
│   │   │   ├── theme.ts          # Reuse web theme colors
│   │   │   ├── formatting.ts     # Date, text formatting
│   │   │   ├── validation.ts     # Input validation
│   │   │   └── constants.ts      # API URLs, collection names
│   │   │
│   │   ├── navigation/           # Navigation setup
│   │   │   ├── RootNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── AppNavigator.tsx
│   │   │
│   │   └── App.tsx               # Main entry point
│   │
│   ├── assets/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── images/
│   │
│   └── __tests__/
│       ├── services/
│       ├── hooks/
│       └── components/
│
├── firebase/                      # Shared Firebase config
│   ├── firestore.rules
│   ├── storage.rules
│   └── functions/                # Cloud functions (optional)
│       └── index.ts
│
└── docs/
    ├── ARCHITECTURE.md
    ├── SETUP.md
    └── DEPLOYMENT.md
```

---

## 4. SHARED CODE REUSE STRATEGY

### What CAN be Reused (Web → Mobile)

```typescript
// ✅ REUSABLE: Business Logic & Data Models

// 1. Data Models & Interfaces
interface Homework { id, type, subject, desc, date, done, attachments }
interface Chat { id, type, members, messages, mutedUsers }
interface Timetable { lessons, week, date }
interface Event { id, type, date, description }
// → Move to: mobile/src/types/

// 2. Constants & Configuration
const SERVER_URL = 'https://untispromax-server-1.onrender.com'
const FIREBASE_CONFIG = { apiKey, projectId, ... }
const TEACHER_NAMES = { 'Al': { fullName, gender }, ... }
// → Move to: mobile/src/utils/constants.ts

// 3. Utility Functions
function formatChatTime(ts) { /* ... */ }
function expandTeacherName(abbr) { /* ... */ }
function uid() { return crypto.randomUUID() }
function parseRecoveryData(data) { /* ... */ }
// → Move to: mobile/src/utils/formatting.ts, helpers.ts

// 4. Theme & Styling
const COLORS = {
  bg_primary: '#040d1a',
  accent: '#00b4ff',
  ...
}
// → Move to: mobile/src/utils/theme.ts
// → RN StyleSheet.create() for native performance

// 5. Firebase Initialization & Setup
import { initializeApp } from 'firebase/app'
const db = getFirestore(app)
const auth = getAuth(app)
// → Move to: mobile/src/services/firebase/

// 6. Data Validation Logic
function validateHomeworkInput(title, date) { /* ... */ }
// → Move to: mobile/src/utils/validation.ts
```

### What CANNOT be Reused

❌ **HTML/CSS** (but theme values can be reused)
❌ **DOM APIs** (querySelector, innerHTML, etc.)
❌ **Render-specific CSS** (media queries, flexbox quirks)
❌ **Browser APIs** (localStorage → AsyncStorage in RN)
❌ **File handling** (web File API → react-native-document-picker)

### Code Reuse Metrics
- **Business Logic:** ~65-70%
- **Data Models:** ~100%
- **Type Definitions:** ~100%
- **Constants:** ~90%
- **Utilities:** ~75%
- **UI/Navigation:** ~0% (completely different framework)

---

## 5. CORE ARCHITECTURE PATTERNS

### 5.1 Authentication Flow

```
┌─────────────────────────────────────────────┐
│         Mobile Auth Service                 │
├─────────────────────────────────────────────┤
│ • Firebase Auth initialization              │
│ • Email/password sign up & login           │
│ • Session persistence (AsyncStorage)        │
│ • Auto-refresh tokens                      │
│ • Logout & offline error handling          │
└─────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  AuthContext Provider  │
        │  (React Context API)  │
        └───────────────────────┘
                    ↓
    ┌────────────────────────────────┐
    │  All screens access via hook  │
    │  useAuth() → { user, login }  │
    └────────────────────────────────┘
```

### 5.2 Real-time Data Sync

```
┌──────────────────────────────────────────────┐
│   Firestore Real-time Listeners              │
│   (onSnapshot for each collection)           │
├──────────────────────────────────────────────┤
│ • homework collection                       │
│ • events collection                         │
│ • chats collection                          │
│ • timetables (weekly cached)                │
└──────────────────────────────────────────────┘
                    ↓
    ┌─────────────────────────────┐
    │  DataContext + Redux/Zustand │
    │  (local state management)    │
    └─────────────────────────────┘
                    ↓
    ┌──────────────────────────────┐
    │  Component re-renders        │
    │  via hooks (useData())        │
    └──────────────────────────────┘
```

### 5.3 Offline-First Architecture

```
User Action (add homework, send chat)
        ↓
Write to Local DB (AsyncStorage)
        ↓
Immediately Update UI
        ↓
Queue for sync
        ↓
┌─ If Online: Sync to Firestore
│  • Batch writes for efficiency
│  • Conflict resolution
│  • Retry on failure
│
└─ If Offline: Wait for connection
   • Background sync via react-native-background-fetch
   • Or wait until app reopens
```

### 5.4 Push Notifications

```
App Installation
        ↓
Request Permission (iOS/Android)
        ↓
Get Device Token (Expo or native)
        ↓
Store in Firestore (users/{uid}/deviceTokens)
        ↓
Firebase Cloud Messaging (FCM)
        ↓
Handle in App:
├─ When app is foreground → local notification
├─ When app is background → system notification
└─ When notification tapped → deep link to relevant screen
```

---

## 6. IMPLEMENTATION ROADMAP

### Phase 1: Setup & Authentication (Week 1-2)

**Goal:** Get mobile app bootstrapped with working auth

```bash
Tasks:
□ Initialize React Native project (Expo)
□ Set up TypeScript, ESLint, Prettier
□ Configure Firebase (same project as web)
□ Implement LoginScreen component
□ Implement SignupScreen with multi-step form
□ Test auth flow end-to-end
□ Android build test
□ iOS build test

Deliverable: App that can login/signup, persists session
```

### Phase 2: Core Data & Navigation (Week 2-3)

**Goal:** Connect to Firestore, render first data

```bash
Tasks:
□ Set up React Context for global state
□ Implement Firebase listeners (homework, events)
□ Create HomeScreen with data display
□ Build bottom tab navigation
□ Implement TimetableScreen (read-only)
□ Create SettingsScreen
□ Test data sync in real-time

Deliverable: App displays homework, calendar, timetable from Firestore
```

### Phase 3: Features & User Interactions (Week 3-4)

**Goal:** Add CRUD operations, file uploads, real-time chat

```bash
Tasks:
□ Implement add/edit/delete homework
□ Add file upload to homework (Firebase Storage)
□ Build Chat screen with message rendering
□ Implement real-time chat messaging
□ Add file upload to chat
□ Implement Recovery page
□ Add Mensaplan widget to HomeScreen

Deliverable: Full feature parity with web app
```

### Phase 4: Mobile Optimizations (Week 4-5)

**Goal:** Production-ready experience

```bash
Tasks:
□ Implement offline caching (AsyncStorage)
□ Add push notifications (Expo Notifications)
□ Optimize image loading & caching
□ Implement light/dark theme switching
□ Add deep linking (from notifications)
□ Performance profiling & optimization
□ Error handling & retry logic
□ Background sync for offline changes

Deliverable: App works offline, snappy, handles edge cases
```

### Phase 5: Deployment & Review (Week 5-6)

**Goal:** Ready for app stores

```bash
Tasks:
□ Set up Expo Application Services (EAS) Build
□ Create app icons & splash screens
□ iOS TestFlight build & internal review
□ Android internal testing
□ Fix any platform-specific issues
□ Prepare app store descriptions & screenshots
□ Configure analytics (opt: Sentry, Firebase Analytics)
□ Final end-to-end testing

Deliverable: Apps submitted to TestFlight + internal Android testing
```

---

## 7. FIREBASE RULES FOR MOBILE

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Homework: users can read/write their class
    match /appdata/homework {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      (request.auth.token.isAdmin == true || 
                       request.resource.data.createdBy == request.auth.uid);
    }
    
    // Similar rules for events, chats, etc.
    match /appdata/chats {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Timetables read-only for all app users
    match /appdata/timetables {
      allow read: if request.auth != null;
      allow write: if request.auth.token.isAdmin == true;
    }
  }
}
```

---

## 8. PUSH NOTIFICATIONS SETUP

### Architecture

```
1. App Requests Permission
   ↓
2. Get Device Token from Expo/FCM
   ↓
3. Store token in Firestore: users/{uid}/tokens/[]
   ↓
4. Admin sends notification via:
   a) Firebase Cloud Function (recommended)
   b) Firebase Console
   c) Direct FCM API call
   ↓
5. Message arrives on device
   - Foreground: Show local notification
   - Background: System notification
   - Tapped: Deep link to relevant screen
```

### Example Cloud Function (Node.js)

```typescript
// functions/src/notifications.ts
export const notifyNewHomework = 
  functions.firestore
    .document('appdata/homework/{docId}')
    .onCreate(async (snap) => {
      const hw = snap.data();
      
      // Get all user tokens
      const usersSnap = await admin.firestore()
        .collection('users').get();
      
      const tokens = [];
      usersSnap.docs.forEach(doc => {
        tokens.push(...(doc.data().tokens || []));
      });
      
      // Send to all devices
      await admin.messaging().sendMulticast({
        notification: {
          title: `Neue HA: ${hw.subject}`,
          body: hw.desc.slice(0, 60),
        },
        data: {
          type: 'homework',
          id: docId,
        },
        tokens,
      });
    });
```

---

## 9. OFFLINE-FIRST CACHING STRATEGY

### AsyncStorage Structure

```javascript
// Keys:
'@app/user-profile'        // Current user data
'@app/homework-cache'      // Synced homework
'@app/homework-queue'      // Pending changes (new/edit/delete)
'@app/events-cache'
'@app/chats-cache'
'@app/timetable-cache'     // Weekly cache (expires after 1 week)
'@app/timetable-cache-time'

// Queue structure:
{
  id: 'queue-123',
  action: 'create|update|delete',
  collection: 'homework',
  data: { ... },
  timestamp: Date.now(),
  retries: 0,
  maxRetries: 3,
}
```

### Sync Logic

```typescript
async function syncQueuedChanges() {
  const queue = await AsyncStorage.getItem('@app/homework-queue');
  if (!queue) return;
  
  const changes = JSON.parse(queue);
  
  for (const change of changes) {
    try {
      switch (change.action) {
        case 'create':
          await db.collection('homework').add(change.data);
          break;
        case 'update':
          await db.collection('homework')
            .doc(change.data.id)
            .update(change.data);
          break;
        case 'delete':
          await db.collection('homework')
            .doc(change.data.id)
            .delete();
          break;
      }
      // Remove from queue on success
      changes.splice(changes.indexOf(change), 1);
    } catch (err) {
      if (change.retries++ > change.maxRetries) {
        // Max retries exceeded
        showError(`Could not sync ${change.collection}`);
        changes.splice(changes.indexOf(change), 1);
      }
    }
  }
  
  if (changes.length > 0) {
    await AsyncStorage.setItem(
      '@app/homework-queue',
      JSON.stringify(changes)
    );
  } else {
    await AsyncStorage.removeItem('@app/homework-queue');
  }
}

// Call on app start & every 5 minutes
setInterval(syncQueuedChanges, 5 * 60 * 1000);
onAppFocus(() => syncQueuedChanges());
```

---

## 10. QUICK START IMPLEMENTATION

### Initialize React Native Project

```bash
# Create new Expo project
npx create-expo-app untispromax-mobile --template

cd untispromax-mobile

# Install dependencies
npm install \
  react-native \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  @react-native-async-storage/async-storage \
  firebase \
  expo-notifications \
  expo-file-system \
  expo-document-picker \
  expo-image-picker \
  expo-linear-gradient

npm install -D \
  typescript \
  @types/react \
  @types/react-native \
  eslint \
  prettier

# Initialize TypeScript
npx tsc --init
```

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-native": "^0.72",
    "expo": "^49",
    "@react-navigation/native": "^6",
    "@react-navigation/bottom-tabs": "^6",
    "@react-native-async-storage/async-storage": "^1.17",
    "firebase": "^10",
    "expo-notifications": "^0.27",
    "expo-document-picker": "^13",
    "expo-file-system": "^15",
    "react-native-toast-notifications": "^3.3",
    "zustand": "^4.4" // Or Redux if preferred
  }
}
```

### Firebase Configuration Module

```typescript
// mobile/src/services/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "untispromax-[project].firebaseapp.com",
  projectId: "untispromax-[project]",
  storageBucket: "untispromax-[project].appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.error('Persistence failed');
  } else if (err.code === 'uninitialized') {
    console.error('Persistence uninitialized');
  }
});
```

---

## 11. MIGRATION CHECKLIST

### Pre-Migration (Web App)

- [ ] Ensure all business logic is well-documented
- [ ] Extract reusable functions into `shared/` folder
- [ ] Set up TypeScript in web app (optional but recommended)
- [ ] Document Firebase data schema
- [ ] Ensure Firebase security rules are tested
- [ ] Document API endpoints on Render server

### During Migration

- [ ] Create new React Native project structure
- [ ] Copy constants, types, utilities to shared modules
- [ ] Implement authentication flow
- [ ] Connect to Firebase Firestore
- [ ] Build core screens (Timetable, Homework, Chat)
- [ ] Test on both iOS and Android emulators
- [ ] Load test with sample data

### Post-Launch

- [ ] Monitor crash logs (Sentry or Firebase Crashlytics)
- [ ] Gather user feedback from TestFlight
- [ ] Fix platform-specific issues
- [ ] Optimize performance based on device storage/processor
- [ ] Plan Phase 2 features (push notifications, advanced filtering, etc.)

---

## 12. ESTIMATED EFFORT & TIMELINE

| Phase | Duration | Team Members | Key Deliverables |
|-------|----------|--------------|------------------|
| Setup & Auth | 1-2 weeks | 1 dev | Working login/signup |
| Core Features | 2-3 weeks | 1-2 devs | Timetable, Homework, Chat |
| Optimization | 1-2 weeks | 1 dev | Offline caching, performance |
| Store Submission | 1 week | 1 dev | TestFlight + PlayStore builds |
| **TOTAL** | **5-8 weeks** | **1-2** | **Production-ready apps** |

---

## 13. COST CONSIDERATIONS

### Free Tier (Your Current Setup)

- **Firebase:**
  - Auth: Free tier sufficient for class app
  - Firestore: 50k reads/day free
  - Storage: 1 GB free

- **Hosting:**
  - Expo: Free tier covers updates
  - Render: Free tier for Node.js server

### Optional Paid Services

- **Sentry:** Error tracking ($29/month)
- **Firebase Analytics:** Free within Firebase
- **App Store:** $99/year (Apple), $25 (Google One-time)

---

## 14. SUCCESS CRITERIA

✅ **MVP Checklist:**
- [x] Users can authenticate (login/signup)
- [x] View timetable for current week
- [x] Add/edit/delete homework
- [x] View chat messages in real-time
- [x] Send chat messages with files
- [x] Works offline (shows cached data)
- [x] Persists session
- [x] Both iOS & Android builds created

✅ **Production Checklist:**
- [x] Push notifications working
- [x] Offline sync queues changes
- [x] Error handling & recovery
- [x] Dark/light theme support
- [x] Proper loading states
- [x] Analytics integrated
- [x] Security rules tested
- [x] File upload size limits enforced
- [x] Memory leaks fixed
- [x] App store listing ready

---

## 15. NEXT STEPS

1. **Review this document** with your team
2. **Decide:** React Native (recommended) vs Capacitor (quick MVP)
3. **Set up development environment:**
   - Install Node.js 18+
   - Install Expo CLI or Android Studio
4. **Create React Native project** (see Section 10)
5. **Start with Phase 1:** Authentication
6. **Use provided code templates** in next document

---

## Appendix: Technology Comparison

### React Native vs Capacitor (For You)

| Feature | React Native | Capacitor |
|---------|---|---|
| Code Reuse | 65-70% | 95% |
| Performance | ⭐⭐⭐⭐⭐ Native | ⭐⭐⭐ Web Wrapper |
| Time to MVP | 5-8 weeks | 2-3 weeks |
| App Store Support | Full | Limited (wrapper concerns) |
| Learning Curve | Moderate | Low |
| Maintenance | Easy (one codebase) | Ongoing HTML updates |
| Updates | OTA + app store | Easy OTA |
| **Best For** | **Long-term, scalable apps** | **Quick MVP, internal tools** |

### Recommendation

👉 **USE REACT NATIVE** for UntisProMax because:
1. Your app needs push notifications (better native support)
2. App stores require true native apps for trust
3. Long-term maintainability matters for school software
4. Performance is important for timetable/chat syncing
5. You'll build more features (WebUntis integration, OCR, etc.)

---

**Document Complete**

Questions? See SETUP.md for detailed configuration.
