import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { TasteProfile } from '../../types';

interface TasteProfileBarProps {
  profile: TasteProfile;
}

interface AttributeRowProps {
  label: string;
  value: number; // 1-5
  color: string;
}

const AttributeRow: React.FC<AttributeRowProps> = ({ label, value, color }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.attributeLabel}>{label}</Text>
      <View style={styles.barContainer}>
        {[1, 2, 3, 4, 5].map((step) => {
          const filled = step <= value;
          return (
            <View
              key={step}
              style={[
                styles.segment,
                {
                  backgroundColor: filled ? color : '#E8E0D5',
                },
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.valueText}>{value}/5</Text>
    </View>
  );
};

export const TasteProfileBar: React.FC<TasteProfileBarProps> = ({ profile }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sensory Taste Profile</Text>

      <AttributeRow
        label="Acidity / Brightness"
        value={profile.acidity}
        color="#D97736"
      />
      <AttributeRow
        label="Natural Sweetness"
        value={profile.sweetness}
        color="#D4A373"
      />
      <AttributeRow
        label="Body & Mouthfeel"
        value={profile.body}
        color="#8B5E3C"
      />
      <AttributeRow
        label="Bitterness & Depth"
        value={profile.bitterness}
        color="#4A3525"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
  },
  attributeLabel: {
    width: 130,
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 8,
  },
  segment: {
    flex: 1,
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  valueText: {
    width: 32,
    textAlign: 'right',
    ...Typography.labelSmall,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
});
