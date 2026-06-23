import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { PressableScale } from '@/components/PressableScale';
import { useCartStore } from '@/stores/cartStore';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const restaurantName = useCartStore((s) => s.restaurantName);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryFee = useCartStore((s) => s.deliveryFee());
  const total = useCartStore((s) => s.total());

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Your cart is empty"
          message="Browse restaurants and add something delicious."
          icon="🛒"
        />
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button label="Browse Restaurants" onPress={() => router.replace('/')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {restaurantName ? (
          <View style={styles.restaurantPill}>
            <Text style={styles.restaurantLabel}>Order from</Text>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
          </View>
        ) : null}

        <View style={[styles.card, shadows.card]}>
          {items.map((item, idx) => (
            <View key={item.menuItemId} style={[styles.row, idx > 0 && styles.rowBorder]}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.unitPrice}>{formatPHP(item.unitPrice)} each</Text>
              </View>
              <View style={styles.stepper}>
                <PressableScale style={styles.stepBtn} onPress={() => decrement(item.menuItemId)} activeScale={0.85}>
                  <Text style={styles.stepBtnText}>−</Text>
                </PressableScale>
                <Text style={styles.qty}>{item.quantity}</Text>
                <PressableScale style={styles.stepBtn} onPress={() => increment(item.menuItemId)} activeScale={0.85}>
                  <Text style={styles.stepBtnText}>+</Text>
                </PressableScale>
              </View>
              <Text style={styles.lineTotal}>{formatPHP(item.unitPrice * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.summaryCard]}>
          <SummaryRow label="Subtotal" value={formatPHP(subtotal)} />
          <SummaryRow label="Delivery fee" value={formatPHP(deliveryFee)} />
          <View style={styles.totalDivider} />
          <SummaryRow label="Total" value={formatPHP(total)} emphasize />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total</Text>
          <Text style={styles.footerTotalValue}>{formatPHP(total)}</Text>
        </View>
        <Button label="Proceed to Checkout" onPress={() => router.push('/checkout')} />
      </View>
    </View>
  );
}

function SummaryRow({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, emphasize && styles.summaryLabelEmph]}>{label}</Text>
      <Text style={[styles.summaryValue, emphasize && styles.summaryValueEmph]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  restaurantPill: { gap: 2 },
  restaurantLabel: { ...typography.overline, color: colors.textMuted },
  restaurantName: { ...typography.h3, color: colors.textPrimary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  info: { flex: 1, gap: 2 },
  name: { ...typography.title, color: colors.textPrimary },
  unitPrice: { ...typography.caption, color: colors.textMuted },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { color: colors.cream, fontSize: 20, fontWeight: '700', marginTop: -2 },
  qty: { ...typography.bodyStrong, color: colors.textPrimary, minWidth: 18, textAlign: 'center' },
  lineTotal: { ...typography.bodyStrong, color: colors.textPrimary, minWidth: 72, textAlign: 'right' },
  summaryCard: { paddingVertical: spacing.lg, gap: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.body, color: colors.textSecondary },
  summaryValue: { ...typography.body, color: colors.textPrimary },
  summaryLabelEmph: { ...typography.h3, color: colors.textPrimary },
  summaryValueEmph: { ...typography.h3, color: colors.gold },
  totalDivider: { height: 1, backgroundColor: colors.border },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  footerTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTotalLabel: { ...typography.body, color: colors.textSecondary },
  footerTotalValue: { ...typography.h2, color: colors.textPrimary },
});
