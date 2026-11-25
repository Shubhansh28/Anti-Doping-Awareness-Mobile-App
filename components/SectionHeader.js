import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, spacing } from '../constants/theme';

export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <View style={styles.container}>
      {eyebrow ? (
        <AppText variant="label" color={colors.primary}>
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="display">{title}</AppText>
      {description ? (
        <AppText color={colors.textSecondary}>{description}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
});
