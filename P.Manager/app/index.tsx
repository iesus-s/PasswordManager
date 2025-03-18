import React, { useEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { authenticateWithFingerprint } from "./utils/auth";
import { ThemedText } from "./components/ThemedText";
import { ThemedView } from "./components/ThemedView";

export default function LoadScreen() {
  const router = useRouter();

  useEffect(() => {
    const authenticateAndNavigate = async () => {
      const result = await authenticateWithFingerprint(); 

      if (result) {
        setTimeout(() => {
          router.replace("/main"); // Navigate to the HomeScreen
        }, 1000);
      } else {
        Alert.alert("Authentication Failed", "You must authenticate to proceed.");
      }
    };

    authenticateAndNavigate();
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="app">Jesus' Password Manager</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
