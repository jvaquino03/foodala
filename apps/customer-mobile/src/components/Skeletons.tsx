import { StyleSheet, View } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, radius, spacing } from '@/theme';

/** Placeholder for a single restaurant card. */
export function RestaurantCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton style={styles.image} />
      <View style={styles.body}>
        <Skeleton style={{ width: '55%', height: 18, borderRadius: radius.sm }} />
        <Skeleton style={{ width: '40%', height: 12, borderRadius: radius.sm }} />
        <Skeleton style={{ width: '70%', height: 12, borderRadius: radius.sm }} />
      </View>
    </View>
  );
}

/** Home loading state: featured strip + a few cards. */
export function HomeSkeleton() {
  return (
    <View style={styles.screen}>
      <Skeleton style={{ width: 180, height: 28, borderRadius: radius.sm }} />
      <Skeleton style={{ width: '100%', height: 52, borderRadius: radius.lg }} />
      <Skeleton style={{ width: '100%', height: 200, borderRadius: radius.xl }} />
      <RestaurantCardSkeleton />
      <RestaurantCardSkeleton />
    </View>
  );
}

/** Restaurant detail loading state: cover + menu rows. */
export function RestaurantDetailSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Skeleton style={{ width: '100%', height: 280, borderRadius: 0 }} />
      <View style={styles.screen}>
        <Skeleton style={{ width: '60%', height: 26, borderRadius: radius.sm }} />
        <Skeleton style={{ width: '45%', height: 14, borderRadius: radius.sm }} />
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.menuRow}>
            <View style={{ flex: 1, gap: spacing.sm }}>
              <Skeleton style={{ width: '70%', height: 16, borderRadius: radius.sm }} />
              <Skeleton style={{ width: '90%', height: 12, borderRadius: radius.sm }} />
              <Skeleton style={{ width: 60, height: 14, borderRadius: radius.sm }} />
            </View>
            <Skeleton style={{ width: 104, height: 104, borderRadius: radius.lg }} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.xl, gap: spacing.lg, backgroundColor: colors.background, flex: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 190, borderRadius: 0 },
  body: { padding: spacing.lg, gap: spacing.sm },
  menuRow: { flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.md },
});
