import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PressableScale } from './PressableScale';
import { useAuthStore } from '@/stores/authStore';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * Top-right header control:
 * - logged out → "Login" button
 * - guest      → "Guest" badge
 * - user       → circular avatar with the email initial
 * Tapping always routes to the login screen (mock).
 */
export function AuthHeaderButton() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const email = useAuthStore((s) => s.email);

  if (status === 'user') {
    const initial = (email?.charAt(0) ?? 'U').toUpperCase();
    return (
      <PressableScale style={styles.avatar} onPress={() => router.push('/login')} activeScale={0.9}>
        <Text style={styles.avatarText}>{initial}</Text>
      </PressableScale>
    );
  }

  if (status === 'guest') {
    return (
      <PressableScale style={styles.guestBadge} onPress={() => router.push('/login')} activeScale={0.92}>
        <View style={styles.guestDot} />
        <Text style={styles.guestText}>Guest</Text>
      </PressableScale>
    );
  }

  return (
    <PressableScale style={styles.loginButton} onPress={() => router.push('/login')} activeScale={0.92}>
      <Text style={styles.loginText}>Login</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  loginText: { ...typography.captionStrong, color: colors.white },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  guestDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  guestText: { ...typography.captionStrong, color: colors.gold },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  avatarText: { ...typography.bodyStrong, color: colors.white },
});
