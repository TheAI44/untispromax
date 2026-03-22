# 📱 Complete App Store Publishing Guide

**Timeline**: 2-4 weeks (depending on approval times)
**Cost**: ~$125 total ($99 Apple + $25 Google, one-time)
**Effort**: 40-60 hours (can be spread out)

---

## 🎯 High-Level Overview

```
Your Code ──→ EAS Build ──→ iOS/Android Builds ──→ App Stores ──→ Live!
```

**Key Accounts Needed**:
1. **Expo/EAS** (free) - Builds your app
2. **Apple Developer** ($99/year) - iOS app store
3. **Google Play** ($25 one-time) - Android app store
4. **Firebase** (free tier OK) - Backend

---

## ⏱️ Timeline Breakdown

```
Week 1: Setup & Design (10 hours)
  └─ Create developer accounts
  └─ Design app icons & screenshots
  └─ Review store requirements

Week 2: Build & Test (15 hours)
  └─ Configure EAS
  └─ Create builds
  └─ Test on real devices

Week 3: Store Submission (10 hours)
  └─ Create store listings
  └─ Write descriptions
  └─ Submit for review

Week 4: Wait & Launch (varies)
  └─ Apple review (1-3 days typically)
  └─ Google review (2 hours - few days)
  └─ Launch & celebrate! 🎉
```

---

## 📋 Complete Step-by-Step Process

### PHASE 1: Foundation (Do These First)

#### Step 1a: Get Firebase Credentials (15 min)

1. Go to https://console.firebase.google.com/
2. Create or select project **untispromax**
3. Click ⚙️ "Project Settings"
4. Get your credentials:
   ```
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   - Measurement ID (optional)
   ```
5. You'll need these for `.env.local` file

#### Step 1b: Create Firebase Collections (5 min)

Firestore needs these empty collections:
- `users`
- `homework`
- `events`
- `chats`

(Do this in Firebase Console → Firestore Database)

#### Step 1c: Enable Firebase Auth (2 min)

In Firebase Console:
- Authentication → Sign-in method
- Enable "Email/Password"

✅ **Once done**: You can run the app locally!

---

### PHASE 2: Get Developer Accounts

#### Step 2a: Create Expo/EAS Account (5 min)

1. Go to https://expo.dev/
2. Click "Sign up"
3. Create account with email
4. Verify email
5. Create organization (or skip)

**Cost**: Free

**Why**: Builds your iOS/Android apps without needing Mac + Xcode

---

#### Step 2b: Get Apple Developer Account (30 min + $99)

**Who needs it**: Anyone publishing iOS app

