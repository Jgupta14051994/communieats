# CommuniEats — Complete App Store Submission Guide

## What You Need Before Starting
- [ ] **Apple Developer Account** — $99/year at [developer.apple.com](https://developer.apple.com)
- [ ] **Mac** with macOS 13+ (Ventura or later)
- [ ] **Xcode 15+** — free from the Mac App Store
- [ ] **Node.js 20** — install via `nvm install 20`
- [ ] **CocoaPods** — `sudo gem install cocoapods`
- [ ] **Fastlane** (optional but recommended) — `sudo gem install fastlane`

---

## Step 1 — Register Your App ID

1. Go to [developer.apple.com → Identifiers](https://developer.apple.com/account/resources/identifiers/list)
2. Click **+** → **App IDs** → **App**
3. Set:
   - Description: `CommuniEats`
   - Bundle ID: `com.communieats.app` (explicit)
4. Enable capabilities:
   - **Push Notifications**
   - **Sign in with Apple** (optional but recommended)
   - **Associated Domains**
5. Click **Register**

---

## Step 2 — Create the App in App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click **+** → **New App**
3. Fill in:
   - Platforms: **iOS**
   - Name: `CommuniEats`
   - Primary Language: **English (U.S.)**
   - Bundle ID: `com.communieats.app`
   - SKU: `communieats-001`
4. Click **Create**

---

## Step 3 — Build the iOS App

Clone the repo and run the automated build script:

```bash
git clone https://github.com/Jgupta14051994/communieats.git
cd communieats
npm install
./ios-build.sh open
```

This script will:
- Build the Next.js app
- Add the iOS Capacitor platform (if not already added)
- Sync all web assets into the native project
- Copy PrivacyInfo.xcprivacy, entitlements, and Info.plist additions
- Run `pod install`
- Open the project in Xcode

---

## Step 4 — Configure Signing in Xcode

1. In Xcode, click **App** in the project navigator (top left)
2. Select the **App** target → **Signing & Capabilities** tab
3. Set:
   - **Team**: Select your Apple Developer team
   - **Bundle Identifier**: `com.communieats.app`
   - **Automatically manage signing**: ✓ Enabled
4. Xcode will generate and download your provisioning profile automatically

### Add Entitlements (if not auto-detected)
1. Still in **Signing & Capabilities**
2. Click **+ Capability** and add:
   - **Push Notifications**
   - **Associated Domains** → add `applinks:communieats-app.vercel.app`

---

## Step 5 — Set App Icons

The icons are pre-generated in `public/icons/`. To set them in Xcode:

1. Open `ios/App/App/Assets.xcassets`
2. Click **AppIcon**
3. Drag from `public/icons/` into the appropriate slots:

| Xcode slot | File |
|---|---|
| iPhone Notification 20pt @2x | icon-40.png (resize icon-96.png) |
| iPhone Notification 20pt @3x | icon-60.png (resize icon-96.png) |
| iPhone Settings 29pt @2x | icon-58.png |
| iPhone Settings 29pt @3x | icon-87.png |
| iPhone Spotlight 40pt @2x | icon-80.png |
| iPhone Spotlight 40pt @3x | icon-120.png |
| iPhone App 60pt @2x | icon-120.png |
| iPhone App 60pt @3x | icon-180.png |
| App Store 1024pt @1x | icon-1024.png ✓ |

**Tip**: Use [makeappicon.com](https://makeappicon.com) — upload `public/icons/icon-1024.png` and it generates all sizes automatically.

---

## Step 6 — Test on Simulator

1. In Xcode, select **iPhone 15 Pro** simulator from the device dropdown
2. Press **Cmd+R** to build and run
3. Test every flow:
   - [ ] Browse home page (restaurants load)
   - [ ] Search and filter (dietary filters work)
   - [ ] Tap a restaurant → menu tabs work
   - [ ] Add items to cart → cart badge updates
   - [ ] Community Courier mode → neighbor cards appear
   - [ ] Checkout with promo code (try `WELCOME10`)
   - [ ] Order tracking timeline progresses
   - [ ] Profile page → Stats + Settings tabs
   - [ ] Sign in / Sign out

---

## Step 7 — Test on Real Device

1. Connect iPhone via USB cable
2. On your iPhone: **Settings → Privacy & Security → Developer Mode** (enable if needed)
3. In Xcode, select your phone from the device dropdown
4. Press **Cmd+R**
5. If prompted on phone: **Settings → General → VPN & Device Management** → trust the certificate
6. Test all flows on the real device — pay attention to:
   - [ ] Safe area insets (no content hidden behind notch)
   - [ ] Haptic feedback when adding to cart
   - [ ] Location permission prompt appears
   - [ ] Push notification permission prompt appears
   - [ ] Splash screen shows and hides correctly

---

## Step 8 — Fill in App Store Listing

In App Store Connect → your app:

### App Information
- **Category**: Food & Drink
- **Secondary Category**: Lifestyle
- **Content Rights**: Does not contain third-party content

### Age Rating
Click **Edit** next to Age Rating and answer:
- Made for Kids: **No**
- All questions: **None / No**
- Result: **4+**

### Pricing
- **Price**: Free

### Availability
- All countries (or select specific)

---

## Step 9 — App Store Page Content

### Screenshots
Upload from `ios-config/screenshots/`:

**6.7" iPhone (required)** — use `iphone-67-*.png`:
1. `iphone-67-01-home.png` — Browse restaurants
2. `iphone-67-02-courier.png` — Community Courier mode
3. `iphone-67-03-tracking.png` — Live order tracking
4. `iphone-67-04-profile.png` — Community impact dashboard
5. `iphone-67-05-checkout.png` — Save up to 30%

**5.5" iPhone (required)** — use `iphone-55-*.png` (same screens)

### App Description
Copy from `ios-config/fastlane/metadata/en-US/description.txt`

### Keywords (100 chars max)
```
food delivery,community,courier,restaurant,order food,eco delivery,discount,neighbors,pickup
```

### Support URL
```
https://communieats-app.vercel.app/support
```

### Privacy Policy URL
```
https://communieats-app.vercel.app/privacy
```

### Marketing URL
```
https://communieats-app.vercel.app
```

---

## Step 10 — Archive and Upload

1. In Xcode: **Product → Destination → Any iOS Device (arm64)**
2. **Product → Archive** (Cmd+Shift+B then Cmd+B for clean build first)
3. Wait for archive (5–15 min)
4. **Xcode Organizer** opens automatically
5. Click **Distribute App**
6. Select: **App Store Connect** → **Upload**
7. Follow wizard — use automatic signing
8. Wait for upload to finish (~5 min)

---

## Step 11 — Submit for Review

In App Store Connect:

1. Go to your app → **TestFlight** tab
2. Wait for build to finish processing (~30 min, you'll get an email)
3. Test on TestFlight with your own device
4. Then go to **App Store** tab → click your version
5. Under **Build**, click **+** and select the build
6. Fill in:
   - **What's New**: copy from `ios-config/fastlane/metadata/en-US/release_notes.txt`
   - **Copyright**: `© 2024 CommuniEats`
7. **Review Information**:
   - Sign-in required: **Yes**
   - Username: `test@communieats.com`
   - Password: `TestPass123!`
   - Notes: "This is a community food delivery demo app. Use the test credentials above. Choose 'Community Courier' at checkout to see the key feature — discount based on how many neighbor orders you carry."
8. Click **Add for Review** → **Submit to App Review**

---

## Step 12 — Wait for Review

- **Typical review time**: 24–72 hours (usually faster)
- Apple will email you when approved or if there are issues
- Check [appstoreconnect.apple.com](https://appstoreconnect.apple.com) for status

### Common Rejection Reasons & Fixes

| Rejection | Fix |
|---|---|
| 4.2 Minimum Functionality | The app loads from Vercel. If rejected, add a short explanation in review notes that it uses Capacitor + native geolocation and haptics |
| 2.1 Performance — App Completeness | Make sure test credentials work and demo the full flow |
| 5.1.1 Privacy — Data Collection | PrivacyInfo.xcprivacy is already included |
| 4.0 Design | App uses safe area insets — should pass |

---

## Using Fastlane (Automated Alternative)

If you want to automate future submissions:

```bash
# Install fastlane
sudo gem install fastlane

# Edit ios-config/fastlane/Appfile with your Apple ID and team IDs
# Then:

./ios-build.sh testflight   # Upload to TestFlight
./ios-build.sh release      # Submit to App Store
```

---

## Quick Reference

| Item | Value |
|---|---|
| Bundle ID | `com.communieats.app` |
| App Name | CommuniEats |
| Version | 1.0.0 |
| Minimum iOS | 15.0 |
| Category | Food & Drink |
| Price | Free |
| Backend | Supabase + Vercel |
| Test email | test@communieats.com |
| Test password | TestPass123! |
| Promo codes | WELCOME10, COMMUNITY, GREENEATS |
| Live URL | https://communieats-app.vercel.app |
| Support URL | https://communieats-app.vercel.app/support |
| Privacy URL | https://communieats-app.vercel.app/privacy |

