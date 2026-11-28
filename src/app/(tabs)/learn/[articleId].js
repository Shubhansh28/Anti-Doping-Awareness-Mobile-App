import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../../components/AppText';
import Screen from '../../../../components/Screen';
import SurfaceCard from '../../../../components/SurfaceCard';
import { colors, spacing } from '../../../../constants/theme';
import articles from '../../../../data/learningArticles.json';
import categories from '../../../../data/learningCategories.json';

function ArticleNotFound() {
  return (
    <Screen>
      <SurfaceCard>
        <AppText variant="heading">Article not found</AppText>
        <AppText color={colors.textSecondary}>
          This learning article is unavailable. Return to the library to choose
          another topic.
        </AppText>
        <Link href="/learn" asChild>
          <Pressable accessibilityRole="button" style={styles.backButton}>
            <AppText variant="button" color={colors.white}>
              Back to learning library
            </AppText>
          </Pressable>
        </Link>
      </SurfaceCard>
    </Screen>
  );
}

export default function ArticleDetail() {
  const { articleId } = useLocalSearchParams();
  const requestedId = Array.isArray(articleId) ? articleId[0] : articleId;
  const article = articles.find((item) => item.id === requestedId);

  if (!article) {
    return <ArticleNotFound />;
  }

  const category = categories.find((item) => item.id === article.categoryId);

  return (
    <Screen>
      <Link href="/learn" asChild>
        <Pressable
          accessibilityRole="button"
          style={styles.backLink}
          hitSlop={8}
        >
          <AppText variant="button" color={colors.primary}>
            ←  Learning library
          </AppText>
        </Pressable>
      </Link>

      <View style={styles.header}>
        <AppText variant="label" color={colors.primary}>
          {category?.title.toUpperCase() || 'CLEAN SPORT'}
        </AppText>
        <AppText variant="display" style={styles.title}>
          {article.title}
        </AppText>
        <AppText color={colors.textSecondary}>{article.summary}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {article.readMinutes} min read
        </AppText>
      </View>

      {article.sections.map((section) => (
        <View key={section.heading} style={styles.articleSection}>
          <AppText variant="heading">{section.heading}</AppText>
          {section.paragraphs.map((paragraph, index) => (
            <AppText key={`${section.heading}-${index}`} color={colors.textSecondary}>
              {paragraph}
            </AppText>
          ))}
        </View>
      ))}

      <SurfaceCard style={styles.takeawayCard}>
        <AppText variant="label" color={colors.primary}>
          KEY TAKEAWAY
        </AppText>
        <AppText variant="heading">{article.takeaway}</AppText>
      </SurfaceCard>

      <AppText variant="caption" color={colors.textSecondary}>
        Content based on: {article.source}. This is an educational overview;
        always check the latest NADA India guidance and applicable rules.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 29,
    lineHeight: 36,
  },
  articleSection: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  takeawayCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D5E9DC',
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
});
