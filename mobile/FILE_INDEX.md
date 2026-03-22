# Mobile App Project File Index

Complete reference of all files created for the UntisProMax React Native mobile app.

## 📖 Documentation Files

### [MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md)
**Location**: `untispromax/MOBILE_STRATEGY.md`
**Size**: 500+ lines
**Purpose**: Comprehensive architecture guide and implementation roadmap
**Key Sections**:
- Technology comparison analysis
- Folder structure design
- Code reuse strategy (65-70%)
- 5-phase implementation plan (6 weeks)
- Firebase security rules
- Push notification architecture
- Offline-first caching strategy
- Success criteria

**When to Read**: Before starting development, for understanding overall architecture

---

### README.md
**Location**: `mobile/README.md`
**Size**: 300+ lines
**Purpose**: Quick start guide and feature overview
**Includes**:
- Feature list
- Tech stack overview
- Installation instructions
- Project structure walkthrough
- Authentication flow explanation
- Real-time sync documentation
- Deployment guide references
- Troubleshooting section

**When to Read**: Getting started, troubleshooting issues

---

### SETUP_CHECKLIST.md
**Location**: `mobile/SETUP_CHECKLIST.md`
**Size**: 200+ lines
**Purpose**: Step-by-step setup verification for new developers
**Covers**:
- Prerequisites verification
- Project setup steps
- Firebase configuration
- Development server setup
- Device/emulator testing
- Authentication testing
- Data creation (optional)
- Troubleshooting guide

**When to Use**: First-time setup, team onboarding

---

## 🔧 Configuration Files

### app.json
**Location**: `mobile/app.json`
**Type**: Expo configuration
**Purpose**: Define app metadata, permissions, and build settings
**Contains**:
- App name, version, slug
- iOS bundle ID and permissions
- Android package and permissions
- Notification plugin configuration
- OTA update settings
- Asset references (icon, splash)

**When to Modify**: Changing app name, adding permissions, configuring notifications

---

### package.json
**Location**: `mobile/package.json`
**Type**: NPM dependencies declaration
**Purpose**: Define project dependencies and scripts
**Contains**:
- Core dependencies (React, React Native, Expo)
- Navigation libraries (@react-navigation/native, bottom-tabs, stack)
- Firebase SDK (firebase)
- Storage (AsyncStorage)
- Notifications (expo-notifications)
- File handling (expo-document-picker, expo-image-picker)
- Testing setup (Jest, React Testing Library)

**Scripts Available**:
- `npm install` - Install all dependencies
- `expo start` - Start development server

---

### tsconfig.json
**Location**: `mobile/tsconfig.json`
**Type**: TypeScript configuration
**Purpose**: Configure TypeScript compiler for React Native
**Settings**:
- ES2020 target
- React JSX transformer
- Module resolution for Expo
- Strict type checking

---

### .env.example
**Location**: `mobile/.env.example`
**Type**: Environment variables template
**Purpose**: Document required Firebase credentials
**Variables**:
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID
- EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
- EXPO_PUBLIC_API_URL (Render backend)
- EXPO_PUBLIC_APP_ENV

**How to Use**: 
```bash
cp .env.example .env.local
# Fill in your Firebase credentials
```

---

### .gitignore
**Location**: `mobile/.gitignore`
**Type**: Git ignore configuration
**Purpose**: Prevent committing sensitive files
**Ignores**:
- Environment variables (.env files)
- Dependencies (node_modules/)
- Expo cache (.expo/)
- Build artifacts
- Platform-specific folders (android/, ios/)
- IDE settings (.vscode/, .idea/)

---

## 💻 Source Code Files

### App.tsx
**Location**: `mobile/src/App.tsx`
**Type**: Root component
**Purpose**: Initialize app with providers and routing logic
**Structure**:
```
SafeAreaProvider
  └─ AuthProvider
    └─ DataProvider
      └─ NavigationContainer
        ├─ Auth Screens (LoginScreen, SignupScreen, SplashScreen)
        └─ MainApp (AppNavigator with 6 tabs)
```
**Key Features**:
- Auth state checking for routing
- Loading/splash screen during initialization
- Provider hierarchy setup

---

## 🔐 Authentication

### src/context/AuthContext.tsx
**Location**: `mobile/src/context/AuthContext.tsx`
**Size**: 250+ lines
**Type**: React Context
**Purpose**: Manage authentication state and Firebase Auth integration
**Exports**:
- `AuthProvider` component
- `useAuth()` hook

**Features**:
- Login with email/password
- Signup with name/email/password
- Logout functionality
- Session persistence (AsyncStorage + Firebase)
- User profile Firestore sync
- Auto-refresh token handling
- Error handling for auth state changes

**State Properties**:
- `user: User | null` - Current logged-in user
- `loading: boolean` - Auth state checking in progress

