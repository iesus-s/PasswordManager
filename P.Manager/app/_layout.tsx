import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useColorScheme as useRNColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useRNColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  }); 

  // Load Screen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // Delay showing the navigation bar
      const timer = setTimeout(() => { 
      }, 2000); // Delay duration (2 seconds)

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> 
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="accounts" />
      </Stack>
    </ThemeProvider>
  );
}
