/**
 * Utility Functions
 * Common helpers for formatting, validation, and data manipulation
 */

/**
 * Format date to German locale (DD.MM.YYYY)
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

/**
 * Format date and time (DD.MM.YYYY, HH:MM)
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  const dateStr = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr}, ${hours}:${minutes}`;
};

/**
 * Format time only (HH:MM)
 */
export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Get human-readable relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Minuten`;
  if (diffHours < 24) return `vor ${diffHours} Stunden`;
  if (diffDays < 7) return `vor ${diffDays} Tagen`;

  return formatDate(d);
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: Date | string): boolean => {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Get day name in German
 */
export const getDayName = (date: Date | string): string => {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const d = new Date(date);
  return days[d.getDay()];
};

/**
 * Get month name in German
 */
export const getMonthName = (date: Date | string): string => {
  const months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  const d = new Date(date);
  return months[d.getMonth()];
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string to max length with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Sort items by date (ascending by default)
 */
export const sortByDate = <T extends { dueDate?: Date; createdAt?: Date; startDate?: Date }>(
  items: T[],
  ascending = true
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = a.dueDate || a.startDate || a.createdAt || new Date();
    const dateB = b.dueDate || b.startDate || b.createdAt || new Date();
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};

/**
 * Group items by date (returns array of [date, items])
 */
export const groupByDate = <T extends { dueDate?: Date; createdAt?: Date; startDate?: Date }>(
  items: T[]
): Array<[string, T[]]> => {
  const groups = new Map<string, T[]>();

  items.forEach((item) => {
    const date = formatDate(item.dueDate || item.startDate || item.createdAt || new Date());
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(item);
  });

  return Array.from(groups.entries());
};

/** Minimal shape for mensaplan day entries (see DataContext / web `index.html`) */
export interface MensaMealLike {
  name?: string;
  allergens?: string;
  vegan?: boolean;
}

export interface MensaDayPlanLike {
  meals?: MensaMealLike[];
}

/**
 * Normalize Firestore `appdata/mensaplan` field `value`: JSON strings, loose rows, alternate keys (`title`).
 */
export function normalizeMensaplanRecord(raw: unknown): Record<string, MensaDayPlanLike> {
  let obj: unknown = raw;
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch {
      return {};
    }
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {};
  }
  const src = obj as Record<string, unknown>;
  const out: Record<string, MensaDayPlanLike> = {};
  for (const [k, v] of Object.entries(src)) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    const day = v as Record<string, unknown>;
    const mealsRaw = day.meals;
    const meals: MensaMealLike[] = [];
    if (Array.isArray(mealsRaw)) {
      for (const m of mealsRaw) {
        if (typeof m === 'string') {
          if (m.trim()) meals.push({ name: m.trim() });
          continue;
        }
        if (m && typeof m === 'object') {
          const mm = m as Record<string, unknown>;
          const name =
            typeof mm.name === 'string'
              ? mm.name
              : typeof mm.title === 'string'
                ? mm.title
                : mm.name != null
                  ? String(mm.name)
                  : '';
          if (name.trim()) {
            meals.push({
              name: name.trim(),
              allergens: typeof mm.allergens === 'string' ? mm.allergens : undefined,
              vegan: Boolean(mm.vegan),
            });
          }
        }
      }
    }
    out[k] = { meals };
  }
  return out;
}

export type MensaResolveStrategy = 'iso-midnight' | 'local-date' | 'newest-with-meals' | 'none';

/**
 * Pick which mensaplan day to show. Web uses local midnight + `toISOString().split('T')[0]`, which can
 * differ from calendar "today" in some timezones; some datasets only have one recent key.
 */
export function pickMensaDayPlan(plan: Record<string, MensaDayPlanLike>): {
  dateKey: string;
  weekMensa: MensaDayPlanLike | undefined;
  strategy: MensaResolveStrategy;
} {
  const now = new Date();
  const isoMidnight = (() => {
    const t = new Date(now);
    t.setHours(0, 0, 0, 0);
    return t.toISOString().split('T')[0];
  })();
  const localKey = (() => {
    const t = new Date(now);
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();

  const tryKey = (key: string) => {
    const day = plan[key];
    const n = day?.meals?.length ?? 0;
    return n > 0 ? day : undefined;
  };

  let w = tryKey(isoMidnight);
  if (w) return { dateKey: isoMidnight, weekMensa: w, strategy: 'iso-midnight' };

  w = tryKey(localKey);
  if (w) return { dateKey: localKey, weekMensa: w, strategy: 'local-date' };

  const keys = Object.keys(plan).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k));
  keys.sort((a, b) => b.localeCompare(a));
  for (const key of keys) {
    w = tryKey(key);
    if (w) return { dateKey: key, weekMensa: w, strategy: 'newest-with-meals' };
  }

  return { dateKey: localKey, weekMensa: plan[localKey], strategy: 'none' };
}