**Methods**:
- `login(email, password): Promise<void>`
- `signup(email, password, displayName): Promise<void>`
- `logout(): Promise<void>`
- `updateProfile(updates): Promise<void>`

**Usage Example**:
```typescript
const { user, login, logout, loading } = useAuth();
```

---

## 📊 Data Management

### src/context/DataContext.tsx
**Location**: `mobile/src/context/DataContext.tsx`
**Size**: 350+ lines
**Type**: React Context
**Purpose**: Manage Firestore data and real-time listeners
**Exports**:
- `DataProvider` component
- `useData()` hook

**Features**:
- Real-time Firestore listeners for homework, events, chats
- CRUD operations for all collections
- Loading states for each collection
- TypeScript interfaces for all data types
- Automatic sync on app startup

**Collections Managed**:
1. **Homework**
   - Methods: `addHomework()`, `updateHomework()`, `deleteHomework()`, `toggleHomeworkDone()`
   - Data: subject, description, dueDate, completed, attachments

2. **Events**
   - Methods: `addEvent()`, `updateEvent()`, `deleteEvent()`
   - Data: title, description, startDate, endDate, color

3. **Chats**
   - Methods: `sendMessage()`, `createChat()`
   - Data: participants, messages, lastMessage

**State Properties**:
- `homework: Homework[]` - All homework assignments
- `events: Event[]` - All calendar events
- `chats: Chat[]` - All chat threads
- `loadingHomework/Events/Chats: boolean` - Loading states

**Usage Example**:
```typescript
const { homework, addHomework, deleteHomework } = useData();
```

---

## 🗄️ Firebase Configuration

### src/services/firebase/config.ts
**Location**: `mobile/src/services/firebase/config.ts`
**Size**: 35 lines
**Type**: Configuration module
**Purpose**: Initialize Firebase SDK with credentials
**Exports**:
- `app` - Firebase app instance
- `auth` - Firebase Auth instance
- `db` - Firestore database instance

**Features**:
- Environment variable-based configuration
- Platform-specific offline persistence (web-only IndexedDB)
- Clean separation of configuration from usage

**Usage Example**:
```typescript
import { auth, db } from '../services/firebase/config';
```

---

## 🗂️ Type Definitions

### src/types/index.ts
**Location**: `mobile/src/types/index.ts`
**Size**: 150+ lines
**Type**: TypeScript type definitions
**Purpose**: Centralized type declarations for all data models
**Exports**:
- `User` interface
- `Homework` interface
- `Event` interface
- `ChatMessage` interface
- `Chat` interface
- `Timetable` interface
- `Lesson` interface
- `AuthContextType` interface
- `DataContextType` interface

**Why Centralized**: Ensures type consistency across app, makes refactoring easier

---

## 🎨 Utilities

### src/utils/theme.ts
**Location**: `mobile/src/utils/theme.ts`
**Size**: 60 lines
**Type**: Constants/configuration
**Purpose**: Centralize color scheme and design tokens
**Exports**:
- `theme` object with:
  - `colors` - All app colors (primary, secondary, status, etc.)
  - `spacing` - Standard spacing values (xs to xxl)
  - `typography` - Font sizes and weights
  - `radius` - Border radius values

**Usage Example**:
```typescript
import { theme } from '../utils/theme';

const styles = {
  container: {
    backgroundColor: theme.colors.bgPrimary,
    padding: theme.spacing.lg,
  }
};
```

---

### src/utils/helpers.ts
**Location**: `mobile/src/utils/helpers.ts`
**Size**: 200+ lines
**Type**: Utility functions
**Purpose**: Common formatting, validation, and data manipulation helpers
**Exports**:
- **Date Formatting**:
  - `formatDate(date): string` - DD.MM.YYYY format
  - `formatDateTime(date): string` - DD.MM.YYYY, HH:MM format
  - `formatTime(date): string` - HH:MM format
  - `formatRelativeTime(date): string` - "2 days ago" format
  - `getDayName(date): string` - "Montag", "Dienstag", etc.
  - `getMonthName(date): string` - Month names in German

- **Date Checking**:
  - `isToday(date): boolean`
  - `isTomorrow(date): boolean`

- **Text Utilities**:
  - `capitalize(str): string`
  - `truncate(str, maxLength): string`
  - `isValidEmail(email): boolean`

- **Array Operations**:
  - `sortByDate(items, ascending): T[]`
  - `groupByDate(items): Array<[string, T[]]>`

**Usage Example**:
```typescript
import { formatDate, isToday, truncate } from '../utils/helpers';
```

---

## 🧭 Navigation

