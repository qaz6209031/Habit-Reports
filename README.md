# HabitReport 👋

HabitReport is a minimalist, high-performance habit tracker designed to help you build and maintain better routines. Built with **React Native** and **Expo**, it offers a sleek dark-themed interface with powerful visualization tools.

## ✨ Features

- **Daily Habit Tracking**: Easily toggle habit completion for any date with fluid haptic feedback.
- **Progress Visualizations**: 
  - **Heatmaps**: Every habit includes a contribution-style heatmap to visualize your consistency over the year.
  - **Completion Percentages**: Real-time calculation of habit success rates.
- **Deep Customization**:
  - **Lucide Icons**: Choose from a vast library of modern icons.
  - **Vibrant Color Palette**: Personalize each habit with curated high-contrast colors.
  - **Emoji Support**: Use emojis to represent your habits.
- **Flexible Scheduling**: Set specific start and optional end dates for each habit.
- **Local-First**: All data is stored securely on your device using React Native Async Storage.
- **Modern UI**: Designed with a premium dark mode, glassmorphism-inspired elements, and smooth transitions.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction) (File-based)
- **Icons**: [Lucide React Native](https://lucide.dev/) & [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- **Animations**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- **State Management**: React Context API
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Tactile Feedback**: [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the app

```bash
npx expo start
```

In the output, you can choose to open the app in:
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (Scan the QR code with your phone)

## 📦 Scripts

- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm run lint`: Run ESLint to check for code issues

## 🏗️ Architecture

- **`app/`**: Contains the main application screens using Expo Router.
- **`components/`**: Reusable UI components like `Heatmap`, `HabitCard`, and `IconEmojiSelector`.
- **`context/`**: Core business logic and state persistence via `HabitContext`.
- **`constants/`**: Theme definitions and shared configuration.

## 📱 Deployment

This project is configured for [EAS Build](https://docs.expo.dev/build/introduction/).

To trigger a production build:
```bash
eas build --platform ios
# or
eas build --platform android
```
