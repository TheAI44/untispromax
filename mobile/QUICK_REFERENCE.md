# Quick Reference Card

A quick lookup guide for common tasks in UntisProMax mobile development.

## 🚀 Start Development (Every session)

```bash
cd untispromax/mobile
npm install                  # First time only
expo start                   # Every session
# Press: a (Android), i (iOS), or w (web)
```

## 📱 Project Structure

```
mobile/src/
├── App.tsx                  # Root (providers + routing)
├── context/                 # Global state (Auth, Data)
├── screens/                 # UI screens
├── navigation/              # Navigation config
├── services/firebase/       # Firebase setup
├── types/                   # TypeScript definitions
└── utils/                   # Helpers + theme
```

## 🔐 Common Patterns

### Use User Data
```typescript
import { useAuth } from '../context/AuthContext';
const { user, login, logout } = useAuth();
```

### Use Firestore Data
```typescript
import { useData } from '../context/DataContext';
const { homework, addHomework, deleteHomework } = useData();
```

### Use Theme Colors
```typescript
import { theme } from '../utils/theme';
const styles = {
  bg: theme.colors.bgPrimary,
  accent: theme.colors.primary,
};
```

### Use Utilities
```typescript
import { formatDate, isToday, sortByDate } from '../utils/helpers';
formatDate(new Date())          // "15.03.2024"
isToday(homework.dueDate)       // true/false
sortByDate(homework)            // sorted array
```

## 📁 Add New Screen

1. Create file: `src/screens/feature/FeatureScreen.tsx`
2. Wrap with SafeAreaView
3. Import and use `useAuth()` / `useData()` hooks
4. Add to navigation in `src/navigation/AppNavigator.tsx`

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';

export default function FeatureScreen() {
  const { homework } = useData();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* UI here */}
    </SafeAreaView>
  );
}
```

## 🗄️ Work with Firestore Data

### Create
```typescript
const { addHomework } = useData();
await addHomework({
  userId: user.uid,
  subject: 'Mathematik',
  description: 'Aufgaben Seite 42',
  dueDate: new Date('2024-04-15'),
  completed: false,
});
```

### Read
```typescript
const { homework } = useData();
homework.map(hw => <Text key={hw.id}>{hw.subject}</Text>)
```

### Update
```typescript
const { updateHomework } = useData();
await updateHomework(homeworkId, { completed: true });
```

### Delete
```typescript
const { deleteHomework } = useData();
await deleteHomework(homeworkId);
```

## 🎨 Common UI Components

### Loading Indicator
```typescript
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../utils/theme';

<ActivityIndicator size="large" color={theme.colors.primary} />
```

### Touchable Button
```typescript
import { TouchableOpacity, Text } from 'react-native';

<TouchableOpacity onPress={handlePress}>
  <Text>Press Me</Text>
</TouchableOpacity>
```

### Safe Area Wrapper
```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  {/* Content */}
</SafeAreaView>
```

### Scrollable List
```typescript
import { ScrollView, FlatList } from 'react-native';

// Use FlatList for large lists
<FlatList
  data={homework}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <Text>{item.subject}</Text>}
/>

// Use ScrollView for small lists
<ScrollView>
  {homework.map(item => (
    <Text key={item.id}>{item.subject}</Text>
  ))}
</ScrollView>
```

## 🔍 Debug Common Issues

| Problem | Solution |
|---------|----------|
| "Module not found" | Check import paths (use `../` correctly) |
| Firebase data not loading | Verify `.env.local` has credentials |
| App crashes on login | Check Firebase project allows email auth |
| Styles not applying | Check theme colors exist in `utils/theme.ts` |
| TypeScript errors | Run type check: errors will show exact issue |
| Real-time updates not working | Verify Firestore listener in DataContext |

## 📚 File References

- Types: `src/types/index.ts`
- Theme: `src/utils/theme.ts`
- Helpers: `src/utils/helpers.ts`
- Auth Logic: `src/context/AuthContext.tsx`
- Data Logic: `src/context/DataContext.tsx`
- Navigation: `src/navigation/AppNavigator.tsx`

## 🆘 Quick Fixes

```bash
# Clear everything and restart
expo start -c

# Reinstall dependencies
rm -rf node_modules && npm install

# Check for errors
npm run type-check

# View logs
expo logs
```

## 📋 Common Typing

```typescript
// Import types
import type { Homework, Event, User } from '../types';

// Type component props
interface FeatureScreenProps {
  navigation: any;
}

// Type state
const [homework, setHomework] = useState<Homework[]>([]);
```

## 🎯 Development Workflow

1. **Design UI first** → Create screen stub
2. **Add data hooks** → Wire up `useAuth()` and `useData()`
3. **Build forms** → Add inputs/buttons
4. **Connect Firebase** → Call CRUD functions
5. **Style** → Apply theme colors and spacing
6. **Test** → Run on emulator
7. **Optimize** → Use FlatList for lists, memoize expensive renders

## ⚡ Performance Tips

- Use `FlatList` instead of `ScrollView` for 50+ items
- Memoize expensive components: `memo(Component)`
- Lazy load images: don't load all at once
- Debounce search inputs (0.3s delay)
- Use `useCallback` for event handlers in lists

## 🔗 External Links

- Expo Docs: https://docs.expo.dev/
- Firebase Console: https://console.firebase.google.com/
- React Native Docs: https://reactnative.dev/
- Icons Available: https://icons.expo.fyi/

---

**Bookmark This!** Keep for quick reference during development.

Last Updated: 2024
