import { Tabs } from 'expo-router';
import TabGlyph from '../../../components/TabGlyph';
import { colors } from '../../../constants/theme';

const tabDefinitions = [
  { name: 'index', title: 'Home', symbol: '⌂' },
  { name: 'learn', title: 'Learn', symbol: '▤' },
  { name: 'quiz', title: 'Quiz', symbol: '✓' },
  { name: 'progress', title: 'Progress', symbol: '▥' },
  { name: 'profile', title: 'Profile', symbol: '◉' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 6,
        },
      }}
    >
      {tabDefinitions.map(({ name, title, symbol }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarAccessibilityLabel: `${title} tab`,
            tabBarIcon: ({ color }) => (
              <TabGlyph symbol={symbol} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
