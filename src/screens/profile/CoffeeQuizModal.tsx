import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BespokeIcon, CustomButton } from '../../components';
import { PRODUCTS } from '../../data';
import { useUserStore } from '../../store';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../theme';
import { Product } from '../../types';

interface CoffeeQuizModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

const QUESTIONS = [
  {
    id: 'method',
    title: 'How do you brew your daily cup?',
    subtitle: 'This helps us match the grind size and bean solubility.',
    options: [
      { id: 'Hario V60', label: 'Pour Over / V60', icon: 'pourover' },
      { id: 'Espresso', label: 'Espresso Machine', icon: 'cup' },
      { id: 'French Press', label: 'French Press', icon: 'french-press' },
      { id: 'AeroPress', label: 'AeroPress / Moka Pot', icon: 'cup' },
    ],
  },
  {
    id: 'taste',
    title: 'What flavors excite your palate?',
    subtitle: 'Choose the sensory profile that makes you smile.',
    options: [
      {
        id: 'Bright & Fruity',
        label: 'Bright & Fruity',
        desc: 'Jasmine, peach, citrus, sparkling acidity',
      },
      {
        id: 'Balanced & Sweet',
        label: 'Balanced & Sweet',
        desc: 'Honeycomb, cane jaggery, red apple, caramel',
      },
      {
        id: 'Dark & Chocolaty',
        label: 'Dark & Chocolaty',
        desc: '70% dark cocoa, roasted pecan, molasses, rich body',
      },
      {
        id: 'Adventurous',
        label: 'Wild & Experimental',
        desc: 'Anaerobic naturals, boozy fruit, winey notes',
      },
    ],
  },
  {
    id: 'milk',
    title: 'Do you drink it black or with milk?',
    subtitle: 'Some beans are designed to punch through milk velvety smooth.',
    options: [
      { id: 'Black / Straight', label: 'Black / Clean / Filter', icon: 'cup' },
      { id: 'Oat Milk', label: 'Oat Milk Flat White', icon: 'cup' },
      { id: 'Dairy Milk', label: 'Whole Dairy Milk Cappuccino', icon: 'cup' },
    ],
  },
];

