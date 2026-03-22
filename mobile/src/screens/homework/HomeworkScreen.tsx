import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = { bgPrimary: '#040d1a', textPrimary: '#e8f4ff' };

export default function HomeworkScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: '600' }}>📚 Aufgaben</Text>
        <Text style={{ color: theme.textPrimary, marginTop: 8, opacity: 0.6 }}>Coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}
