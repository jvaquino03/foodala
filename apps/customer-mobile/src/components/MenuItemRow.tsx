import { Image, StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';
import type { MenuItem } from '@/types/database';

/** Premium menu row: thumbnail, name/description, price, and a clean add button. */
export function MenuItemRow({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const unavailable = !item.is_available;
  return (
    <View style={[styles.row, unavailable && styles.rowDisabled]}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatPHP(item.price)}</Text>
        {unavailable ? <Text style={styles.unavailable}>Currently unavailable</Text> : null}
      </View>

      <View style={styles.thumbWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]} />
        )}
        <PressableScale
          onPress={onAdd}
          disabled={unavailable}
          activeScale={0.9}
          style={[styles.addButton, shadows.soft, unavailable && styles.addButtonDisabled]}
          accessibilityLabel={`Add ${item.name}`}
        >
          <Text style={styles.addPlus}>+</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowDisabled: { opacity: 0.5 },
  info: { flex: 1, gap: spacing.xs, justifyContent: 'center' },
  name: { ...typography.title, color: colors.textPrimary },
  description: { ...typography.caption, color: colors.textSecondary },
  price: { ...typography.bodyStrong, color: colors.cream, marginTop: spacing.xs },
  unavailable: { ...typography.caption, color: colors.danger, marginTop: 2 },
  thumbWrap: { width: 104, height: 104 },
  thumb: { width: 104, height: 104, borderRadius: radius.lg, backgroundColor: colors.surfaceElevated },
  thumbPlaceholder: { backgroundColor: colors.surfaceElevated },
  addButton: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  addButtonDisabled: { backgroundColor: colors.surfaceHigh },
  addPlus: { color: colors.white, fontSize: 24, fontWeight: '700', marginTop: -2 },
});
