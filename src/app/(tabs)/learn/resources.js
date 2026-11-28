import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../../components/AppText';
import ExternalResourceCard from '../../../../components/ExternalResourceCard';
import Screen from '../../../../components/Screen';
import SectionHeader from '../../../../components/SectionHeader';
import { colors, spacing } from '../../../../constants/theme';
import resources from '../../../../data/antiDopingResources.json';

export default function AntiDopingResources() {
  return (
    <Screen>
      <Link href="/learn/prohibited" asChild>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          style={styles.backLink}
        >
          <AppText variant="button" color={colors.primary}>
            ←  Prohibited substances & methods
          </AppText>
        </Pressable>
      </Link>

      <SectionHeader
        eyebrow="TRUSTED SOURCES"
        title="Official resources"
        description="Use current guidance from anti-doping organizations for decisions about medicines, testing and treatment."
      />

      <View style={styles.notice}>
        <AppText variant="caption" color={colors.textSecondary}>
          For medical care, talk to your doctor. For anti-doping status, confirm
          with NADA India or the relevant anti-doping organization. Do not stop
          or change prescribed treatment based only on this app.
        </AppText>
      </View>

      <View style={styles.resourceList}>
        {resources.map((resource) => (
          <ExternalResourceCard
            key={resource.id}
            title={resource.title}
            description={resource.description}
            url={resource.url}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  notice: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D5E9DC',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  resourceList: {
    gap: spacing.md,
  },
});
