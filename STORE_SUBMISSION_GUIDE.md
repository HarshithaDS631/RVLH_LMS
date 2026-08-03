# 📱 App Store Submission Guide — RV Learning Hub LMS

Detailed step-by-step instructions for publishing to Google Play Store and Apple App Store.

---

## 🤖 Google Play Store Submission

### Step 1: Google Play Console Setup
1. Go to [play.google.com/console](https://play.google.com/console)
2. Pay one-time $25 registration fee
3. Complete identity verification

### Step 2: Build Android App Bundle
```bash
cd web-app
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
In Android Studio:
- Open `android/` folder
- Go to **Build → Generate Signed Bundle / APK**
- Select **Android App Bundle (.aab)**
- Create or use keystore: `release-key.keystore` (alias: `rvlh-lms`)
- Build release AAB

### Step 3: Create App Listing
Fill in the following on Play Console:

| Field               | Value                                                |
|---------------------|------------------------------------------------------|
| App Name            | RV Learning Hub LMS                                  |
| Short Description   | Learn smarter with JEE, NEET & Commerce coaching     |
| Full Description    | RV Learning Hub LMS is a comprehensive education platform offering video lectures, live classes, AI-powered question banks, performance analytics, fee management, and peer-to-peer doubt resolution for JEE, NEET, and Commerce students. |
| Category            | Education                                            |
| Email               | support@rvlearninghub.com                            |
| Privacy Policy URL  | https://your-domain.com/privacy-policy.html          |
| Website             | https://your-domain.com                              |

### Step 4: Content Rating
- Complete the content rating questionnaire
- Select: **Education** category
- No violence, no sexual content, no gambling
- Expected rating: **Everyone**

### Step 5: Data Safety
Declare the following based on Privacy Policy:
- **Data collected:** Name, email, phone, payment info, usage data
- **Data shared:** None sold to third parties
- **Security:** Data encrypted in transit (HTTPS)
- **Deletion:** Users can request data deletion

### Step 6: Upload & Release
1. Upload the `.aab` file in **Production** track
2. Add screenshots (phone + tablet)
3. Add feature graphic (1024x500)
4. Submit for review (~2–7 days)

---

## 🍎 Apple App Store Submission

### Step 1: Apple Developer Program
1. Go to [developer.apple.com](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Complete identity verification

### Step 2: Build iOS App
```bash
cd web-app
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```
In Xcode:
- Select target device or **Any iOS Device**
- Set **Bundle Identifier:** `com.rvlh.lms`
- Set **Team:** Your Apple Developer Team
- Go to **Product → Archive**
- Click **Distribute App → App Store Connect**

### Step 3: App Store Connect Listing
Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)

| Field               | Value                                                |
|---------------------|------------------------------------------------------|
| App Name            | RV Learning Hub LMS                                  |
| Subtitle            | JEE • NEET • Commerce Coaching                       |
| Category            | Education                                            |
| Age Rating          | 4+                                                   |
| Privacy Policy URL  | https://your-domain.com/privacy-policy.html          |
| Support URL         | https://your-domain.com/terms-of-service.html        |
| Description         | RV Learning Hub LMS is a comprehensive education platform offering video lectures, live classes, AI-powered question banks, performance analytics, fee management, and peer-to-peer doubt resolution for JEE, NEET, and Commerce students. |

### Step 4: Screenshots Required
Upload screenshots for these device sizes:
- **6.7" iPhone** (1290 × 2796) — iPhone 15 Pro Max
- **6.5" iPhone** (1284 × 2778) — iPhone 14 Plus
- **5.5" iPhone** (1242 × 2208) — iPhone 8 Plus
- **12.9" iPad Pro** (2048 × 2732)

### Step 5: App Privacy
On App Store Connect → App Privacy:
- **Data Used to Track You:** None
- **Data Linked to You:** Name, Email, Phone, Payment Info
- **Data Not Linked to You:** Usage Data, Diagnostics

### Step 6: Submit for Review
1. Ensure all metadata is filled
2. Provide demo credentials for reviewer:
   - **Email:** arjun@rvhub.com
   - **Password:** student123
3. Add review notes: "Educational LMS for coaching institute management"
4. Submit (~1–3 days review)

---

## ⚠️ Common Rejection Reasons & How to Avoid

| Rejection Reason                      | Solution Already Implemented          |
|---------------------------------------|---------------------------------------|
| Missing Privacy Policy                | ✅ `/privacy-policy.html` created     |
| Missing Terms of Service              | ✅ `/terms-of-service.html` created   |
| App crashes on launch                 | ✅ SplashScreen configured            |
| No login for reviewer                 | ✅ Demo credentials provided above    |
| Missing app icons                     | ✅ Icons in `public/` folder          |
| Insecure HTTP connections             | ✅ HTTPS enforced in Capacitor config |
| No content rating                     | ✅ Education category (Everyone/4+)   |
| Missing safe area support             | ✅ viewport-fit=cover + CSS insets    |
| Broken back button (Android)          | ✅ Capacitor handles native nav       |
