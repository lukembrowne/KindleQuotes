# 📱 Kindle Quote of the Day App

A React Native (Expo) app that delivers daily quotes from your Kindle highlights via notifications.

## ✨ Features

- Daily quote notifications at a customizable time
- Browse all your Kindle highlights
- Dark/light mode support
- Clean, modern UI
- Offline-first functionality

## 🛠 Tech Stack

- React Native (Expo)
- React Navigation
- Expo Notifications
- AsyncStorage
- Native DateTimePicker

## 📦 Project Structure

```
KindleQuotes/
├── assets/
│   └── quotes.json        # Kindle highlights data
├── screens/
│   ├── HomeScreen.js      # Daily quote display
│   ├── AllQuotesScreen.js # Browse all quotes
│   └── SettingsScreen.js  # App settings
├── utils/
│   ├── constants.js       # App constants
│   ├── quoteUtils.js      # Quote management
│   └── notificationUtils.js # Notification handling
└── navigation/
    └── AppNavigator.js    # Navigation setup
```

## 🔧 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS:
   ```bash
   npm run ios
   ```

## 📝 Usage

1. Launch the app to see your daily quote
2. Navigate to "All Quotes" to browse your Kindle highlights
3. Use "Settings" to customize your notification time
4. Receive daily quotes at your chosen time

## 🔔 Notifications

- Default notification time: 2:00 PM
- Customizable through Settings
- Quote text is automatically truncated if too long
- Tapping a notification opens the app to the full quote

## 🎨 Theming

The app supports both light and dark modes, automatically matching your system preferences.

## ⚠️ Error Handling

The app includes comprehensive error handling for:
- Quote loading failures
- Notification permission issues
- Invalid quote selection
- Storage errors

## 📱 Requirements

- iOS 13.0 or later
- Expo SDK 52
- React Native 0.76.7

## 🔄 Data Management

- Quotes are stored in a bundled JSON file
- User preferences are saved using AsyncStorage
- No online sync required

## 📄 License

MIT License 