### src/navigation/AppNavigator.tsx
**Location**: `mobile/src/navigation/AppNavigator.tsx`
**Size**: 200+ lines
**Type**: Navigation configuration
**Purpose**: Define app navigation structure (6-tab bottom navigation)
**Navigation Structure**:
```
Bottom Tab Navigation
├─ Home Stack
│  └─ HomeScreen
├─ Timetable Stack
│  └─ TimetableScreen
├─ Homework Stack
│  └─ HomeworkScreen
├─ Calendar Stack
│  └─ CalendarScreen
├─ Recovery Stack (Krank)
│  └─ RecoveryScreen
└─ Settings Stack
   └─ SettingsScreen
```

**Features**:
- Bottom tab navigation with icons (Ionicons)
- Stack navigator for each tab (allow push/pop transitions)
- Dark theme styling matching web app
- Consistent header styling

**Key Properties**:
- `headerStyle` - Dark background to match app theme
- `headerTintColor` - Accent color for header text
- `tabBarActiveTintColor/InactiveTintColor` - Tab colors
- `tabBarStyle` - Dark tab bar background

---

## 📱 Screens

### SplashScreen.tsx
**Location**: `mobile/src/screens/SplashScreen.tsx`
**Size**: 30 lines
**Type**: Screen component
**Purpose**: Show loading screen during app initialization
**Shows**:
- App logo/branding
- Loading spinner
- Displayed while checking auth state

---

### Login & Authentication Screens

#### src/screens/auth/LoginScreen.tsx
**Location**: `mobile/src/screens/auth/LoginScreen.tsx`
**Size**: 160 lines
**Type**: Screen component (functional)
**Purpose**: User login form
**Features**:
- Email and password input fields
- Firebase authentication integration
- Error message display
- Loading state with spinner
- Input focus styling
- "Don't have an account?" link to signup
- Keyboard handling

**Uses**:
- `useAuth()` hook for login function
- `useState` for form state and errors
- `KeyboardAvoidingView` for mobile UX

---

#### src/screens/auth/SignupScreen.tsx
**Location**: `mobile/src/screens/auth/SignupScreen.tsx`
**Size**: 160 lines
**Type**: Screen component (functional)
**Purpose**: User registration form
**Features**:
- Name, email, password input fields
- Firebase signup integration
- Firestore user document creation
- Email duplicate detection
- Input validation
- Error handling
- Loading state

**Creates**:
- Auth user in Firebase Auth
- User document in Firestore `users` collection

---

### Home Screen

#### src/screens/home/HomeScreen.tsx
**Location**: `mobile/src/screens/home/HomeScreen.tsx`
**Size**: 210 lines
**Type**: Screen component (functional) ✅ **FULLY IMPLEMENTED**
**Purpose**: Application dashboard showing upcoming homework and events
**Features**:
- Displays upcoming homework sorted by date
- Shows upcoming events
- Real-time data sync from Firestore
- Loading state with activity spinner
- Empty state messaging
- Date formatting (German locale)
- Scrollable task cards
- Task details: subject, description, due date

**Uses**:
- `useData()` hook for homework and events
- `useAuth()` hook for current user
- `FlatList` for scrollable lists
- `ActivityIndicator` for loading state
- Date formatting utilities

**Data Structure**:
```typescript
{
  subject: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}
```

---

### Timetable Screen

#### src/screens/timetable/TimetableScreen.tsx
**Location**: `mobile/src/screens/timetable/TimetableScreen.tsx`
**Size**: 13 lines
**Type**: Screen component (stub) 🔄 **PLACEHOLDER**
**Status**: Coming soon
**Purpose**: Display weekly WebUntis schedule
**Planned Features** (Phase 2-3):
- Current week lessons
- Subject, teacher, room, time
- Doppelstunde handling (blue connector line like web)
- Call Render backend timetable endpoint
- Cache with 1-week expiry
- Tap to view room location

---

### Homework Screen

#### src/screens/homework/HomeworkScreen.tsx
**Location**: `mobile/src/screens/homework/HomeworkScreen.tsx`
**Size**: 13 lines
**Type**: Screen component (stub) 🔄 **PLACEHOLDER**
**Status**: Coming soon
**Purpose**: Homework list, creation, and management
**Planned Features** (Phase 2-3):
- List of all homework assignments
- Filter by subject, date, completion status
- Add homework form with date picker
- File upload functionality
- Edit and delete homework
- Mark as done/undone
- Link to attached files

---

### Calendar Screen

#### src/screens/calendar/CalendarScreen.tsx
**Location**: `mobile/src/screens/calendar/CalendarScreen.tsx`
**Size**: 13 lines
**Type**: Screen component (stub) 🔄 **PLACEHOLDER**
**Status**: Coming soon (JUST CREATED)
**Purpose**: Event management and calendar view
**Planned Features** (Phase 2-3):
- Month view calendar
- Event indicators on dates
- Create event modal
- Edit and delete events
- Color-coded events
- Event filtering

---

