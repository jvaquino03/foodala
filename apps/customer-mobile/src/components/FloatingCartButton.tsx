import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';

export function FloatingCartButton({
  count,
  subtotal,
  onPress,
}: {
  count: number;
  subtotal: number;
  onPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  if (count === 0) return null;

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + spacing.lg }]} pointerEvents="box-none">
      <PressableScale style={[styles.button, shadows.primaryGlow]} onPress={onPress} activeScale={0.97}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
        <Text style={styles.label}>View Cart</Text>
        <Text style={styles.amount}>{formatPHP(subtotal)}</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, paddingHorizontal: spacing.xl },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 60,
    gap: spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    minWidth: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  badgeText: { ...typography.captionStrong, color: colors.white },
  label: { flex: 1, ...typography.button, color: colors.white },
  amount: { ...typography.button, color: colors.white },
});
