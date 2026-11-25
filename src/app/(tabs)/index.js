import { Link } from 'expo-router';
import AppText from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import Screen from '../../../components/Screen';
import SectionHeader from '../../../components/SectionHeader';
import SurfaceCard from '../../../components/SurfaceCard';
import { colors } from '../../../constants/theme';

export default function HomeTab() {
  return (
    <Screen>
      <SectionHeader
        eyebrow="NADA INDIA  ·  CLEAN SPORT"
        title="Learn. Compete. Stay clean."
        description="Clear, practical anti-doping information for athletes and their support teams."
      />
      <SurfaceCard>
        <AppText variant="label" color={colors.primary}>
          YOUR LEARNING SPACE
        </AppText>
        <AppText variant="heading">
          Make informed choices for clean sport
        </AppText>
        <AppText color={colors.textSecondary}>
          Explore guidance on anti-doping responsibilities, medicines, and the
          rules that help protect fair competition.
        </AppText>
        <Link href="/learn" asChild>
          <PrimaryButton label="Explore learning" />
        </Link>
      </SurfaceCard>
    </Screen>
  );
}
