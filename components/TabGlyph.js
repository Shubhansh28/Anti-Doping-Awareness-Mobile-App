import { StyleSheet, Text } from 'react-native';

export default function TabGlyph({ symbol, color }) {
  return (
    <Text
      accessibilityElementsHidden
      allowFontScaling={false}
      importantForAccessibility="no"
      style={[styles.glyph, { color }]}
    >
      {symbol}
    </Text>
  );
}

const styles = StyleSheet.create({
  glyph: {
    fontSize: 23,
    lineHeight: 27,
    textAlign: 'center',
  },
});