**Steps**:
1. Go to https://developer.apple.com/
2. Click "Sign up" → Join Apple Developer Program
3. Pay $99/year
4. Create Apple ID (if you don't have one)
5. Verify payment
6. Accept agreements

**Wait time**: Usually instant, sometimes 24 hours

**Cost**: $99/year

**What you get**:
- Certificate signing
- App ID creation
- Provisioning profiles
- Ability to submit to App Store

---

#### Step 2c: Get Google Play Developer Account (30 min + $25)

**Who needs it**: Anyone publishing Android app

**Steps**:
1. Go to https://play.google.com/console
2. Sign in with Google account (create if needed)
3. Accept terms
4. Pay $25 one-time
5. Verify payment

**Wait time**: Often instant

**Cost**: $25 (one-time, not annual)

**What you get**:
- Ability to upload Android builds
- In-app billing support
- Analytics dashboard

---

### PHASE 3: Prepare Your App

#### Step 3a: Design App Icons (1-2 hours)

**What you need**:
- Square logo: 1024×1024 pixels (PNG)
- No transparency required for stores
- App name should fit around icon
- Clear, recognizable design

**Template**: https://www.figma.com/design-templates/

**Budget**: 
- DIY with Canva: Free
- Freelancer (Fiverr): $20-50
- Professional designer: $200+

**Where to put it**:
- Add to `mobile/assets/icon.png`
- EAS will resize automatically

#### Step 3b: Create Splash Screen (30 min - 1 hour)

**What you need**:
- 1242×2436 pixels (iPhone X size)
- App logo + branding
- Can be same as icon + text

**Where to put it**:
- Add to `mobile/assets/splash.png`
- EAS will resize for all devices

#### Step 3c: Prepare Store Screenshots (1-2 hours)

**What you need**:
- 3-5 screenshots per store
- Showcase main features
- One screenshot per tab (Home, Timetable, Homework, Calendar, Settings)
- Add captions explaining features

**Dimensions**:
- iPhone: 1170×2532 pixels
- Android: 1080×1920 pixels

**Tools**: Screenshot on real device + Photoshop / Figma

#### Step 3d: Write App Description (30 min)

**Apple App Store requires**:
- App Name (max 30 characters): "UntisProMax"
- Subtitle (max 30 characters): "School Schedule Made Easy"
- Description (max 4,000 characters):
  ```
  UntisProMax is a mobile app for students to manage their school schedule,
  track homework assignments, organize events, and stay on top of their tasks.
  
  Features:
  • View your WebUntis timetable
  • Track homework assignments
  • Manage calendar events
  • Plan your day
  • Dark mode for easy viewing
  • Works offline
  ```
- Keywords (max 100 characters): "school,schedule,homework,timetable,organizer"
- Support URL: https://untispromax.app/ (or your support page)
- Privacy Policy URL: (required - use privacy template)

**Google Play requires**:
- Similar info (shorter descriptions work better)
- Category: Education
- Content rating: Complete questionnaire
- Permissions explanations

---

### PHASE 4: Setup Environment & Test Locally

#### Step 4a: Configure .env.local (5 min)

Create `mobile/.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
EXPO_PUBLIC_API_URL=https://untispromax-server-1.onrender.com
EXPO_PUBLIC_APP_ENV=production
```

#### Step 4b: Install Dependencies (3 min)

```bash
cd mobile
npm install
```

#### Step 4c: Test Locally (15 min)

```bash
expo start
# Press: a (Android) or i (iOS)
```

**Verify**:
- ✅ Signup works
- ✅ Login works
- ✅ Data from Firestore appears
- ✅ Navigation works
- ✅ All 6 tabs accessible
- ✅ Logout works

---

### PHASE 5: Configure EAS Builds

#### Step 5a: Login to Expo (2 min)

```bash
expo login
# Enter your Expo email & password
```

#### Step 5b: Create Build Credentials (5 min)

```bash
cd mobile
eas build:configure
# Follow prompts - select iOS and Android
```

This asks:
- ✅ "Build for iOS?" → Yes
- ✅ "Build for Android?" → Yes
- ✅ "Apple Team ID?" → Get from Apple Developer account
- ✅ "Android Keystore?" → Create new

#### Step 5c: Create .eas.json Config (2 min)

Create `mobile/eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview3": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json"
      },
      "ios": {
        "appleId": "your-apple-id@icloud.com",
        "ascAppId": "your-app-store-connect-id"
      }
    }
  }
}
```

---

### PHASE 6: Build for Stores

#### Step 6a: Build iOS (20-30 min build time)

```bash
eas build --platform ios --auto-submit
```

**What happens**:
1. Compresses your code
2. Sends to EAS servers
3. Builds on Apple's infrastructure
4. Creates release .ipa file
5. Returns download link

**Cost**: Free (using your free EAS tier)

**Output**: `.ipa` file (~50-100 MB)

#### Step 6b: Build Android (20-30 min build time)

```bash
eas build --platform android --auto-submit
```

**What happens**: Same as iOS

**Output**: `.aab` file (~30-50 MB)

---

### PHASE 7: Submit to App Stores

#### Step 7a: Create iOS App Store Listing

1. Go to https://appstoreconnect.apple.com/
2. "Apps" → "New App"
3. Fill in:
   - **App Name**: UntisProMax
   - **Bundle ID**: com.untispromax.mobile
   - **Primary Language**: English
   - **Category**: Education

4. Upload icon (1024×1024)
5. Add 2-5 screenshots
6. Write description (from Step 3d)
7. Set category and rating
8. Click "Create"

#### Step 7b: Upload iOS Build

1. Go to your app in App Store Connect
2. "Distributing Your App"
3. Select your build
4. Fill metadata:
   - Version number (ex: 1.0.0)
   - Version description: "Initial release"
   - Build: Select your EAS build
5. Review all information
6. Click "Submit for Review"

**Review time**: 1-3 days typically

#### Step 7c: Create Google Play Listing

1. Go to https://play.google.com/console
2. "Create App"
3. Fill in:
   - **App name**: UntisProMax
   - **Default language**: English
   - **App category**: Education
   - **App type**: Apps

4. Go to "App Listing"
5. Upload:
   - Icon (512×512)
   - Feature graphic (1024×500)
   - Screenshots (3-5)
6. Add description from Step 3d

#### Step 7d: Upload Android Build

1. "Release" → "Production"
2. Upload `.aab` file from EAS
3. Fill in release notes: "Initial release"
4. Fill out "Content rating" forms
5. Check "Compliance & policy" section
6. Click "Review and roll out"

**Review time**: Usually 2 hours, up to few days

---

### PHASE 8: Monitor & Launch

#### Step 8a: Apple Review (1-3 days)

**Check status**:
1. App Store Connect → Your App
2. "App Availability"
3. Shows: "Pending Apple Review" → "Ready for Sale"

**If rejected**:
1. Review rejection reason
2. Fix issue
3. Submit new build (go back to Step 6a)

#### Step 8b: Google Review (2 hours - few days)

**Check status**:
1. Play Console → Your App
2. "Releases" → "Production"
3. Shows green checkmark when approved

**If rejected**:
1. Review rejection reason
2. Fix issue
3. Upload new build (go back to Step 6b)

#### Step 8c: Launch! 🎉

Once approved on both stores:
- App appears in App Store
- App appears in Google Play
- Users can download!
- Share links:
  - iOS: https://apps.apple.com/app/untispromax/id_YOUR_APP_ID
  - Android: https://play.google.com/store/apps/details?id=com.untispromax.mobile

---

## 🚨 Common Issues & Fixes

### Issue: "Build failed"
**Solution**: 
1. Check `.env.local` has all values
2. Check app.json is valid JSON
3. Run: `eas build --platform android --auto-submit --verbose`

### Issue: "Apple rejected for privacy"
**Solution**: 
1. Add privacy policy
2. Explain data collection in Settings
3. Update app.json with privacy URL

### Issue: "Build takes too long"
**Solution**: Normal - can be 20-40 min per platform

### Issue: "Version number rejected"
**Solution**: Increment version in app.json (1.0.0 → 1.0.1)

### Issue: "Icon dimensions wrong"
**Solution**: Use exactly 1024×1024 PNG for iOS

---

## 💰 Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer | $99 | Yearly |
| Google Play | $25 | One-time |
| Domain (optional) | $12 | Yearly |
| Privacy Policy (free) | $0 | N/A |
| App icons (DIY) | $0 | N/A |
| **TOTAL** | **$124** | **Per year** |

---

## 📚 Resources

- **Expo/EAS Docs**: https://docs.expo.dev/eas/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Google Play Console**: https://play.google.com/console/
- **Firebase**: https://firebase.google.com/
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policy**: https://play.google.com/about/privacy-security-deception/

---

## ✅ Pre-Submit Checklist

Before submitting to stores:

- [ ] App name: UntisProMax
- [ ] Bundle ID: com.untispromax.mobile (iOS)
- [ ] Package name: com.untispromax.mobile (Android)
- [ ] Version: 1.0.0
- [ ] Icon: 1024×1024 PNG
- [ ] Splash: 1242×2436 PNG
- [ ] Screenshots: 3-5 per store
- [ ] Description: 4,000 characters max
- [ ] Privacy policy: Written
- [ ] All permissions: Explained
- [ ] Firebase: All 6 credentials filled
- [ ] .env.local: All values correct
- [ ] App tested on: Real iOS + Android device
- [ ] Logout: Works
- [ ] Login: Works
- [ ] Data: Loads from Firestore
- [ ] Icons: All visible
- [ ] Text: No typos

---

## 🎬 Next Steps

1. **Start Phase 1**: Get Firebase credentials (15 min) ← DO THIS NOW
2. **From here you can**: Run the app locally while gathering accounts
3. **Meanwhile**: Create developer accounts (days 1-2)
4. **Then**: Design assets (days 3-4)
5. **Then**: Build & submit (days 5-7)

---

**Ready to start?** 

👉 Next: Run the app locally first (follow initial setup steps below)

---

# 🚀 Immediate Next Steps

To get started **right now**:

## Step 1: Configure Firebase (15 min)

You need Firebase credentials. Go to:
1. https://console.firebase.google.com/
2. Create new project or select existing
3. Get credentials from Project Settings
4. Create empty Firestore collections: users, homework, events, chats
5. Enable Email/Password auth

## Step 2: Setup App (5 min)

```bash
cd d:\Khaled\untispromax\mobile

# Create .env.local with your Firebase credentials
# (I can help you with this - just say the credentials)

# Install dependencies
npm install
```

## Step 3: Run Locally (1 min)

```bash
expo start
```

Then test on phone/emulator.

---

**Which step would you like help with first?**
