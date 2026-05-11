# How to Submit CommuniEats to the Apple App Store

## Prerequisites
- [ ] Apple Developer Account ($99/year) at developer.apple.com
- [ ] Mac with Xcode 15+ installed
- [ ] CocoaPods installed: `sudo gem install cocoapods`

## Step 1: Add iOS Platform
```bash
npx cap add ios
```

## Step 2: Sync Web Assets
```bash
npx cap sync ios
```

## Step 3: Open in Xcode
```bash
npx cap open ios
```

## Step 4: Configure Signing in Xcode
1. Select the CommuniEats project in the left sidebar
2. Go to "Signing & Capabilities" tab
3. Select your Team (Apple Developer Account)
4. Set Bundle Identifier: `com.communieats.app`
5. Enable "Automatically manage signing"

## Step 5: Add App Icons in Xcode
1. In Xcode, open `App/Assets.xcassets/AppIcon.appiconset`
2. Drag in the icon files from `public/icons/`
3. Required sizes: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt

## Step 6: Configure Info.plist
Copy the contents from `ios-config/Info.plist.additions.xml` into your ios/App/App/Info.plist

## Step 7: Test on Simulator
1. Select an iPhone simulator in Xcode
2. Press the Play button (Cmd+R)
3. Test all flows: browse → restaurant → cart → checkout → courier

## Step 8: Test on Real Device
1. Connect iPhone via USB
2. Trust the developer certificate on your phone
3. Select your phone in Xcode device dropdown
4. Press Play

## Step 9: Archive for App Store
1. In Xcode menu: Product → Archive
2. Wait for archive to complete
3. In Organizer, click "Distribute App"
4. Choose "App Store Connect"
5. Follow the wizard

## Step 10: App Store Connect Setup
1. Go to appstoreconnect.apple.com
2. Create new app: My Apps → +
3. Fill in metadata from APP_STORE_METADATA.md
4. Upload screenshots (minimum 3 per device type)
5. Set pricing to Free
6. Submit for review

## App Store Review Timeline
- First submission: 24-48 hours typically
- Common rejection reasons to avoid:
  - Missing privacy policy URL ✅ (added at /privacy)
  - Placeholder content ✅ (real data from Supabase)
  - Login required without demo account ✅ (test@communieats.com / password123)
  - Missing location permission description ✅ (added in Info.plist)

## After Approval
- Enable phased rollout (5% → 10% → 20% → 50% → 100% over 7 days)
- Monitor crash reports in Xcode Organizer
- Set up App Store Connect notifications
