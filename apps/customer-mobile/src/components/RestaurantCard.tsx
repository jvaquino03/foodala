import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './PressableScale';
import { RestaurantMeta } from './RestaurantMeta';
import { Tag } from './Tag';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { MockRestaurant } from '@/data/mockRestaurants';

/** Premium full-width restaurant card: large photo, rating pill, tags, meta. */
export function RestaurantCard({
  restaurant,
  onPress,
}: {
  restaurant: MockRestaurant;
  onPress: () => void;
}) {
  return (
    <PressableScale style={[styles.card, shadows.card]} onPress={onPress}>
      <View style={styles.imageWrap}>
        {restaurant.image_url ? (
          <Image source={{ uri: restaurant.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>{restaurant.name.charAt(0)}</Text>
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(5,5,5,0.85)']}
          style={styles.imageScrim}
          pointerEvents="none"
        />
        <View style={styles.ratingPill}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.etaPill}>
          <Text style={styles.etaText}>{restaurant.deliveryTime}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.tags}>
          {restaurant.cuisines.map((c) => (
            <Tag key={c} label={c} />
          ))}
        </View>
        <RestaurantMeta
          rating={restaurant.rating}
          ratingCount={restaurant.ratingCount}
          deliveryTime={restaurant.deliveryTime}
          deliveryFee={restaurant.deliveryFee}
        />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 190, backgroundColor: colors.surfaceElevated },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { ...typography.display, color: colors.borderStrong },
  imageScrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 },
  ratingPill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.overlayStrong,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  ratingStar: { color: colors.gold, fontSize: 13 },
  ratingText: { ...typography.captionStrong, color: colors.white },
  etaPill: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.overlayStrong,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  etaText: { ...typography.caption, color: colors.cream, fontWeight: '600' },
  body: { padding: spacing.lg, gap: spacing.sm },
  name: { ...typography.h3, color: colors.textPrimary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
