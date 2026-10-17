import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { RoastLevel } from '../../types';

interface RoastMeterProps {
  level: RoastLevel;
  showLabels?: boolean;
}

const ROAST_STAGES: { key: RoastLevel; label: string; color: string }[] = [
  { key: 'Light', label: 'Light', color: '#DFA067' },
  { key: 'Medium-Light', label: 'Med-Light', color: '#C47C3F' },
  { key: 'Medium', label: 'Medium', color: '#9C5825' },
  { key: 'Medium-Dark', label: 'Med-Dark', color: '#6F3714' },
  { key: 'Dark', label: 'Dark', color: '#3E1C07' },
];

export const RoastMeter: React.FC<RoastMeterProps> = ({
  level,
  showLabels = true,
}) => {
  const currentIndex = ROAST_STAGES.findIndex((stage) => stage.key === level);

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Roast Profile</Text>
          <Text style={styles.currentLevelText}>{level} Roast</Text>
        </View>
      )}

      <View style={styles.meterTrack}>
        {ROAST_STAGES.map((stage, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <View key={stage.key} style={styles.stageWrapper}>
              <View
                style={[
                  styles.segment,
                  {
                    backgroundColor: isActive ? stage.color : '#E5DDD2',
                    borderTopLeftRadius: index === 0 ? BorderRadius.full : 2,
                    borderBottomLeftRadius: index === 0 ? BorderRadius.full : 2,
                    borderTopRightRadius:
                      index === ROAST_STAGES.length - 1 ? BorderRadius.full : 2,
                    borderBottomRightRadius:
                      index === ROAST_STAGES.length - 1 ? BorderRadius.full : 2,
                  },
                ]}
              />
              {isCurrent && (
                <View
                  style={[
                    styles.currentPin,
                    { backgroundColor: stage.color, borderColor: '#FFFFFF' },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  headerTitle: {
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
    letterSpacing: 0.5,
  },
  currentLevelText: {
    ...Typography.labelLarge,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  meterTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 12,
  },
  stageWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    width: '100%',
    height: 6,
  },
  currentPin: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    top: -3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
