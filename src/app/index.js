import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>NADA INDIA</Text>
        <Text style={styles.title}>Anti-Doping Awareness</Text>
        <Text style={styles.description}>
          Learn about clean sport, safe choices, and your responsibilities as an
          athlete.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  eyebrow: {
    color: '#237A57',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  title: {
    color: '#14251E',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 39,
    marginBottom: 12,
  },
  description: {
    color: '#506159',
    fontSize: 16,
    lineHeight: 24,
  },
});
