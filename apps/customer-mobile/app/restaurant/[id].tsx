import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '@/components/EmptyState';
import { FloatingCartButton } from '@/components/FloatingCartButton';
import { MenuItemRow } from '@/components/MenuItemRow';
import { PressableScale } from '@/components/PressableScale';
import { RestaurantDetailSkeleton } from '@/components/Skeletons';
import { getMenuForRestaurant, getRestaurantById, type MockRestaurant } from '@/data/mockRestaurants';
import { useCartStore } from '@/stores/cartStore';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatPHP } from '@/utils/format';
import type { MenuItem } from '@/types/database';

type Section = { id: string; title: string; data: MenuItem[] };

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [restaurant, setRestaurant] = useState<MockRestaurant | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const menuY = useRef(0);
  const tabBarH = useRef(0);
  const sectionY = useRef<Record<string, number>>({});

  const cartCount = useCartStore((s) => s.totalQuantity());
  const cartSubtotal = useCartStore((s) => s.subtotal());
  const canAdd = useCartStore((s) => s.canAdd);
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const load = useCallback(async () => {
    if (!id) return;
    const [restaurantData, menu] = await Promise.all([
      getRestaurantById(id),
      getMenuForRestaurant(id),
    ]);
    setRestaurant(restaurantData);

    const { categories, items } = menu;
    const grouped: Section[] = categories
      .map((cat) => ({ id: cat.id, title: cat.name, data: items.filter((it) => it.category_id === cat.id) }))
      .filter((s) => s.data.length > 0);

    const uncategorized = items.filter(
      (it) => !it.category_id || !categories.some((c) => c.id === it.category_id)
    );
    if (uncategorized.length > 0) grouped.push({ id: '__other', title: 'Other', data: uncategorized });

    setSections(grouped);
    setActiveTab(grouped[0]?.id ?? null);
  }, [id]);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const handleAdd = useCallback(
    (item: MenuItem) => {
      if (!restaurant || !item.is_available) return;
      if (canAdd(restaurant.id)) {
        addItem(restaurant.id, restaurant.name, item);
        return;
      }
      Alert.alert(
        'Start a new cart?',
        'Your cart has items from another restaurant. Adding this item will clear your current cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear & add',
            style: 'destructive',
            onPress: () => {
              clearCart();
              addItem(restaurant.id, restaurant.name, item);
            },
          },
        ]
      );
    },
    [restaurant, canAdd, addItem, clearCart]
  );

  const scrollToSection = (sectionId: string) => {
    const y = menuY.current + (sectionY.current[sectionId] ?? 0) - tabBarH.current - 1;
    scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: true });
    setActiveTab(sectionId);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y + tabBarH.current + 2;
    let current = sections[0]?.id ?? null;
    for (const s of sections) {
      const top = menuY.current + (sectionY.current[s.id] ?? 0);
      if (top <= y) current = s.id;
    }
    if (current !== activeTab) setActiveTab(current);
  };

  if (loading) return <RestaurantDetailSkeleton />;

  if (!restaurant) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <BackButton onPress={() => router.back()} />
        <EmptyState title="Restaurant not found" message="It may no longer be available." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollRef}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* index 0 — cover + info */}
        <View>
          <View style={styles.coverWrap}>
            {restaurant.image_url ? (
              <Image source={{ uri: restaurant.image_url }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverPlaceholder]} />
            )}
            <LinearGradient
              colors={['rgba(5,5,5,0.2)', 'rgba(5,5,5,0.95)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.coverContent}>
              <Text style={styles.name}>{restaurant.name}</Text>
              {restaurant.description ? (
                <Text style={styles.description}>{restaurant.description}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.statsRow}>
            <Stat icon="★" value={restaurant.rating.toFixed(1)} label={`${restaurant.ratingCount}+ ratings`} gold />
            <View style={styles.statDivider} />
            <Stat value={restaurant.deliveryTime} label="Delivery" />
            <View style={styles.statDivider} />
            <Stat value={formatPHP(restaurant.deliveryFee)} label="Delivery fee" />
          </View>
          {restaurant.address ? <Text style={styles.address}>📍 {restaurant.address}</Text> : null}
        </View>

        {/* index 1 — sticky category tabs */}
        <View
          style={styles.tabBar}
          onLayout={(e: LayoutChangeEvent) => {
            tabBarH.current = e.nativeEvent.layout.height;
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContent}>
            {sections.map((s) => {
              const active = activeTab === s.id;
              return (
                <PressableScale key={s.id} onPress={() => scrollToSection(s.id)} style={[styles.tab, active && styles.tabActive]}>
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{s.title}</Text>
                </PressableScale>
              );
            })}
          </ScrollView>
        </View>

        {/* index 2 — menu */}
        <View
          style={styles.menu}
          onLayout={(e: LayoutChangeEvent) => {
            menuY.current = e.nativeEvent.layout.y;
          }}
        >
          {sections.length === 0 ? (
            <EmptyState title="No menu items" message="This restaurant hasn't added items yet." />
          ) : (
            sections.map((section) => (
              <View
                key={section.id}
                onLayout={(e: LayoutChangeEvent) => {
                  sectionY.current[section.id] = e.nativeEvent.layout.y;
                }}
              >
                <Text style={styles.sectionHeader}>{section.title}</Text>
                {section.data.map((item) => (
                  <MenuItemRow key={item.id} item={item} onAdd={() => handleAdd(item)} />
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BackButton onPress={() => router.back()} />
      <FloatingCartButton count={cartCount} subtotal={cartSubtotal} onPress={() => router.push('/cart')} />
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <PressableScale style={[styles.backButton, shadows.soft]} onPress={onPress} activeScale={0.9}>
      <Text style={styles.backChevron}>‹</Text>
    </PressableScale>
  );
}

function Stat({ icon, value, label, gold }: { icon?: string; value: string; label: string; gold?: boolean }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statValueRow}>
        {icon ? <Text style={[styles.statIcon, gold && styles.statIconGold]}>{icon}</Text> : null}
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  coverWrap: { height: 260, position: 'relative', justifyContent: 'flex-end' },
  cover: { ...StyleSheet.absoluteFillObject, width: '100%', height: 260, backgroundColor: colors.surfaceElevated },
  coverPlaceholder: { backgroundColor: colors.surfaceElevated },
  coverContent: { padding: spacing.xl, gap: spacing.xs },
  name: { ...typography.display, fontSize: 30, color: colors.white },
  description: { ...typography.body, color: colors.cream },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginTop: -spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    ...shadows.card,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statIcon: { ...typography.bodyStrong, color: colors.textPrimary },
  statIconGold: { color: colors.gold },
  statValue: { ...typography.bodyStrong, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textMuted },
  statDivider: { width: 1, height: 28, backgroundColor: colors.border },
  address: { ...typography.caption, color: colors.textSecondary, paddingHorizontal: spacing.xl, marginTop: spacing.md },
  tabBar: { backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: spacing.lg },
  tabContent: { gap: spacing.sm, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  tab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surfaceElevated },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.captionStrong, color: colors.textSecondary },
  tabTextActive: { color: colors.white },
  menu: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  sectionHeader: { ...typography.h3, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.xs },
  backButton: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.overlayStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: { color: colors.white, fontSize: 30, fontWeight: '700', marginTop: -4 },
});
