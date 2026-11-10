# Cyber Void: Survivor — Android

This repository contains the original 2D canvas arena-survivor game. It is not the Battle Royale prototype.

## Build an Android APK with GitHub Actions

1. Upload the contents of this ZIP to the root of a GitHub repository.
2. Push to `main` (or `master`), or open **Actions** and run **Build Cyber Void Survivor APK**.
3. When the workflow succeeds, open the run and download the `Cyber-Void-Survivor-APK` artifact.
4. Extract `app-debug.apk` and install it on an Android device.

## Local web development

Requires Node.js 22.

```sh
npm ci
npm run dev
```

## Android build details

- Capacitor 7 generates the Android project during the workflow.
- Capacitor configuration is JSON to avoid TypeScript config-loader incompatibilities.
- Vite uses relative asset paths (`base: './'`) for Android WebView.
- Android is configured for landscape orientation and immersive full-screen mode.
- The workflow produces a debug APK. A signed release APK requires a signing keystore.

## Mobile controls and layout

The mobile interface uses a fixed dynamic viewport (`100dvh`), safe-area padding, and minimum touch targets. The virtual joystick and action buttons keep stable physical sizes across common phone resolutions. Dialog panels can scroll on short landscape screens instead of clipping their buttons. The game remains locked to landscape on Android.
