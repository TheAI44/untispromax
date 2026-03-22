import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const theme = {
  bgPrimary: '#040d1a',
  bgCard: '#0a1f3d',
  textPrimary: '#e8f4ff',
  textMuted: '#3a6a9a',
  accent: '#00b4ff',
  accent2: '#0066cc',
  border: 'rgba(0,180,255,0.13)',
  danger: '#ff4060',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bgPrimary },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logo: { fontSize: 32, fontWeight: '800', textAlign: 'center', color: theme.accent, marginBottom: 8 },
  subtitle: { fontSize: 12, letterSpacing: 4, color: theme.textMuted, textAlign: 'center', marginBottom: 32 },
  card: { backgroundColor: theme.bgCard, borderRadius: 20, padding: 32, borderWidth: 1, borderColor: theme.border },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 12, letterSpacing: 1.5, color: theme.textMuted, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(0,20,50,0.6)', borderWidth: 1, borderColor: theme.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 13, color: theme.textPrimary, fontSize: 15 },
  btn: { backgroundColor: theme.accent2, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  errorMsg: { backgroundColor: 'rgba(255,64,96,0.1)', borderWidth: 1, borderColor: 'rgba(255,64,96,0.3)', color: theme.danger, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 },
});

export default function SignupScreen() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      if (!email || !password || !name) {
        setError('Alle Felder ausfüllen');
        return;
      }
      await signup(email, password, name);
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'E-Mail bereits registriert' : 'Fehler bei der Registrierung');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.logo}>UntisProMax</Text>
          <Text style={styles.subtitle}>Registrierung</Text>
          <View style={styles.card}>
            {error && <Text style={styles.errorMsg}>{error}</Text>}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} placeholder="Dein Name" placeholderTextColor={theme.textMuted} value={name} onChangeText={setName} editable={!loading} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>E-Mail</Text>
              <TextInput style={styles.input} placeholder="deine@email.de" placeholderTextColor={theme.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" editable={!loading} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Passwort</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={theme.textMuted} value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Registrieren</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
