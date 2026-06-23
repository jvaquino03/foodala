import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { HOME_CATEGORIES } from '@/data/mockRestaurants';
import { colors, radius, spacing, typography } from '@/theme';

/**
 * Horizontal image-backed category chips. `selected` is the active key (or null
 * for "All"); tapping toggles selection to filter the restaurant list.
 */
export function CategoryCarousel({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {HOME_CATEGORIES.map((cat) => {
        const active = selected === cat.key;
        return (
          <PressableScale
            key={cat.key}
            onPress={() => onSelect(active ? null : cat.key)}
            style={styles.item}
          >
            <View style={[styles.imageRing, active && styles.imageRingActive]}>
              <Image source={{ uri: cat.image }} style={styles.image} />
              {active ? <View style={styles.activeOverlay} /> : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {cat.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingHorizontal: spacing.xl, paddingVertical: spacing.xs },
  item: { alignItems: 'center', gap: spacing.sm, width: 72 },
  imageRing: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    padding: 3,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageRingActive: { borderColor: colors.primary },
  image: { width: '100%', height: '100%', borderRadius: radius.pill, backgroundColor: colors.surfaceElevated },
  activeOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: radius.pill, backgroundColor: colors.primarySoft },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  labelActive: { color: colors.textPrimary },
});
