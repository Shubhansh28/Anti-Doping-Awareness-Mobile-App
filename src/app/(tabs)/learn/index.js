import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../../../../components/AppText';
import Screen from '../../../../components/Screen';
import SectionHeader from '../../../../components/SectionHeader';
import SurfaceCard from '../../../../components/SurfaceCard';
import { colors, spacing } from '../../../../constants/theme';
import articles from '../../../../data/learningArticles.json';
import categories from '../../../../data/learningCategories.json';

function CategoryFilter({ category, selectedCategory }) {
  const selected = category.id === selectedCategory;

  return (
    <Link
      href={{
        pathname: '/learn',
        params: { category: category.id },
      }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={[styles.filterChip, selected && styles.selectedFilterChip]}
      >
        <AppText
          variant="caption"
          color={selected ? colors.white : colors.textSecondary}
          style={styles.filterText}
        >
          {category.title}
        </AppText>
      </Pressable>
    </Link>
  );
}

function ArticleCard({ article, category }) {
  return (
    <Link
      href={{
        pathname: '/learn/[articleId]',
        params: { articleId: article.id },
      }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Read ${article.title}`}
        style={({ pressed }) => [
          styles.articlePressable,
          pressed && styles.pressedCard,
        ]}
      >
        <SurfaceCard style={styles.articleCard}>
          <View style={styles.articleMeta}>
            <AppText variant="label" color={colors.primary}>
              {category.title.toUpperCase()}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {article.readMinutes} min read
            </AppText>
          </View>
          <AppText variant="heading">{article.title}</AppText>
          <AppText color={colors.textSecondary}>{article.summary}</AppText>
          <AppText variant="button" color={colors.primary}>
            Read article  →
          </AppText>
        </SurfaceCard>
      </Pressable>
    </Link>
  );
}

export default function LearningLibrary() {
  const { category } = useLocalSearchParams();
  const requestedCategory = Array.isArray(category) ? category[0] : category;
  const selectedCategory = categories.some(
    (item) => item.id === requestedCategory,
  )
    ? requestedCategory
    : 'all';
  const visibleArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((article) => article.categoryId === selectedCategory);

  return (
    <Screen>
      <SectionHeader
        eyebrow="LEARN"
        title="Learning library"
        description="Build your clean-sport knowledge with practical, easy-to-follow guides."
      />

      <View style={styles.sectionHeading}>
        <AppText variant="heading">Browse topics</AppText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        <Link href="/learn" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'all' }}
            style={[
              styles.filterChip,
              selectedCategory === 'all' && styles.selectedFilterChip,
            ]}
          >
            <AppText
              variant="caption"
              color={selectedCategory === 'all' ? colors.white : colors.textSecondary}
              style={styles.filterText}
            >
              All topics
            </AppText>
          </Pressable>
        </Link>
        {categories.map((item) => (
          <CategoryFilter
            key={item.id}
            category={item}
            selectedCategory={selectedCategory}
          />
        ))}
      </ScrollView>

      {selectedCategory !== 'all' ? (
        <SurfaceCard style={styles.categoryIntro}>
          <AppText variant="label" color={colors.primary}>
            SELECTED TOPIC
          </AppText>
          <AppText variant="heading">
            {categories.find((item) => item.id === selectedCategory).title}
          </AppText>
          <AppText color={colors.textSecondary}>
            {categories.find((item) => item.id === selectedCategory).description}
          </AppText>
        </SurfaceCard>
      ) : null}

      <View style={styles.articleList}>
        {visibleArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            category={categories.find((item) => item.id === article.categoryId)}
          />
        ))}
      </View>

      <AppText variant="caption" color={colors.textSecondary} style={styles.note}>
        Educational overview only. Always check the latest NADA India guidance
        and applicable anti-doping rules.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    marginBottom: spacing.sm,
  },
  filterList: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  selectedFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontWeight: '600',
  },
  categoryIntro: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  articleList: {
    gap: spacing.md,
  },
  articlePressable: {
    borderRadius: 20,
  },
  articleCard: {
    gap: spacing.sm,
    padding: spacing.md,
  },
  articleMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pressedCard: {
    opacity: 0.8,
  },
  note: {
    marginTop: spacing.lg,
  },
});
