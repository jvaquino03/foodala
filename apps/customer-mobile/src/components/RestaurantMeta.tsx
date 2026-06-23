import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';

type Props = {
  rating: number;
  ratingCount?: number;
  deliveryTime: string;
  deliveryFee: number;
  compact?: boolean;
};

/** Rating ★ · delivery time · delivery fee — the standard restaurant meta row. */
export function RestaurantMeta({ rating, ratingCount, deliveryTime, deliveryFee, compact }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.star}>★</Text>
      <Text style={styles.strong}>{rating.toFixed(1)}</Text>
      {ratingCount && !compact ? <Text style={styles.muted}>({ratingCount}+)</Text> : null}
      <Text style={styles.dot}>·</Text>
      <Text style={styles.muted}>{deliveryTime}</Text>
      <Text style={styles.dot}>·</Text>
      <Text style={styles.muted}>{deliveryFee === 0 ? 'Free delivery' : `${formatPHP(deliveryFee)}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  star: { color: colors.gold, fontSize: 14 },
  strong: { ...typography.captionStrong, color: colors.textPrimary },
  muted: { ...typography.caption, color: colors.textSecondary },
  dot: { color: colors.textMuted, fontSize: 13, marginHorizontal: 1 },
});
