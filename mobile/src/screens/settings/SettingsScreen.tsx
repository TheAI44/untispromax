import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const theme = { bgPrimary: '#040d1a', bgSecondary: '#0d1f2d', textPrimary: '#e8f4ff', accent: '#00b4ff' };

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgPrimary }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: theme.textPrimary, fontSize: 24, fontWeight: '700', marginBottom: 20 }}>
          Einstellungen
        </Text>

        {/* Profile Section */}
        <View style={{ backgroundColor: theme.bgSecondary, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: theme.accent, fontSize: 12, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' }}>
            Profil
          </Text>
          <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: '600', marginBottom: 4 }}>
            {user?.displayName || 'User'}
          </Text>
          <Text style={{ color: theme.textPrimary, opacity: 0.6, fontSize: 14 }}>
            {user?.email}
          </Text>
        </View>

        {/* App Settings */}
        <View style={{ backgroundColor: theme.bgSecondary, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ color: theme.accent, fontSize: 12, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase' }}>
            Darstellung
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textPrimary, fontSize: 16 }}>Dunkler Modus</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#404040', true: theme.accent }} />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={logout}
          style={{
            backgroundColor: '#d32f2f',
            borderRadius: 8,
            paddingVertical: 12,
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Abmelden</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
