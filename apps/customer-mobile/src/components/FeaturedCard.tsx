import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { MockRestaurant } from '@/data/mockRestaurants';

const CARD_WIDTH = 300;

/** Large, image-forward card for the featured horizontal carousel. */
export function FeaturedCard({
  restaurant,
  onPress,
}: {
  restaurant: MockRestaurant;
  onPress: () => void;
}) {
  return (
    <PressableScale style={[styles.card, shadows.card]} onPress={onPress} activeScale={0.98}>
      {restaurant.image_url ? (
        <Image source={{ uri: restaurant.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <LinearGradient
        colors={['rgba(5,5,5,0.05)', 'rgba(5,5,5,0.92)']}
        style={styles.scrim}
        pointerEvents="none"
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>FEATURED</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.metaStrong}>{restaurant.rating.toFixed(1)}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{restaurant.deliveryTime}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>{restaurant.cuisines[0]}</Text>
        </View>
      </View>
    </PressableScale>
  );
}

export const FEATURED_CARD_WIDTH = CARD_WIDTH;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: { ...StyleSheet.absoluteFillObject, width: CARD_WIDTH, height: 200 },
  placeholder: { backgroundColor: colors.surfaceElevated },
  scrim: { ...StyleSheet.absoluteFillObject },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: { ...typography.overline, color: colors.white, fontSize: 10 },
  content: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, gap: spacing.xs },
  name: { ...typography.h2, color: colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  star: { color: colors.gold, fontSize: 14 },
  metaStrong: { ...typography.captionStrong, color: colors.white },
  meta: { ...typography.caption, color: colors.cream },
  dot: { color: colors.cream, marginHorizontal: 1 },
});
