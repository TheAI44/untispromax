import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = {
  bgPrimary: '#040d1a',
  accent: '#00b4ff',
  textPrimary: '#e8f4ff',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.accent,
    marginBottom: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textPrimary,
    marginBottom: 32,
  },
});

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>UntisProMax</Text>
      <Text style={styles.subtitle}>Wird geladen...</Text>
      <ActivityIndicator size="large" color={theme.accent} />
    </SafeAreaView>
  );
}
