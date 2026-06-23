import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthHeaderButton } from '@/components/AuthHeaderButton';
import { CategoryCarousel } from '@/components/CategoryCarousel';
import { EmptyState } from '@/components/EmptyState';
import { FeaturedCard } from '@/components/FeaturedCard';
import { HomeSkeleton } from '@/components/Skeletons';
import { Logo } from '@/components/Logo';
import { RestaurantCard } from '@/components/RestaurantCard';
import { SearchBar } from '@/components/SearchBar';
import { getFeaturedRestaurants, getRestaurants, type MockRestaurant } from '@/data/mockRestaurants';
import { useAuthStore } from '@/stores/authStore';
import { colors, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const status = useAuthStore((s) => s.status);
  const email = useAuthStore((s) => s.email);

  const [restaurants, setRestaurants] = useState<MockRestaurant[]>([]);
  const [featured, setFeatured] = useState<MockRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [all, feat] = await Promise.all([getRestaurants(), getFeaturedRestaurants()]);
    setRestaurants(all);
    setFeatured(feat);
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  // Client-side filter by search text and selected category.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some((c) => c.toLowerCase().includes(q));
      const matchesCategory = !category || r.categories.includes(category);
      return matchesQuery && matchesCategory;
    });
  }, [restaurants, query, category]);

  // Auth gate — must come after hooks so hook order stays stable.
  if (status === 'loggedOut') return <Redirect href="/login" />;

  const greetingName =
    status === 'user' && email ? email.split('@')[0] : status === 'guest' ? 'there' : 'friend';

  const showFeatured = featured.length > 0 && !query && !category;

  const header = (
    <View>
      <View style={styles.heroText}>
        <Text style={styles.greeting}>Good day, {greetingName} 👋</Text>
        <Text style={styles.headline}>What are you craving today?</Text>
      </View>
      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <CategoryCarousel selected={category} onSelect={setCategory} />

      {showFeatured ? (
        <>
          <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>Featured</Text>
          <FlatList
            horizontal
            data={featured}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            renderItem={({ item }) => (
              <FeaturedCard restaurant={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
            )}
          />
        </>
      ) : null}

      <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>
        {category || query ? 'Results' : 'All Restaurants'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Logo />
        <AuthHeaderButton />
      </View>

      {loading ? (
        <HomeSkeleton />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <RestaurantCard restaurant={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.cream} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No restaurants found"
              message="Try a different search or category."
              icon="🔍"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  list: { paddingBottom: spacing.huge },
  heroText: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, gap: spacing.xs },
  greeting: { ...typography.body, color: colors.textSecondary },
  headline: { ...typography.h1, color: colors.textPrimary },
  searchWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  sectionTitlePadded: { marginTop: spacing.xl },
  featuredList: { gap: spacing.lg, paddingHorizontal: spacing.xl, paddingBottom: spacing.xs },
  cardWrap: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
});