export const CoffeeQuizModal: React.FC<CoffeeQuizModalProps> = ({
  visible,
  onClose,
  onSelectProduct,
}) => {
  const { updateTasteProfile } = useUserStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState('Hario V60');
  const [selectedTaste, setSelectedTaste] = useState<'Bright & Fruity' | 'Balanced & Sweet' | 'Dark & Chocolaty' | 'Adventurous'>('Bright & Fruity');
  const [selectedMilk, setSelectedMilk] = useState<'Black / Straight' | 'Oat Milk' | 'Dairy Milk' | 'Cold Foam'>('Black / Straight');
  const [isCompleted, setIsCompleted] = useState(false);

  const matchedProduct = PRODUCTS.find((p) => {
    if (selectedTaste === 'Bright & Fruity') return p.id === 'prod-ethiopia-idido';
    if (selectedTaste === 'Dark & Chocolaty') return p.id === 'prod-sumatra-gayo-dark' || p.id === 'prod-velvet-obsidian-blend';
    if (selectedTaste === 'Balanced & Sweet') return p.id === 'prod-chikmagalur-estate';
    return p.id === 'prod-panama-geisha';
  }) || PRODUCTS[0];

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      updateTasteProfile({
        preferredBrewMethods: [selectedMethod],
        tasteLeaning: selectedTaste,
        milkPreference: selectedMilk,
      });
      setIsCompleted(true);
    }
  };

  const handleFinish = () => {
    setIsCompleted(false);
    setCurrentStep(0);
    onClose();
    if (onSelectProduct && matchedProduct) {
      onSelectProduct(matchedProduct);
    }
  };

  const currentQ = QUESTIONS[currentStep];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.modalSubtitle}>PALATE MATCHER QUIZ</Text>
              <Text style={styles.modalTitle}>
                {isCompleted ? 'Your Palate Profile' : `Question ${currentStep + 1} of ${QUESTIONS.length}`}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <BespokeIcon name="close" size={22} color={Colors.light.textPrimary} />
            </Pressable>
          </View>

          {/* Progress bar */}
          {!isCompleted && (
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` },
                ]}
              />
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            {!isCompleted ? (
              <View style={styles.questionSection}>
                <Text style={styles.questionTitle}>{currentQ.title}</Text>
                <Text style={styles.questionSubtitle}>{currentQ.subtitle}</Text>

                <View style={styles.optionsList}>
                  {currentQ.options.map((opt) => {
                    const isSelected =
                      currentStep === 0
                        ? selectedMethod === opt.id
                        : currentStep === 1
                        ? selectedTaste === opt.id
                        : selectedMilk === opt.id;

                    return (
                      <Pressable
                        key={opt.id}
                        onPress={() => {
                          if (currentStep === 0) setSelectedMethod(opt.id);
                          if (currentStep === 1) setSelectedTaste(opt.id as any);
                          if (currentStep === 2) setSelectedMilk(opt.id as any);
                        }}
                        style={[
                          styles.optionCard,
                          isSelected && styles.optionCardSelected,
                        ]}
                      >
                        <View style={styles.optionContent}>
                          <Text
                            style={[
                              styles.optionLabel,
                              isSelected && styles.optionLabelSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                          {'desc' in opt && (
                            <Text style={styles.optionDesc}>
                              {opt.desc}
                            </Text>
                          )}
                        </View>

                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : (
              /* Completed Results Screen */
              <View style={styles.resultSection}>
                <View style={styles.personaBadge}>
                  <BespokeIcon name="sparkles" size={18} color={Colors.light.primary} />
                  <Text style={styles.personaBadgeText}>
                    {selectedTaste} Connoisseur
                  </Text>
                </View>

                <Text style={styles.resultHeading}>
                  We found your perfect roaster match!
                </Text>
                <Text style={styles.resultDesc}>
                  Based on your preference for {selectedMethod} and {selectedMilk}, our head roaster recommends this exceptional single origin:
                </Text>

                {/* Recommended Product Preview Card */}
                <View style={styles.matchedCard}>
                  <Text style={styles.matchedOrigin}>
                    {matchedProduct.origin}
                  </Text>
                  <Text style={styles.matchedName}>{matchedProduct.name}</Text>
                  <Text style={styles.matchedTagline}>
                    {matchedProduct.tagline}
                  </Text>

                  <View style={styles.notesRow}>
                    {matchedProduct.tastingNotes.map((note) => (
                      <Text key={note} style={styles.notePill}>
                        • {note}
                      </Text>
                    ))}
                  </View>

                  <Text style={styles.matchedPrice}>
                    {matchedProduct.currency}
                    {matchedProduct.basePrice}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            {!isCompleted ? (
              <CustomButton
                title={
                  currentStep === QUESTIONS.length - 1
                    ? 'Reveal My Palate Match'
                    : 'Next Step'
                }
                onPress={handleNext}
                size="large"
                fullWidth
              />
            ) : (
              <CustomButton
                title="View Recommended Roast"
                onPress={handleFinish}
                size="large"
                fullWidth
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 14, 10, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    letterSpacing: 1.2,
  },
  modalTitle: {
    ...Typography.titleLarge,
    color: Colors.light.espresso,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#EAE1D2',
    borderRadius: BorderRadius.full,
    marginVertical: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
  },
  questionSection: {
    paddingVertical: Spacing.md,
  },
  questionTitle: {
    ...Typography.titleLarge,
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  questionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  optionCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primarySubtle,
  },
  optionContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  optionLabel: {
    ...Typography.titleSmall,
    color: Colors.light.textPrimary,
  },
  optionLabelSelected: {
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  optionDesc: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.light.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  resultSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  personaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF3E8',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#E8DCB8',
    marginBottom: Spacing.md,
  },
  personaBadgeText: {
    ...Typography.labelLarge,
    color: Colors.light.primaryDark,
    fontWeight: '700',
  },
  resultHeading: {
    ...Typography.titleLarge,
    color: Colors.light.espresso,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  resultDesc: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  matchedCard: {
    width: '100%',
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Shadows.soft,
  },
  matchedOrigin: {
    ...Typography.labelSmall,
    color: Colors.light.primaryDark,
    textTransform: 'uppercase',
  },
  matchedName: {
    ...Typography.titleMedium,
    color: Colors.light.textPrimary,
    marginVertical: 4,
  },
  matchedTagline: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  notesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  notePill: {
    ...Typography.bodySmall,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  matchedPrice: {
    ...Typography.priceMedium,
    color: Colors.light.textPrimary,
  },
  footer: {
    marginTop: Spacing.xl,
  },
});
