import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

// Single source of truth for the brand mark.
const LOGO = require('../../assets/images/foodala-logo-transparent.png');

/**
 * Foodala brand lockup: the logo mark (assets/images/foodala-logo-transparent.png) paired
 * with the wordmark. Used as a premium brand element in the header, login hero,
 * and confirmation — never as repeated decoration.
 */
export function Logo({ size = 'md', wordmark = true }: { size?: 'md' | 'lg'; wordmark?: boolean }) {
  const large = size === 'lg';
  const markSize = large ? 72 : 40;

  return (
    <View style={styles.row}>
      <Image source={LOGO} style={{ width: markSize, height: markSize }} resizeMode="contain" />
      {wordmark ? (
        <View>
          <Text style={[styles.wordmark, large && styles.wordmarkLg]}>FOODALA</Text>
          {large ? <Text style={styles.tagline}>PREMIUM FOOD DELIVERY</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

/** Just the mark, centered — for splash-style / confirmation usage. */
export function LogoMark({ size = 96 }: { size?: number }) {
  return <Image source={LOGO} style={{ width: size, height: size }} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  wordmark: { ...typography.h3, color: colors.white, letterSpacing: 2, fontWeight: '900' },
  wordmarkLg: { ...typography.display, letterSpacing: 3, fontWeight: '900' },
  tagline: { ...typography.overline, color: colors.gold, marginTop: 2, letterSpacing: 2 },
});
