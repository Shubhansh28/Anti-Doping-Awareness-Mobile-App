import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../../../components/AppText';
import Screen from '../../../../../components/Screen';
import SurfaceCard from '../../../../../components/SurfaceCard';
import { colors, spacing } from '../../../../../constants/theme';
import categories from '../../../../../data/prohibitedCategories.json';

function CategoryNotFound() {
  return (
    <Screen>
      <SurfaceCard>
        <AppText variant="heading">Class not found</AppText>
        <AppText color={colors.textSecondary}>
          This class is not in the local overview. Check the official
          Prohibited List for complete, current information.
        </AppText>
        <Link href="/learn/prohibited" asChild>
          <Pressable accessibilityRole="button" style={styles.backButton}>
            <AppText variant="button" color={colors.white}>
              Back to all classes
            </AppText>
          </Pressable>
        </Link>
      </SurfaceCard>
    </Screen>
  );
}

export default function ProhibitedCategoryDetail() {
  const { categoryId } = useLocalSearchParams();
  const requestedId = Array.isArray(categoryId) ? categoryId[0] : categoryId;
  const category = categories.find((item) => item.id === requestedId);

  if (!category) {
    return <CategoryNotFound />;
  }

  return (
    <Screen>
      <Link href="/learn/prohibited" asChild>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          style={styles.backLink}
        >
          <AppText variant="button" color={colors.primary}>
            ←  All classes
          </AppText>
        </Pressable>
      </Link>

      <View style={styles.header}>
        <View style={styles.codeBadge}>
          <AppText variant="label" color={colors.primary}>
            {category.code}
          </AppText>
        </View>
        <AppText variant="display" style={styles.title}>
          {category.title}
        </AppText>
        <AppText variant="button" color={colors.primary}>
          {category.prohibitedWhen}
        </AppText>
        <AppText color={colors.textSecondary}>{category.summary}</AppText>
      </View>

      <SurfaceCard style={styles.examplesCard}>
        <AppText variant="heading">Illustrative examples</AppText>
        {category.examples.map((example) => (
          <View key={example} style={styles.exampleRow}>
            <AppText variant="button" color={colors.primary}>
              •
            </AppText>
            <AppText color={colors.textSecondary} style={styles.exampleText}>
              {example}
            </AppText>
          </View>
        ))}
        <AppText variant="caption" color={colors.textSecondary}>
          Examples are not exhaustive. A substance’s status can depend on the
          exact ingredient, formulation and applicable conditions.
        </AppText>
      </SurfaceCard>

      <View style={styles.noteSection}>
        <AppText variant="heading">What athletes should know</AppText>
        <AppText color={colors.textSecondary}>{category.athleteNote}</AppText>
      </View>

      <View style={styles.notice}>
        <AppText variant="label" color={colors.primary}>
          CHECK THE CURRENT RULES
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          This overview summarizes selected parts of the 2026 WADA Prohibited
          List, effective 1 January 2026. It is not a complete or
          medicine-specific determination. Ask a qualified medical professional
          or anti-doping organization before making treatment decisions.
        </AppText>
      </View>

      <Link href="/learn/resources" asChild>
        <Pressable accessibilityRole="button" style={styles.resourcesLink}>
          <AppText variant="button" color={colors.primary}>
            Open official anti-doping resources  →
          </AppText>
        </Pressable>
      </Link>
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
  codeBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    minWidth: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 29,
    lineHeight: 36,
  },
  examplesCard: {
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  exampleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  exampleText: {
    flex: 1,
  },
  noteSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  notice: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D5E9DC',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  resourcesLink: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
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
