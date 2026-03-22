import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const theme = {
  bgPrimary: '#040d1a',
  bgCard: '#0a1f3d',
  bgCard2: '#0d2448',
  textPrimary: '#e8f4ff',
  textSecondary: '#7aaed4',
  textMuted: '#3a6a9a',
  accent: '#00b4ff',
  accent2: '#0066cc',
  border: 'rgba(0,180,255,0.13)',
  danger: '#ff4060',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: theme.accent,
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 4,
    color: theme.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: theme.bgCard,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: theme.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(0,20,50,0.6)',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: theme.textPrimary,
    fontSize: 15,
  },
  inputFocus: {
    borderColor: theme.accent,
  },
  btn: {
    backgroundColor: theme.accent2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  errorMsg: {
    backgroundColor: 'rgba(255,64,96,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,64,96,0.3)',
    color: theme.danger,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 13,
  },
  footerText: {
    textAlign: 'center',
    color: theme.textMuted,
    fontSize: 14,
    marginTop: 16,
  },
  linkText: {
    color: theme.accent,
    fontWeight: '600',
  },
});

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      if (!email || !password) {
        setError('Bitte alle Felder ausfüllen');
        return;
      }

      await login(email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorCode = err.code;

      if (errorCode === 'auth/user-not-found') {
        setError('Benutzer nicht gefunden');
      } else if (errorCode === 'auth/wrong-password') {
        setError('Falsches Passwort');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Ungültige E-Mail Adresse');
      } else {
        setError('Anmeldung fehlgeschlagen. Versuchen Sie es später erneut.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.logo}>UntisProMax</Text>
          <Text style={styles.subtitle}>Klassen-App</Text>

          <View style={styles.card}>
            {error && <Text style={styles.errorMsg}>{error}</Text>}

            <View style={styles.formGroup}>
              <Text style={styles.label}>E-Mail</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocus,
                ]}
                placeholder="deine@email.de"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Passwort</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'password' && styles.inputFocus,
                ]}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Anmelden</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Noch kein Konto?{' '}
              <Text style={styles.linkText}>Registrieren</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
