import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { GrindOption } from '../../types';
import { BespokeIcon } from '../common/BespokeIcon';

interface GrindSelectorProps {
  availableGrinds: GrindOption[];
  selectedGrind: GrindOption;
  onSelectGrind: (grind: GrindOption) => void;
}

const GRIND_DESCRIPTIONS: Record<string, { icon: string; desc: string }> = {
  'Whole Bean': { icon: 'coffee-bean', desc: 'Grind at home right before brewing' },
  'Espresso (Fine)': { icon: 'cup', desc: 'Fine sand, for 9-bar espresso machines' },
  'Moka Pot': { icon: 'cup', desc: 'Medium-fine for stovetop extraction' },
  Aeropress: { icon: 'cup', desc: 'Smooth balanced extraction' },
  'Pour Over / V60 (Medium)': { icon: 'pourover', desc: 'Kosher salt, optimal drawdown' },
  'French Press (Coarse)': { icon: 'french-press', desc: 'Coarse sea salt crystals' },
  'Cold Brew (Extra Coarse)': { icon: 'cup', desc: 'Cracked peppercorns, long steep' },
};

export const GrindSelector: React.FC<GrindSelectorProps> = ({
  availableGrinds,
  selectedGrind,
  onSelectGrind,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grind Selection</Text>
        <Text style={styles.hint}>Ground fresh upon dispatch</Text>
      </View>

      <View style={styles.list}>
        {availableGrinds.map((grind) => {
          const isSelected = grind === selectedGrind;
          const meta = GRIND_DESCRIPTIONS[grind] || {
            icon: 'coffee-bean',
            desc: 'Custom grind profile',
          };

          return (
            <Pressable
              key={grind}
              onPress={() => onSelectGrind(grind)}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
            >
              <View style={styles.iconCol}>
                <BespokeIcon
                  name={meta.icon}
                  size={20}
                  color={isSelected ? Colors.light.primary : Colors.light.textSecondary}
                />
              </View>

              <View style={styles.infoCol}>
                <Text
                  style={[
                    styles.grindName,
                    isSelected && styles.grindNameSelected,
                  ]}
                >
                  {grind}
                </Text>
                <Text style={styles.grindDesc}>{meta.desc}</Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  hint: {
    ...Typography.bodySmall,
    color: Colors.light.primaryDark,
    fontStyle: 'italic',
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  cardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySubtle,
  },
  iconCol: {
    width: 32,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  infoCol: {
    flex: 1,
  },
  grindName: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  grindNameSelected: {
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  grindDesc: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  radioOuterSelected: {
    borderColor: Colors.light.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
});
