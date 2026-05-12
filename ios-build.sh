#!/usr/bin/env bash
# CommuniEats — iOS Build Script
# Run this from the project root on a Mac with Xcode installed
# Usage: ./ios-build.sh [testflight|release|open]

set -e

MODE=${1:-open}
echo "🌱 CommuniEats iOS Build — mode: $MODE"

# ── 1. Build the web app ────────────────────────────────────────────────────
echo "📦 Building Next.js app..."
npm run build

# ── 2. Add/sync iOS platform ────────────────────────────────────────────────
if [ ! -d "ios" ]; then
  echo "📱 Adding iOS platform..."
  npx cap add ios
fi

echo "🔄 Syncing Capacitor..."
npx cap sync ios

# ── 3. Copy config files into Xcode project ─────────────────────────────────
IOS_APP="ios/App/App"

echo "📋 Copying configuration files..."

# PrivacyInfo.xcprivacy (required iOS 17+)
cp ios-config/PrivacyInfo.xcprivacy "$IOS_APP/PrivacyInfo.xcprivacy"

# Entitlements
cp ios-config/App.entitlements "$IOS_APP/App.entitlements"

echo "⚙️  Merging Info.plist additions..."
python3 - << 'PYEOF'
import plistlib, sys

info_path = 'ios/App/App/Info.plist'
additions_path = 'ios-config/Info.plist.additions.xml'

try:
    with open(info_path, 'rb') as f:
        info = plistlib.load(f)
except:
    info = {}

# Parse additions (strip DOCTYPE for plistlib compatibility)
with open(additions_path, 'r') as f:
    xml = f.read()

# Simple key extraction without DOCTYPE
import re
pairs = re.findall(r'<key>([^<]+)</key>\s*<(?:string|false|true|array|dict)([^>]*)>([^<]*)</', xml)
for key, _, val in pairs:
    if key not in info and not key.startswith('!--'):
        info[key] = val.strip() if val.strip() else ''

# Manual additions for complex types
info.setdefault('NSLocationWhenInUseUsageDescription',
    'CommuniEats uses your location to show nearby restaurants and help you connect with Community Courier opportunities in your area.')
info.setdefault('NSCameraUsageDescription',
    'CommuniEats would like to access your camera to update your profile photo.')
info.setdefault('NSPhotoLibraryUsageDescription',
    'CommuniEats would like to access your photos to update your profile photo.')
info.setdefault('UIBackgroundModes', ['remote-notification'])
info.setdefault('CFBundleURLTypes', [{
    'CFBundleURLName': 'com.communieats.app',
    'CFBundleURLSchemes': ['communieats']
}])

# App Transport Security — allow Vercel and Supabase HTTPS
info['NSAppTransportSecurity'] = {
    'NSAllowsArbitraryLoads': False,
    'NSExceptionDomains': {
        'communieats-app.vercel.app': {
            'NSExceptionAllowsInsecureHTTPLoads': False,
            'NSIncludesSubdomains': True,
        },
        'lvfrmygikdgbpjyllvqz.supabase.co': {
            'NSExceptionAllowsInsecureHTTPLoads': False,
            'NSIncludesSubdomains': True,
        }
    }
}

with open(info_path, 'wb') as f:
    plistlib.dump(info, f)

print('  ✓ Info.plist updated')
PYEOF

# ── 4. CocoaPods install ─────────────────────────────────────────────────────
echo "🍫 Installing CocoaPods dependencies..."
cd ios/App && pod install --repo-update && cd ../..

# ── 5. Open / Build / Upload ─────────────────────────────────────────────────
if [ "$MODE" = "open" ]; then
  echo "🖥  Opening Xcode..."
  npx cap open ios

elif [ "$MODE" = "testflight" ]; then
  echo "✈️  Building and uploading to TestFlight via fastlane..."
  gem install fastlane --no-document 2>/dev/null || true
  cp ios-config/fastlane/Appfile ios/App/fastlane/Appfile
  cp ios-config/fastlane/Fastfile ios/App/fastlane/Fastfile
  cd ios/App && fastlane beta && cd ../..

elif [ "$MODE" = "release" ]; then
  echo "🚀 Releasing to App Store via fastlane..."
  cp ios-config/fastlane/Appfile ios/App/fastlane/Appfile
  cp ios-config/fastlane/Fastfile ios/App/fastlane/Fastfile
  cd ios/App && fastlane release && cd ../..

else
  echo "Unknown mode: $MODE. Use: open | testflight | release"
  exit 1
fi

echo ""
echo "✅ Done! CommuniEats iOS build complete."