### Recovery Screen (Krank)

#### src/screens/recovery/RecoveryScreen.tsx
**Location**: `mobile/src/screens/recovery/RecoveryScreen.tsx`
**Size**: 13 lines
**Type**: Screen component (stub) 🔄 **PLACEHOLDER**
**Status**: Stub created, functionality pending
**Purpose**: Manage sick day absence and view alternate schedule
**Planned Features** (Phase 2-3):
- Mark days as absent/sick
- Display affected lessons
- Alternative homework assignments
- Note for teachers
- Recovery plan management

---

### Settings Screen

#### src/screens/settings/SettingsScreen.tsx
**Location**: `mobile/src/screens/settings/SettingsScreen.tsx`
**Size**: 60 lines
**Type**: Screen component (functional)
**Purpose**: User preferences and account management
**Features**:
- Display user profile (name, email)
- Dark mode toggle (with Switch component)
- Logout button
- Profile section
- Appearance settings section
- Styled with app theme colors

**Planned Features** (Phase 3+):
- Edit profile information
- Change password
- Notification preferences
- Language selection
- Admin controls (if user.isAdmin)
- Data export
- Account deletion

---

## 📋 Development Workflow

### File Organization Principles

1. **Screens** are in `src/screens/{feature}/{FeatureScreen}.tsx`
   - Each feature (auth, home, etc.) gets its own subfolder
   - Screen names follow PascalCase + "Screen" suffix

2. **Contexts** manage global state in `src/context/{ContextName}.tsx`
   - One context per major feature (Auth, Data)
   - Export both Provider component and custom hook

3. **Configuration** in `src/services/` for external services
   - Firebase config separate from contexts
   - Each service gets its own folder

4. **Utilities** in `src/utils/` for shared functions
   - `theme.ts` for design tokens
   - `helpers.ts` for functions
   - Group related utilities

5. **Types** centralized in `src/types/index.ts`
   - All TypeScript interfaces in one place
   - Import from `../types` throughout app

---

## 🔄 Data Flow

```
User Action (e.g., add homework)
    ↓
Screen component (e.g., HomeworkScreen)
    ↓
useData() hook (e.g., dataContext.addHomework())
    ↓
DataContext function calls Firebase
    ↓
Data written to Firestore
    ↓
onSnapshot listener detects change
    ↓
State updated in DataContext
    ↓
All screens using useData() re-render
    ↓
UI displays new data
```

---

## 📈 Lines of Code Summary

| Component | LOC | Status |
|-----------|-----|--------|
| App.tsx | 50 | ✅ Complete |
| AppNavigator.tsx | 200 | ✅ Complete |
| AuthContext.tsx | 250+ | ✅ Complete |
| DataContext.tsx | 350+ | ✅ Complete |
| HomeScreen.tsx | 210 | ✅ Complete |
| LoginScreen.tsx | 160 | ✅ Complete |
| SignupScreen.tsx | 160 | ✅ Complete |
| SettingsScreen.tsx | 60 | ✅ Complete |
| Stub Screens (×5) | 65 | 🔄 Placeholder |
| Utilities | 260 | ✅ Complete |
| Config Files | 100 | ✅ Complete |
| **TOTAL** | **1,865+** | **Phase 1 ✅** |

---

## 🚀 Next Phase Files to Create

### Phase 2-3 (Weeks 2-4)

1. **Business Logic Services**
   - `src/services/api/timetable.ts` - Render server calls
   - `src/services/storage/file-upload.ts` - Firebase Storage
   - `src/services/mensaplan/scraper.ts` - OCR/web scraping

2. **Custom Hooks**
   - `src/hooks/useOfflineSync.ts` - Queue management
   - `src/hooks/usePushNotifications.ts` - FCM setup
   - `src/hooks/useImageCache.ts` - Image optimization

3. **Components**
   - `src/components/TaskCard.tsx` - Homework/event card
   - `src/components/LessonCard.tsx` - Timetable lesson
   - `src/components/Modal.tsx` - Reusable modal

4. **Full Screen Implementations**
   - Implement all 5 placeholder screens
   - Add CRUD UI for homework/events
   - File upload interfaces

### Phase 4-5 (Weeks 4-6)

1. **Offline sync queue**
2. **Push notification system**
3. **Image caching & optimization**
4. **EAS build configuration**
5. **App store submission files**

---

## 📚 Documentation Cross-References

- Architecture: See [MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md)
- Setup Instructions: See [README.md](README.md) and [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- Firebase Rules: See [MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md) Phase 1 section
- Implementation Roadmap: See [MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md) Phase overview

---

## ✅ Phase 1 Complete

All files listed above have been created and are ready for development.

**Next**: Run `npm install` and `expo start` to begin development.

**Status**: ✅ Phase 1 (Setup & Authentication) COMPLETE
