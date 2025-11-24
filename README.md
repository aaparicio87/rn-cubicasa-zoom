

## Project Structure

```
PocCubicasa/
├── android/
│   ├── app/
│   │   ├── libs/
│   │   │   └── cubicapture-release-3.2.4.aar      # CubiCapture SDK
│   │   ├── src/main/
│   │   │   ├── java/com/nativecubicasa/           # Android native module
│   │   │   ├── AndroidManifest.xml                # App permissions & ARCore config
│   │   │   └── res/xml/file_paths.xml             # FileProvider configuration
│   │   └── build.gradle                           # App-level dependencies
│   └── build.gradle                               # Project-level configuration
├── ios/
│   ├── PocCubicasa/
│   │   ├── Info.plist                             # iOS permissions & settings
│   │   ├── AppDelegate.swift                      # iOS app delegate
│   │   └── Images.xcassets/                       # App icons & assets
│   ├── NativeCubiCasa.swift                       # Swift implementation
│   ├── NativeCubiCasa.m                           # Objective-C bridge
│   ├── NativeCubiCasa-Bridging-Header.h           # Swift-ObjC bridge header
│   ├── Podfile                                    # CocoaPods dependencies
│   └── PocCubicasa.xcworkspace/                   # Xcode workspace
├── src/
│   ├── components/
│   │   ├── ScanCard.tsx                           # Individual scan card component
│   │   └── CustomBottomSheet.tsx                  # Reusable bottom sheet
│   ├── hooks/
│   │   └── useScans.ts                            # Custom hook for scan management
│   ├── screens/
│   │   └── ScansScreen.tsx                        # Main scans list screen
│   ├── storage/
│   │   └── mmkv.ts                                # MMKV storage configuration
│   ├── types/
│   │   └── scan.ts                                # TypeScript type definitions
│   └── utils/
│       ├── fileSystem.ts                          # File system utilities
│       └── propertyTypes.ts                       # Property type definitions
├── specs/
│   └── NativeCubiCasa.ts                          # Turbo Module specification
├── __tests__/
│   └── App.test.tsx                               # Jest test files
├── App.tsx                                        # Root React Native component
├── index.js                                       # Entry point
├── package.json                                   # npm dependencies & scripts
├── jest.config.js                                 # Jest testing configuration
├── .eslintrc.js                                   # ESLint configuration
├── .prettierrc.js                                 # Prettier configuration
└── CLAUDE.md                                      # Claude Code documentation
```

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## AR Technology Overview: iOS vs Android

**Understanding the key differences between iOS and Android AR implementations:**

### 📊 Platform Comparison

| Aspect | iOS (ARKit) | Android (ARCore) |
|--------|-------------|------------------|
| **Technology** | ARKit (built into iOS) | ARCore (separate Google service) |
| **Availability** | iPhone 6s+ with iOS 11+ | Only Google-certified devices |
| **Device Coverage** | ~95% of modern iPhones | ~400 specific Android models |
| **Installation** | Included with iOS | Requires Google Play Services for AR |
| **LiDAR Requirement** | Optional (improves quality) | N/A (uses different depth sensing) |

### 🎯 Key Difference

**iOS: ARKit is part of the Operating System**
```
ARKit comes with iOS → iPhone runs iOS 11+ → ✅ Can scan
```

**Android: ARCore is NOT part of the Operating System**
```
ARCore is separate app → Google certifies devices → Only certified devices can scan
```

### ⚠️ Critical Impact for Developers

- **iOS**: Almost all modern iPhones can scan (very permissive)
- **Android**: Only devices on [Google's official list](https://developers.google.com/ar/devices) can scan (restrictive)

**Compatible Android Examples:**
- Samsung Galaxy S7 and newer
- Google Pixel (all models)
- OnePlus 5 and newer

**Incompatible Android Examples:**
- Older devices (< 2017)
- Budget/low-end devices
- Many devices from smaller manufacturers

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

## Android: ARCore Compatibility & Device Requirements

**⚠️ IMPORTANT**: This application requires ARCore for 3D scanning functionality. Before developing or testing the app, verify that your device is ARCore compatible.

### Verify ARCore Compatibility

#### Option 1: ARCore Elements App (Recommended)
1. Install [ARCore Elements](https://play.google.com/store/apps/details?id=com.google.ar.core.elements) from Play Store
2. If the app installs and runs correctly, your device is compatible
3. If it doesn't appear in Play Store or fails to open, your device is NOT compatible

#### Option 2: Official Google List
Check Google's [official list of ARCore supported devices](https://developers.google.com/ar/devices).

### Common Incompatibility Issues

#### Symptoms of Incompatible Device:
- App crashes unexpectedly when attempting to scan
- Error: "ARCore is not available on this device"
- Camera fails to start correctly in scanning mode
- Message: "This device does not support AR"

#### What to Do if Your Device is NOT Compatible:
1. **For Development**: Use an Android emulator with ARCore support or a compatible physical device
2. **For Testing**: The app will work normally except for scanning functionality
3. **Alternative Devices**: Samsung Galaxy S8+, Google Pixel 2+, OnePlus 6+, etc.

### ARCore Configuration in Project

The app is configured with ARCore as **required** (`android:value="required"`):
- Location: `android/app/src/main/AndroidManifest.xml:52`
- This means the app will only be visible in Play Store for compatible devices
- For testing on incompatible devices, change `required` to `optional`

### Android SDK and Dependencies

The app uses:
- **CubiCapture SDK**: `android/app/libs/cubicapture-release-3.2.4.aar`
- **ARCore**: Automatically integrated via Google Play Services
- **Required Permissions**: Camera, Location (GPS), Internet
- **Hardware Features**: Camera and GPS marked as mandatory

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Main Dependencies

- react-native 0.81.4
- @dr.pogodin/react-native-fs - File handling
- react-native-mmkv - Metadata storage
- react-native-paper - UI components
- react-native-safe-area-context - Safe areas

## 3. Configure the CubiCasa SDK

### 3.1. Open the Xcode workspace

```bash
open ios/PocCubicasa.xcworkspace
```

### 3.2. Add the SDK as Swift Package

In Xcode, select the project (blue file "PocCubicasa")
Go to the "Package Dependencies" tab
Click the "+" button (bottom left)
In "Search or Enter Package URL", paste:

```
https://github.com/CubiCasa/ios-sdk-distribution
```

Click "Add Package"
Select "CubiCapture" from the list
Click "Add Package"

### 3.3. Verify the target

Select the target "PocCubicasa" (not the project)
Go to "General" → "Frameworks, Libraries, and Embedded Content"
Verify that CubiCaptureSDK.framework is configured as:

"Embed & Sign" ✅

## Step 4: Modify your app

Now that you have successfully run the app, let's make changes!

