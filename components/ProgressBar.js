import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export default function ProgressBar({ progress = 0, style, fillStyle }) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));

  return (
    <View style={[styles.track, style]}>
      <View
        style={[
          styles.fill,
          { width: `${Math.round(clamped * 100)}%` },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
