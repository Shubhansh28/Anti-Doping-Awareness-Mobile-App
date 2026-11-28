import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AppText from '../../../../../components/AppText';
import ExternalResourceCard from '../../../../../components/ExternalResourceCard';
import Screen from '../../../../../components/Screen';
import SectionHeader from '../../../../../components/SectionHeader';
import { colors, spacing } from '../../../../../constants/theme';
import resources from '../../../../../data/antiDopingResources.json';
import prohibitedCategories from '../../../../../data/prohibitedCategories.json';

const filters = [
  { id: 'all', title: 'All' },
  { id: 'substance', title: 'Substances' },
  { id: 'method', title: 'Methods' },
];
const medicineResource = resources.find((resource) => resource.id === 'kym');

function FilterChip({ filter, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.filterChip, selected && styles.selectedFilter]}
    >
      <AppText
        variant="caption"
        color={selected ? colors.white : colors.textSecondary}
        style={styles.filterText}
      >
        {filter.title}
      </AppText>
    </Pressable>
  );
}

function CategoryCard({ category }) {
  return (
    <Link
      href={{
        pathname: '/learn/prohibited/[categoryId]',
        params: { categoryId: category.id },
      }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Read about ${category.code}: ${category.title}`}
        style={({ pressed }) => [
          styles.categoryCard,
          pressed && styles.pressedCard,
        ]}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.codeBadge}>
            <AppText variant="label" color={colors.primary}>
              {category.code}
            </AppText>
          </View>
          <AppText
            variant="caption"
            color={colors.textSecondary}
            style={styles.context}
          >
            {category.prohibitedWhen}
          </AppText>
        </View>
        <AppText variant="heading" style={styles.categoryTitle}>
          {category.title}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {category.summary}
        </AppText>
        <AppText variant="button" color={colors.primary}>
          View overview  →
        </AppText>
      </Pressable>
    </Link>
  );
}

export default function ProhibitedInformation() {
  const { type: requestedType } = useLocalSearchParams();
  const initialType = Array.isArray(requestedType)
    ? requestedType[0]
    : requestedType;
  const [selectedType, setSelectedType] = useState(
    filters.some((filter) => filter.id === initialType) ? initialType : 'all',
  );
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();

  const visibleCategories = useMemo(
    () =>
      prohibitedCategories.filter((category) => {
        const matchesType =
          selectedType === 'all' || category.type === selectedType;
        const searchableText = [
          category.code,
          category.title,
          category.summary,
          category.prohibitedWhen,
          ...category.examples,
        ]
          .join(' ')
          .toLowerCase();
        return matchesType && searchableText.includes(normalizedSearch);
      }),
    [normalizedSearch, selectedType],
  );

  return (
    <Screen>
      <SectionHeader
        eyebrow="ANTI-DOPING INFORMATION"
        title="Prohibited substances & methods"
        description="A plain-language guide to selected classes in the 2026 WADA Prohibited List."
      />

      <View style={styles.notice}>
        <AppText variant="label" color={colors.primary}>
          IMPORTANT
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          This is a learning summary, not a complete list or a medicine checker.
          Prohibition can depend on timing, route, dose, sport and exceptions.
          Check the current official List and ask a qualified medical
          professional or anti-doping organization before using medication.
        </AppText>
      </View>

      <TextInput
        accessibilityLabel="Search prohibited substances and methods"
        onChangeText={setSearch}
        placeholder="Search a class or example"
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        style={styles.searchInput}
        value={search}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            filter={filter}
            selected={selectedType === filter.id}
            onPress={() => setSelectedType(filter.id)}
          />
        ))}
      </ScrollView>

      <AppText variant="caption" color={colors.textSecondary}>
        Showing {visibleCategories.length} of {prohibitedCategories.length}{' '}
        classes · 2026 List effective 1 January 2026
      </AppText>

      {visibleCategories.length ? (
        <View style={styles.categoryList}>
          {visibleCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <AppText variant="heading">No matching classes</AppText>
          <AppText color={colors.textSecondary}>
            Try a different search term or choose another filter.
          </AppText>
        </View>
      )}

      <View style={styles.resourceSection}>
        <AppText variant="heading">Need to check a medicine?</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Use NADA India’s Know Your Medicine service for medicine-specific
          guidance, and confirm the result with a qualified professional.
        </AppText>
        <ExternalResourceCard
          title={medicineResource.title}
          description={medicineResource.description}
          url={medicineResource.url}
        />
        <Link href="/learn/resources" asChild>
          <Pressable accessibilityRole="button" style={styles.resourcesLink}>
            <AppText variant="button" color={colors.primary}>
              More trusted resources  →
            </AppText>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D5E9DC',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  filters: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
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
  selectedFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontWeight: '600',
  },
  categoryList: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    padding: spacing.md,
  },
  categoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  codeBadge: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    minWidth: 42,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  context: {
    flex: 1,
    textAlign: 'right',
  },
  categoryTitle: {
    fontSize: 19,
    lineHeight: 25,
  },
  pressedCard: {
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  resourceSection: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  resourcesLink: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
});
