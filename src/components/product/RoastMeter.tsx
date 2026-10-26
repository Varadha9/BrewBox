// React is required for JSX rendering.
import React from 'react';

// StyleSheet, Text, View are core React Native layout and display primitives.
import { StyleSheet, Text, View } from 'react-native';

// Design tokens for consistent colors, spacing, and typography.
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

// RoastLevel is the TypeScript union type: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark'
import { RoastLevel } from '../../types';

// ── RoastMeterProps ───────────────────────────────────────────────────────────
interface RoastMeterProps {
  level: RoastLevel;      // The roast level to display (e.g. 'Light', 'Medium-Dark')
  showLabels?: boolean;   // Whether to show the "Roast Profile" header and level text
}

// ── ROAST_STAGES ──────────────────────────────────────────────────────────────
// Defines the 5 roast stages with their display labels and corresponding colors.
// Colors progress from golden light roast (#DFA067) to near-black dark roast (#3E1C07).
// This array drives both the visual segments and the active pin position.
const ROAST_STAGES: { key: RoastLevel; label: string; color: string }[] = [
  { key: 'Light',       label: 'Light',     color: '#DFA067' },
  { key: 'Medium-Light',label: 'Med-Light', color: '#C47C3F' },
  { key: 'Medium',      label: 'Medium',    color: '#9C5825' },
  { key: 'Medium-Dark', label: 'Med-Dark',  color: '#6F3714' },
  { key: 'Dark',        label: 'Dark',      color: '#3E1C07' },
];

// ── RoastMeter ────────────────────────────────────────────────────────────────
// A custom visual component that displays a product's roast level as a
// 5-segment horizontal gauge with a pin pointer at the active stage.
//
// HOW IT WORKS:
// 1. We find the index of the current roast level in ROAST_STAGES.
// 2. We render 5 segments — segments at or before the current index are colored,
//    segments after are shown in a neutral grey (#E5DDD2).
// 3. A small circular "pin" is rendered on top of the active segment.
//
// This simulates the look of a physical roast dial on a coffee roasting machine.
export const RoastMeter: React.FC<RoastMeterProps> = ({
  level,
  showLabels = true,
}) => {
  // Find which index (0-4) corresponds to the current roast level.
  const currentIndex = ROAST_STAGES.findIndex((stage) => stage.key === level);

  return (
    <View style={styles.container}>
      {/* Header row: "Roast Profile" label on the left, active level name on the right */}
      {showLabels && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Roast Profile</Text>
          <Text style={styles.currentLevelText}>{level} Roast</Text>
        </View>
      )}

      {/* The 5-segment meter track */}
      <View style={styles.meterTrack}>
        {ROAST_STAGES.map((stage, index) => {
          const isActive = index <= currentIndex;  // All segments up to current are colored
          const isCurrent = index === currentIndex; // Only the exact current stage gets the pin

          return (
            <View key={stage.key} style={styles.stageWrapper}>
              {/* Colored segment — active stages use the roast color, inactive use grey */}
              <View
                style={[
                  styles.segment,
                  {
                    backgroundColor: isActive ? stage.color : '#E5DDD2',
                    // Round the left end of the first segment and right end of the last
                    borderTopLeftRadius: index === 0 ? BorderRadius.full : 2,
                    borderBottomLeftRadius: index === 0 ? BorderRadius.full : 2,
                    borderTopRightRadius:
                      index === ROAST_STAGES.length - 1 ? BorderRadius.full : 2,
                    borderBottomRightRadius:
                      index === ROAST_STAGES.length - 1 ? BorderRadius.full : 2,
                  },
                ]}
              />

              {/* Active pin: a small circle that sits on top of the current stage segment */}
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
  // The horizontal row that holds all 5 segments side by side.
  meterTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 12,
  },
  // Each segment wrapper takes equal flex space (flex: 1 on each = equal widths).
  stageWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // The colored bar segment itself.
  segment: {
    width: '100%',
    height: 6,
  },
  // The circular pin indicator that marks the current roast level.
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
