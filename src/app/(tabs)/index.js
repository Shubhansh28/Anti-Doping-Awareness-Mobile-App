import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../components/AppText';
import Screen from '../../../components/Screen';
import SurfaceCard from '../../../components/SurfaceCard';
import { colors, spacing } from '../../../constants/theme';

const categories = [
  { title: 'Anti-doping basics', symbol: '◎' },
  { title: 'Athlete rights', symbol: '◇' },
  { title: 'Medicine safety', symbol: '+' },
];

function SectionTitle({ children, action }) {
  return (
    <View style={styles.sectionTitle}>
      <AppText variant="heading">{children}</AppText>
      {action ? (
        <Link href="/learn" style={styles.textLink}>
          {action}
        </Link>
      ) : null}
    </View>
  );
}

function CategoryCard({ title, symbol }) {
  return (
    <Link href="/learn" asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Explore ${title}`}
        style={({ pressed }) => [
          styles.categoryCard,
          pressed && styles.pressedCard,
        ]}
      >
        <View style={styles.categoryIcon}>
          <AppText variant="heading" color={colors.primary}>
            {symbol}
          </AppText>
        </View>
        <AppText variant="caption" style={styles.categoryTitle}>
          {title}
        </AppText>
      </Pressable>
    </Link>
  );
}

export default function HomeTab() {
  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.welcomeRow}>
        <View style={styles.welcomeCopy}>
          <AppText variant="label" color={colors.primary}>
            NADA INDIA · CLEAN SPORT
          </AppText>
          <AppText variant="display" style={styles.welcomeTitle}>
            Hello, athlete
          </AppText>
          <AppText color={colors.textSecondary}>
            Small steps build a stronger clean-sport mindset.
          </AppText>
        </View>
        <View style={styles.brandMark}>
          <AppText variant="heading" color={colors.white}>
            N
          </AppText>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTag}>
          <AppText variant="label" color={colors.white}>
            YOUR LEARNING SPACE
          </AppText>
        </View>
        <AppText variant="heading" color={colors.white} style={styles.heroTitle}>
          Make every choice count.
        </AppText>
        <AppText color="#E0EFE7">
          Get clear, practical guidance to help you protect your health and
          compete with confidence.
        </AppText>
        <Link href="/learn" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.heroButton,
              pressed && styles.heroButtonPressed,
            ]}
          >
            <AppText variant="button" color={colors.primaryDark}>
              Start learning
            </AppText>
            <AppText variant="button" color={colors.primaryDark}>
              →
            </AppText>
          </Pressable>
        </Link>
      </View>

      <View style={styles.statsSection}>
        <SectionTitle>Your learning</SectionTitle>
        <View style={styles.statsRow}>
          <SurfaceCard style={styles.statCard}>
            <AppText variant="display" color={colors.primary}>
              0
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              lessons completed
            </AppText>
          </SurfaceCard>
          <SurfaceCard style={styles.statCard}>
            <AppText variant="display" color={colors.primary}>
              0
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              quizzes completed
            </AppText>
          </SurfaceCard>
        </View>
      </View>

      <View style={styles.categoriesSection}>
        <SectionTitle action="View all">
          Explore topics
        </SectionTitle>
        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              symbol={category.symbol}
            />
          ))}
        </View>
      </View>

      <Link href="/quiz" asChild>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.quizCard,
            pressed && styles.pressedCard,
          ]}
        >
          <View style={styles.quizIcon}>
            <AppText variant="heading" color={colors.primary}>
              ?
            </AppText>
          </View>
          <View style={styles.quizCopy}>
            <AppText variant="label" color={colors.primary}>
              DAILY KNOWLEDGE CHECK
            </AppText>
            <AppText variant="heading">Ready for a quick quiz?</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Test your knowledge and learn as you go.
            </AppText>
          </View>
          <AppText variant="heading" color={colors.primary}>
            →
          </AppText>
        </Pressable>
      </Link>

      <View style={styles.featuredSection}>
        <SectionTitle action="Explore">
          Featured for you
        </SectionTitle>
        <Link href="/learn" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore featured topic: Your health, your responsibility"
            style={({ pressed }) => [
              styles.featuredCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.featuredAccent} />
            <View style={styles.featuredCopy}>
              <AppText variant="label" color={colors.primary}>
                CLEAN SPORT ESSENTIALS
              </AppText>
              <AppText variant="heading">
                Your health, your responsibility
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Learn why checking medicines and asking for guidance matters.
              </AppText>
            </View>
            <AppText variant="heading" color={colors.primary}>
              →
            </AppText>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  welcomeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  welcomeCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  welcomeTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  heroCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.lg,
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#28654F',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroTitle: {
    fontSize: 25,
    lineHeight: 31,
  },
  heroButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: spacing.md,
  },
  heroButtonPressed: {
    opacity: 0.85,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  textLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    padding: spacing.xs,
  },
  statsSection: {
    gap: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  categoriesSection: {
    gap: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    gap: spacing.sm,
    minHeight: 116,
    padding: spacing.md,
  },
  categoryIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  categoryTitle: {
    color: colors.text,
    fontWeight: '600',
  },
  quizCard: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: '#D5E9DC',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  quizIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  quizCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  featuredSection: {
    gap: 0,
  },
  featuredCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.md,
    overflow: 'hidden',
    padding: spacing.md,
  },
  featuredAccent: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: 5,
  },
  featuredCopy: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  pressedCard: {
    opacity: 0.8,
  },
});
