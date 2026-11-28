import { Alert, Pressable, StyleSheet, View } from 'react-native';
import * as Linking from 'expo-linking';
import AppText from './AppText';
import { colors, spacing } from '../constants/theme';

export default function ExternalResourceCard({ title, description, url }) {
  async function openResource() {
    try {
      await Linking.openURL(url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Please try again later.';
      Alert.alert('Unable to open resource', message);
    }
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open ${title}`}
      onPress={openResource}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.copy}>
        <AppText variant="heading" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {description}
        </AppText>
        <AppText variant="button" color={colors.primary}>
          Open official resource  →
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.8,
  },
});
