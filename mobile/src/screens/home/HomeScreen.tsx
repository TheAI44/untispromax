import React, { useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '../../context/DataContext';
import { pickMensaDayPlan } from '../../utils/helpers';

const theme = {
  bgPrimary: '#040d1a',
  bgCard: '#0a1f3d',
  textPrimary: '#e8f4ff',
  textSecondary: '#7aaed4',
  accent: '#00b4ff',
  success: '#00e5a0',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bgPrimary,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: theme.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,180,255,0.13)',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: theme.textSecondary,
    marginTop: 4,
  },
  emptyState: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function HomeScreen() {
  const { homework, events, mensaplan, loading } = useData();

  const todayMensa = useMemo(() => pickMensaDayPlan(mensaplan), [mensaplan]);

  const upcomingHW = homework
    .filter((hw) => !hw.done)
    .slice(0, 5)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Upcoming Homework */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 Anstehende Aufgaben</Text>
            {upcomingHW.length > 0 ? (
              upcomingHW.map((hw) => (
                <View key={hw.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{hw.subject}</Text>
                  <Text style={styles.cardSubtitle}>{hw.desc}</Text>
                  <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
                    Bis: {new Date(hw.date).toLocaleDateString('de-DE')}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Keine anstehenden Aufgaben</Text>
              </View>
            )}
          </View>

          {/* Events */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Termine</Text>
            {events.length > 0 ? (
              events.slice(0, 3).map((event) => (
                <View key={event.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{event.subject}</Text>
                  <Text style={styles.cardSubtitle}>{event.desc}</Text>
                  <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
                    {new Date(event.date).toLocaleDateString('de-DE')}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Keine Termine</Text>
              </View>
            )}
          </View>

          {/* Mensaplan (same data model as web index.html) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍽️ Mensaplan</Text>
            {todayMensa.strategy !== 'iso-midnight' && todayMensa.weekMensa?.meals?.length ? (
              <Text style={[styles.cardSubtitle, { marginBottom: 10, marginTop: -6 }]}>
                {todayMensa.strategy === 'local-date'
                  ? 'Heute (lokal)'
                  : `Aktueller Eintrag: ${todayMensa.dateKey.split('-').reverse().join('.')}`}
              </Text>
            ) : null}
            {todayMensa.weekMensa?.meals && todayMensa.weekMensa.meals.length > 0 ? (
              todayMensa.weekMensa.meals.map((meal, idx) => (
                <View key={`${meal.name}-${idx}`} style={styles.card}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{meal.name?.trim() || 'Gericht'}</Text>
                      <Text style={[styles.cardSubtitle, { marginTop: 6, fontSize: 12 }]}>
                        {meal.vegan ? '🌱 Vegan' : ''}
                        {meal.vegan && meal.allergens ? ' · ' : ''}
                        {meal.allergens || ''}
                      </Text>
                    </View>
                    <Text style={[styles.cardSubtitle, { color: theme.accent, fontWeight: '700' }]}>
                      {idx + 1}/{todayMensa.weekMensa!.meals.length}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Mensaplan noch nicht verfügbar 📋</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
