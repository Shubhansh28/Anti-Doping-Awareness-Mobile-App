import AppText from './AppText';
import Screen from './Screen';
import SectionHeader from './SectionHeader';
import SurfaceCard from './SurfaceCard';
import { colors } from '../constants/theme';

export default function SectionLanding({
  title,
  description,
  cardTitle,
  cardDescription,
}) {
  return (
    <Screen>
      <SectionHeader
        eyebrow="CLEAN SPORT"
        title={title}
        description={description}
      />
      <SurfaceCard>
        <AppText variant="label" color={colors.primary}>
          {cardTitle}
        </AppText>
        <AppText color={colors.textSecondary}>{cardDescription}</AppText>
      </SurfaceCard>
    </Screen>
  );
}
