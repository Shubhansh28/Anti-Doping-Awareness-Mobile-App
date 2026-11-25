import { Text } from 'react-native';
import { colors, typography } from '../constants/theme';

export default function AppText({
  variant = 'body',
  color = colors.text,
  style,
  children,
  ...props
}) {
  return (
    <Text
      {...props}
      style={[typography[variant], { color }, style]}
    >
      {children}
    </Text>
  );
}
