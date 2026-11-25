import { Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors, spacing } from '../constants/theme';

export default function PrimaryButton({
  label,
  onPress,
  style,
  ...pressableProps
}) {
  return (
    <Pressable
      {...pressableProps}
      accessibilityRole={pressableProps.accessibilityRole || 'button'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText variant="button" color={colors.white}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: {
    backgroundColor: colors.primaryDark,
  },
});
