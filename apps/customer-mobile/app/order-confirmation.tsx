import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { LogoMark } from '@/components/Logo';
import { useOrderStore } from '@/stores/orderStore';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lastOrder = useOrderStore((s) => s.lastOrder);

  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!lastOrder) {
      router.replace('/');
      return;
    }
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [lastOrder, router, scale, opacity]);

  if (!lastOrder) {
    return <EmptyState title="No recent order" message="Returning home…" />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.giant }]}>
      <View style={styles.content}>
        <View style={styles.brand}>
          <LogoMark size={44} />
        </View>
        <Animated.View style={[styles.successWrap, { opacity, transform: [{ scale }] }]}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Text style={styles.check}>✓</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.title}>Order Confirmed</Text>
        <Text style={styles.subtitle}>Thank you for ordering with Foodala.</Text>

        <View style={styles.orderNumberWrap}>
          <Text style={styles.orderNumberLabel}>ORDER NUMBER</Text>
          <Text style={styles.orderNumber}>{lastOrder.id}</Text>
        </View>

        <View style={[styles.card, shadows.card]}>
          {lastOrder.restaurantName ? (
            <Row label="Restaurant" value={lastOrder.restaurantName} />
          ) : null}
          <Row label="Total" value={formatPHP(lastOrder.total)} emphasize />
          <View style={styles.divider} />
          <View style={styles.statusRow}>
            <Text style={styles.rowLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Pending confirmation</Text>
            </View>
          </View>
        </View>

        <Text style={styles.note}>
          The restaurant will confirm your order shortly. Payment is Cash on Delivery.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Track Order" onPress={() => router.replace('/')} />
        <Button label="Back to Home" variant="ghost" onPress={() => router.replace('/')} />
      </View>
    </View>
  );
}

function Row({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, emphasize && styles.rowValueEmph]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  content: { paddingHorizontal: spacing.xl, alignItems: 'center' },
  brand: { marginBottom: spacing.xxl },
  successWrap: { marginBottom: spacing.xl },
  ringOuter: {
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: colors.white, fontSize: 46, fontWeight: '800', marginTop: -2 },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
  orderNumberWrap: { alignItems: 'center', marginTop: spacing.xl, gap: spacing.xs },
  orderNumberLabel: { ...typography.overline, color: colors.textMuted },
  orderNumber: { ...typography.display, fontSize: 32, color: colors.gold, letterSpacing: 1 },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyStrong, color: colors.textPrimary },
  rowValueEmph: { ...typography.h3, color: colors.gold },
  divider: { height: 1, backgroundColor: colors.border },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.goldSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  statusText: { ...typography.caption, color: colors.gold, fontWeight: '700' },
  note: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  footer: { paddingHorizontal: spacing.xl, gap: spacing.xs },
});
