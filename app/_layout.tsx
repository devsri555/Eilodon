// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }












// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import React from 'react';
// import { useColorScheme } from 'react-native';

// import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <AnimatedSplashOverlay />
//       <AppTabs />
//     </ThemeProvider>
//   );
// }

// File: src/app/_layout.tsx
import { SQLiteProvider } from 'expo-sqlite';
import { Slot } from 'expo-router'; // Slot renders the current screen (like index.tsx)
import { Suspense } from 'react';
import { Text } from 'react-native'; 

import { useFonts } from 'expo-font';

// Initialize your tables here
async function initializeDatabase(db: any) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS usage_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS questionnaire_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER,
      answer_text TEXT,
      answered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GoogleSans: require('../assets/fonts/GoogleSans.ttf'),
    GoogleSansItalic: require('../assets/fonts/GoogleSansItalic.ttf'),
    GoogleSansBold: require('../assets/fonts/GoogleSansBold.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  return (
    <Suspense fallback={<Text>Loading Database...</Text>}>
      {/* Wraps your entire app navigation */}
      <SQLiteProvider databaseName="eidolon.db" onInit={initializeDatabase} useSuspense>
        <Slot /> 
      </SQLiteProvider>
    </Suspense>
  );
}
