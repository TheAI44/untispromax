# START HERE - First Time Setup (15 minutes)

**New to this project?** Follow this guide to get the app running for the first time.

## Step 1: Install Tools (5 minutes)

You need these installed once:

```bash
# Check you have Node.js 16+
node --version

# Check you have npm
npm --version

# Install Expo CLI (global)
npm install -g expo-cli

# Done? Verify:
expo --version
```

**Missing something?**
- Download Node.js from https://nodejs.org/ (includes npm)
- Expo CLI auto-updates, so just run one of the commands above

---

## Step 2: Get Firebase Credentials (3 minutes)

1. Go to https://console.firebase.google.com/
2. Select project: `untispromax` (or create if doesn't exist)
3. Click "Project Settings" (gear icon)
4. Scroll to "Your apps" section
5. Find "Web" app or create one if missing
6. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - (Optional) `measurementId`

**Already have these?** Great, move to Step 3.

---

## Step 3: Configure Environment (2 minutes)

In the `mobile/` folder:

```bash
# Copy the example file
cp .env.example .env.local

# Edit it with your credentials (use any text editor)
# Open: .env.local
# Fill in the EXPO_PUBLIC_FIREBASE_* values you copied above
```

**Example** (fill with YOUR values):
```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDg8Ht...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=untispromax.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=untispromax
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=untispromax.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
EXPO_PUBLIC_API_URL=https://untispromax-server-1.onrender.com
```

---

## Step 4: Install Dependencies (3 minutes)

In the `untispromax/mobile/` folder:

```bash
npm install
```

**Takes 2-3 minutes.** You'll see lots of text — that's normal.

---

## Step 5: Start the App (1 minute)

Still in `mobile/` folder:

```bash
expo start
```

You should see output like:
```
Expo Go

QR code [will show a code]

Press w to open web
Press a to open Android Emulator
Press i to open iOS Simulator
```

---

## Step 6: Run on Your Device (1 minute)

Choose ONE option:

### **Option A: Physical Phone (Easiest)**
1. Download "Expo Go" app from App Store or Google Play
2. Open Expo Go on your phone
3. Scan the QR code shown in terminal
4. Wait 10-20 seconds for app to load

### **Option B: Android Emulator**
1. Open Android Studio
2. Start an Android Virtual Device (AVD)
3. In terminal, press `a`

### **Option C: iOS Simulator**
1. Mac only
2. In terminal, press `i`

---

## ✅ First Test

When the app opens, you should see:

1. **Logo** with "UntisProMax" ✅
2. **Splash screen** briefly (seconds)
3. **Login screen** with:
   - Email input
   - Password input
   - Link to "Sign up"

---

## 🎯 Test Authentication

1. **Click "Sign up"**
2. **Fill in**:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!`
3. **Press "Sign up"**
4. Should see **Home screen** with greeting ✅

**If you see an error:**
- Check `.env.local` has all credentials
- Check Firebase Console → Authentication → Enable "Email/Password"
- Restart app: `expo start`

---

## 📚 What's Next?

The app is now **running and authenticated**. To continue development:

1. **Understand the structure**: Read [FILE_INDEX.md](FILE_INDEX.md) (reference guide)
2. **See the architecture**: Read [../MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md) (design decisions)
3. **Get quick answers**: Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) (bookmark this!)
4. **Complete setup**: Read [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) (optional deep dive)

## 🆘 Troubleshooting

### "Environment variables not found"
- Verify `.env.local` exists in `mobile/` folder (not parent)
- Restart: `expo start -c` (clears cache)

### "Firebase auth disabled"
- Go to Firebase Console
- Authentication → Sign-in method
- Enable "Email/Password"
- Restart app

### "Module not found"
- Run: `npm install`
- Clear cache: `expo start -c`
- Restart terminal

### "App crashes immediately"
- Check terminal for error message
- Run: `expo logs` to see device logs
- Verify all Firebase credentials in `.env.local`

### "Stuck on splash screen 5+ seconds"
- Check internet connection
- Verify Firebase project is accessible
- Try: `expo start -c`

---

## 🎉 Success!

**You now have:**
✅ Development environment setup
✅ App running locally
✅ Authentication working
✅ Real Firestore data syncing
✅ Foundation for adding features

---

## 📝 Quick Commands Reference

```bash
# Start development
expo start

# Clear cache (if stuck)
expo start -c

# Install dependencies
npm install

# Check for errors
npm run type-check

# View device logs
expo logs

# Stop server
Ctrl+C
```

---

## 🔗 Important Files

These are the main files you'll work with:

- **Screens**: `src/screens/*/` - UI pages
- **Data**: `src/context/DataContext.tsx` - Firestore sync
- **Auth**: `src/context/AuthContext.tsx` - Login system
- **Navigation**: `src/navigation/AppNavigator.tsx` - Tabs setup
- **Utils**: `src/utils/` - Helpers and theme

---

## 💡 Pro Tips

1. **Keep terminal open** while developing (shows errors in real-time)
2. **Save file** → Changes auto-load in app (no restart needed!)
3. **Use `console.log`** in your code to debug
4. **Press `r`** in terminal to reload app
5. **Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)** for common patterns

---

## 📞 Need Help?

- **Setup problem?** → Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- **How does this file work?** → Check [FILE_INDEX.md](FILE_INDEX.md)
- **Forgot a command?** → Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Architecture question?** → Read [../MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md)
- **General question?** → Read [README.md](README.md)

---

**Congratulations! You're ready to develop. 🚀**

Next: Pick a task from Phase 2 in [../MOBILE_STRATEGY.md](../MOBILE_STRATEGY.md) to implement.

---

**Time taken**: 15 minutes
**Status**: Ready to code ✅
