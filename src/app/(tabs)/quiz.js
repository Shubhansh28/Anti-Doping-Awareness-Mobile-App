import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import ProgressBar from '../../../components/ProgressBar';
import Screen from '../../../components/Screen';
import SectionHeader from '../../../components/SectionHeader';
import SurfaceCard from '../../../components/SurfaceCard';
import { colors, spacing } from '../../../constants/theme';
import categories from '../../../data/quizCategories.json';
import allQuestions from '../../../data/quizQuestions.json';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizTab() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [quizState, setQuizState] = useState('categories'); // 'categories' | 'instructions' | 'active' | 'results'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: optionIndex }

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.id === selectedCategoryId) || categories[0],
    [selectedCategoryId],
  );

  const activeQuestions = useMemo(() => {
    if (!selectedCategoryId) return [];
    return allQuestions.filter((q) => q.categoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;

  function handleSelectCategory(categoryId) {
    setSelectedCategoryId(categoryId);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizState('instructions');
  }

  function handleStartQuiz() {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizState('active');
  }

  function handleSelectOption(optionIndex) {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  function handleJumpToQuestion(index) {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }

  function handleConfirmSubmit() {
    const unanswered = totalQuestions - answeredCount;
    if (unanswered > 0) {
      Alert.alert(
        'Unanswered Questions',
        `You still have ${unanswered} unanswered question${
          unanswered > 1 ? 's' : ''
        }. Would you like to review or submit now?`,
        [
          { text: 'Review', style: 'cancel' },
          {
            text: 'Submit anyway',
            style: 'destructive',
            onPress: () => setQuizState('results'),
          },
        ],
      );
    } else {
      setQuizState('results');
    }
  }

  function handleRetakeQuiz() {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizState('active');
  }

  function handleBackToCategories() {
    if (quizState === 'active' && answeredCount > 0) {
      Alert.alert(
        'Exit Quiz?',
        'Your current progress in this quiz will be lost if you leave now.',
        [
          { text: 'Keep playing', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => {
              setSelectedCategoryId(null);
              setUserAnswers({});
              setCurrentQuestionIndex(0);
              setQuizState('categories');
            },
          },
        ],
      );
    } else {
      setSelectedCategoryId(null);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setQuizState('categories');
    }
  }

  // Calculate results
  const scoreData = useMemo(() => {
    if (quizState !== 'results' || !activeQuestions.length) {
      return { score: 0, percentage: 0, correctCount: 0, incorrectCount: 0 };
    }

    let correctCount = 0;
    activeQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const score = correctCount;
    const percentage = Math.round((correctCount / activeQuestions.length) * 100);
    return {
      score,
      percentage,
      correctCount,
      incorrectCount: activeQuestions.length - correctCount,
    };
  }, [quizState, activeQuestions, userAnswers]);

  /* -------------------------------------------------------------
     RENDER: CATEGORIES LIST VIEW
  ------------------------------------------------------------- */
  if (quizState === 'categories' || !selectedCategoryId) {
    return (
      <Screen>
        <SectionHeader
          eyebrow="KNOWLEDGE CHECK"
          title="Anti-doping quizzes"
          description="Test and reinforce your clean sport knowledge through interactive, bite-sized quizzes."
        />

        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <AppText variant="heading" color={colors.white}>
              ✓
            </AppText>
          </View>
          <View style={styles.bannerCopy}>
            <AppText variant="label" color="#D5E9DC">
              PRACTICE & LEARN
            </AppText>
            <AppText variant="heading" color={colors.white} style={styles.bannerTitle}>
              Test your clean sport instincts
            </AppText>
            <AppText color="#E0EFE7" variant="caption">
              Learn the rules before competition. Select a category below to begin.
            </AppText>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <AppText variant="heading">Choose a topic</AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {categories.length} categories
          </AppText>
        </View>

        <View style={styles.categoryList}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityLabel={`Select ${category.title} quiz`}
              onPress={() => handleSelectCategory(category.id)}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.pressedCard,
              ]}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIconContainer}>
                  <AppText variant="heading" color={colors.primary}>
                    {category.symbol}
                  </AppText>
                </View>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <AppText variant="label" color={colors.primary}>
                      {category.questionCount} QUESTIONS
                    </AppText>
                  </View>
                  <View style={styles.badgeMuted}>
                    <AppText variant="caption" color={colors.textSecondary}>
                      ~{category.estimatedMinutes} mins
                    </AppText>
                  </View>
                </View>
              </View>

              <View style={styles.categoryDetails}>
                <AppText variant="heading" style={styles.categoryTitle}>
                  {category.title}
                </AppText>
                <AppText variant="caption" color={colors.primaryDark} style={styles.categorySubtitle}>
                  {category.subtitle}
                </AppText>
                <AppText color={colors.textSecondary} style={styles.categoryDescription}>
                  {category.description}
                </AppText>
              </View>

              <View style={styles.cardFooter}>
                <AppText variant="button" color={colors.primary}>
                  Take quiz  →
                </AppText>
              </View>
            </Pressable>
          ))}
        </View>

        <SurfaceCard style={styles.tipCard}>
          <AppText variant="label" color={colors.primary}>
            WHY TAKE QUIZZES?
          </AppText>
          <AppText color={colors.textSecondary}>
            Regular knowledge checks help you remember sample collection steps,
            understand strict liability, and prevent unintentional anti-doping rule
            violations.
          </AppText>
        </SurfaceCard>
      </Screen>
    );
  }

  /* -------------------------------------------------------------
     RENDER: INSTRUCTIONS VIEW
  ------------------------------------------------------------- */
  if (quizState === 'instructions') {
    return (
      <Screen>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to quiz categories"
          onPress={handleBackToCategories}
          hitSlop={8}
          style={styles.backButton}
        >
          <AppText variant="button" color={colors.primary}>
            ←  All quiz categories
          </AppText>
        </Pressable>

        <View style={styles.instructionsHeader}>
          <View style={styles.categoryIconLarge}>
            <AppText variant="display" color={colors.primary}>
              {activeCategory.symbol}
            </AppText>
          </View>
          <View style={styles.instructionsTitleGroup}>
            <AppText variant="label" color={colors.primary}>
              QUIZ INSTRUCTIONS
            </AppText>
            <AppText variant="display" style={styles.headerDisplay}>
              {activeCategory.title}
            </AppText>
            <AppText color={colors.textSecondary}>
              {activeCategory.subtitle}
            </AppText>
          </View>
        </View>

        <SurfaceCard style={styles.summaryCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <AppText variant="display" color={colors.primary}>
                {activeCategory.questionCount}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Questions
              </AppText>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <AppText variant="display" color={colors.primary}>
                80%
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Pass Target
              </AppText>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <AppText variant="display" color={colors.primary}>
                {activeCategory.estimatedMinutes}m
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Pace
              </AppText>
            </View>
          </View>
        </SurfaceCard>

        <View style={styles.rulesContainer}>
          <AppText variant="heading">How it works</AppText>

          <SurfaceCard style={styles.ruleCard}>
            <View style={styles.ruleNumber}>
              <AppText variant="button" color={colors.primary}>
                1
              </AppText>
            </View>
            <View style={styles.ruleText}>
              <AppText variant="heading" style={styles.ruleHeading}>
                Read each question carefully
              </AppText>
              <AppText color={colors.textSecondary} variant="caption">
                Every question has 4 options. Select the one that best reflects
                anti-doping rules and clean sport principles.
              </AppText>
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.ruleCard}>
            <View style={styles.ruleNumber}>
              <AppText variant="button" color={colors.primary}>
                2
              </AppText>
            </View>
            <View style={styles.ruleText}>
              <AppText variant="heading" style={styles.ruleHeading}>
                Navigate at your own pace
              </AppText>
              <AppText color={colors.textSecondary} variant="caption">
                Use the Previous and Next buttons to review questions or change
                your chosen answer at any time before submitting.
              </AppText>
            </View>
          </SurfaceCard>

          <SurfaceCard style={styles.ruleCard}>
            <View style={styles.ruleNumber}>
              <AppText variant="button" color={colors.primary}>
                3
              </AppText>
            </View>
            <View style={styles.ruleText}>
              <AppText variant="heading" style={styles.ruleHeading}>
                Immediate educational feedback
              </AppText>
              <AppText color={colors.textSecondary} variant="caption">
                After submission, review correct answers and read explanations
                grounded in official NADA India and WADA guidance.
              </AppText>
            </View>
          </SurfaceCard>
        </View>

        <View style={styles.actionButtonGroup}>
          <PrimaryButton
            label="Start quiz now"
            onPress={handleStartQuiz}
          />
        </View>
      </Screen>
    );
  }

  /* -------------------------------------------------------------
     RENDER: ACTIVE QUIZ VIEW
  ------------------------------------------------------------- */
  if (quizState === 'active') {
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const selectedOption = userAnswers[currentQuestion?.id];

    return (
      <Screen>
        {/* Top Header */}
        <View style={styles.activeTopBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Exit quiz"
            onPress={handleBackToCategories}
            hitSlop={8}
            style={styles.exitButton}
          >
            <AppText variant="button" color={colors.primary}>
              ✕  Exit
            </AppText>
          </Pressable>
          <View style={styles.categoryBadge}>
            <AppText variant="label" color={colors.primaryDark}>
              {activeCategory.title.toUpperCase()}
            </AppText>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <AppText variant="heading" style={styles.questionCounterText}>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {answeredCount} of {totalQuestions} answered
            </AppText>
          </View>
          <ProgressBar
            progress={(currentQuestionIndex + 1) / totalQuestions}
            style={styles.progressBar}
          />

          {/* Question Dots indicator */}
          <View style={styles.dotsRow}>
            {activeQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              return (
                <Pressable
                  key={q.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Go to question ${idx + 1}`}
                  onPress={() => handleJumpToQuestion(idx)}
                  style={[
                    styles.dot,
                    isAnswered && styles.dotAnswered,
                    isCurrent && styles.dotCurrent,
                  ]}
                >
                  <AppText
                    variant="label"
                    style={[
                      styles.dotText,
                      isCurrent && styles.dotTextCurrent,
                      !isCurrent && isAnswered && styles.dotTextAnswered,
                    ]}
                  >
                    {idx + 1}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Question Card */}
        {currentQuestion ? (
          <SurfaceCard style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionTag}>
                <AppText variant="label" color={colors.primary}>
                  QUESTION {currentQuestionIndex + 1}
                </AppText>
              </View>
            </View>

            <AppText variant="heading" style={styles.questionText}>
              {currentQuestion.question}
            </AppText>

            <View style={styles.optionsList}>
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                return (
                  <Pressable
                    key={optIdx}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Option ${OPTION_LETTERS[optIdx]}: ${option}`}
                    onPress={() => handleSelectOption(optIdx)}
                    style={({ pressed }) => [
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                      pressed && styles.pressedOption,
                    ]}
                  >
                    <View
                      style={[
                        styles.letterCircle,
                        isSelected && styles.letterCircleSelected,
                      ]}
                    >
                      <AppText
                        variant="button"
                        color={isSelected ? colors.white : colors.primary}
                      >
                        {OPTION_LETTERS[optIdx]}
                      </AppText>
                    </View>
                    <AppText
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </SurfaceCard>
        ) : null}

        {/* Navigation Buttons */}
        <View style={styles.activeNavRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous question"
            disabled={isFirstQuestion}
            onPress={handlePreviousQuestion}
            style={[
              styles.navButtonSecondary,
              isFirstQuestion && styles.navButtonDisabled,
            ]}
          >
            <AppText
              variant="button"
              color={isFirstQuestion ? colors.border : colors.primary}
            >
              ←  Previous
            </AppText>
          </Pressable>

          {!isLastQuestion ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next question"
              onPress={handleNextQuestion}
              style={styles.navButtonPrimary}
            >
              <AppText variant="button" color={colors.white}>
                Next  →
              </AppText>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Submit quiz"
              onPress={handleConfirmSubmit}
              style={styles.submitButton}
            >
              <AppText variant="button" color={colors.white}>
                Submit quiz  ✓
              </AppText>
            </Pressable>
          )}
        </View>

        {isLastQuestion && answeredCount < totalQuestions ? (
          <AppText variant="caption" color={colors.textSecondary} style={styles.unansweredNotice}>
            Note: You have {totalQuestions - answeredCount} unanswered question
            {totalQuestions - answeredCount > 1 ? 's' : ''}. Tap any number above to complete.
          </AppText>
        ) : null}
      </Screen>
    );
  }

  /* -------------------------------------------------------------
     RENDER: RESULTS VIEW
  ------------------------------------------------------------- */
  const isPassed = scoreData.percentage >= 80;

  return (
    <Screen>
      <View style={styles.resultsHeader}>
        <View style={styles.resultsBadgeContainer}>
          <AppText variant="label" color={colors.primary}>
            {activeCategory.title.toUpperCase()} · QUIZ RESULTS
          </AppText>
        </View>

        {/* Score Overview Card */}
        <SurfaceCard
          style={[
            styles.scoreOverviewCard,
            isPassed ? styles.scoreCardPassed : styles.scoreCardReview,
          ]}
        >
          <View style={styles.scoreCircle}>
            <AppText variant="display" color={isPassed ? colors.primary : '#B71C1C'}>
              {scoreData.percentage}%
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {scoreData.correctCount} of {totalQuestions} correct
            </AppText>
          </View>

          <View style={styles.scoreMessageGroup}>
            <AppText variant="heading" style={styles.scoreTitle}>
              {isPassed ? 'Clean Sport Champion! 🏅' : 'Keep Learning! 📖'}
            </AppText>
            <AppText color={colors.textSecondary}>
              {isPassed
                ? 'Excellent work! You demonstrated a clear and responsible understanding of clean sport standards.'
                : 'Good effort! Review the detailed explanations below to reinforce your knowledge before your next test.'}
            </AppText>
          </View>

          <View style={styles.statBreakdownRow}>
            <View style={styles.statBox}>
              <AppText variant="heading" color={colors.primary}>
                {scoreData.correctCount}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Correct
              </AppText>
            </View>
            <View style={styles.statBoxDivider} />
            <View style={styles.statBox}>
              <AppText variant="heading" color="#C62828">
                {scoreData.incorrectCount}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Incorrect
              </AppText>
            </View>
            <View style={styles.statBoxDivider} />
            <View style={styles.statBox}>
              <AppText variant="heading" color={colors.text}>
                80%
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Passing Mark
              </AppText>
            </View>
          </View>
        </SurfaceCard>

        {/* Action Buttons */}
        <View style={styles.resultsActionRow}>
          <PrimaryButton
            label="Retake this quiz"
            onPress={handleRetakeQuiz}
            style={styles.retakeButton}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose another quiz"
            onPress={handleBackToCategories}
            style={styles.anotherQuizButton}
          >
            <AppText variant="button" color={colors.primary}>
              Choose another quiz
            </AppText>
          </Pressable>
        </View>

        {/* Question-by-Question Detailed Review */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewHeadingRow}>
            <AppText variant="heading">Detailed answer review</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {totalQuestions} questions
            </AppText>
          </View>

          <View style={styles.reviewList}>
            {activeQuestions.map((question, qIdx) => {
              const userAnswer = userAnswers[question.id];
              const isCorrect = userAnswer === question.correctIndex;
              const hasAnswered = userAnswer !== undefined;

              return (
                <SurfaceCard key={question.id} style={styles.reviewCard}>
                  {/* Status header */}
                  <View style={styles.reviewCardHeader}>
                    <View
                      style={[
                        styles.reviewStatusBadge,
                        isCorrect
                          ? styles.statusBadgeCorrect
                          : styles.statusBadgeIncorrect,
                      ]}
                    >
                      <AppText
                        variant="label"
                        color={isCorrect ? colors.primary : '#C62828'}
                      >
                        {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                      </AppText>
                    </View>
                    <AppText variant="caption" color={colors.textSecondary}>
                      Question {qIdx + 1}
                    </AppText>
                  </View>

                  <AppText variant="heading" style={styles.reviewQuestionText}>
                    {question.question}
                  </AppText>

                  {/* Options review */}
                  <View style={styles.reviewOptionsList}>
                    {question.options.map((opt, optIdx) => {
                      const isUserChoice = userAnswer === optIdx;
                      const isCorrectChoice = question.correctIndex === optIdx;

                      let rowStyle = styles.reviewOptionNormal;
                      let labelText = null;
                      let labelColor = colors.textSecondary;

                      if (isCorrectChoice) {
                        rowStyle = styles.reviewOptionCorrect;
                        labelText = 'Correct answer';
                        labelColor = colors.primary;
                      } else if (isUserChoice && !isCorrect) {
                        rowStyle = styles.reviewOptionWrong;
                        labelText = 'Your answer';
                        labelColor = '#C62828';
                      }

                      return (
                        <View key={optIdx} style={[styles.reviewOptionRow, rowStyle]}>
                          <View style={styles.reviewLetterBadge}>
                            <AppText
                              variant="button"
                              color={
                                isCorrectChoice
                                  ? colors.primary
                                  : isUserChoice
                                  ? '#C62828'
                                  : colors.textSecondary
                              }
                            >
                              {OPTION_LETTERS[optIdx]}
                            </AppText>
                          </View>
                          <View style={styles.reviewOptionContent}>
                            <AppText style={styles.reviewOptionText}>
                              {opt}
                            </AppText>
                            {labelText ? (
                              <AppText
                                variant="caption"
                                color={labelColor}
                                style={styles.reviewChoiceLabel}
                              >
                                {isUserChoice && isCorrectChoice
                                  ? '✓ Your answer (Correct)'
                                  : labelText}
                              </AppText>
                            ) : null}
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {!hasAnswered ? (
                    <AppText variant="caption" color="#C62828">
                      You did not answer this question.
                    </AppText>
                  ) : null}

                  {/* Explanation Box */}
                  <View style={styles.explanationBox}>
                    <AppText variant="label" color={colors.primary}>
                      EXPLANATION
                    </AppText>
                    <AppText color={colors.text} style={styles.explanationText}>
                      {question.explanation}
                    </AppText>
                  </View>
                </SurfaceCard>
              );
            })}
          </View>
        </View>

        {/* Bottom Back Button */}
        <View style={styles.bottomNavSection}>
          <PrimaryButton
            label="Back to all quizzes"
            onPress={handleBackToCategories}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  /* Banner */
  bannerCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  bannerIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  bannerCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  bannerTitle: {
    fontSize: 20,
    lineHeight: 26,
  },

  /* Categories */
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.lg,
  },
  categoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeMuted: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  categoryDetails: {
    gap: spacing.xs,
  },
  categoryTitle: {
    fontSize: 19,
    lineHeight: 25,
  },
  categorySubtitle: {
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    alignSelf: 'flex-start',
    paddingTop: spacing.xs,
  },
  tipCard: {
    backgroundColor: colors.primarySoft,
    borderColor: '#D5E9DC',
    gap: spacing.xs,
  },
  pressedCard: {
    opacity: 0.8,
  },

  /* Instructions */
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  instructionsHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  categoryIconLarge: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  instructionsTitleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  headerDisplay: {
    fontSize: 26,
    lineHeight: 32,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  metaDivider: {
    backgroundColor: colors.border,
    height: 36,
    width: StyleSheet.hairlineWidth,
  },
  rulesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  ruleCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  ruleNumber: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  ruleText: {
    flex: 1,
    gap: spacing.xs,
  },
  ruleHeading: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionButtonGroup: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  /* Active Quiz */
  activeTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  exitButton: {
    paddingVertical: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  progressContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  progressTextRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionCounterText: {
    fontSize: 18,
    lineHeight: 24,
  },
  progressBar: {
    height: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  dot: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  dotAnswered: {
    backgroundColor: '#D5E9DC',
    borderColor: colors.primary,
  },
  dotCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  dotTextAnswered: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dotTextCurrent: {
    color: colors.white,
    fontWeight: '700',
  },
  questionCard: {
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  questionHeader: {
    alignItems: 'flex-start',
  },
  questionTag: {
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  questionText: {
    fontSize: 20,
    lineHeight: 27,
  },
  optionsList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  optionCardSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  pressedOption: {
    opacity: 0.85,
  },
  letterCircle: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  letterCircleSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  activeNavRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  navButtonSecondary: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonPrimary: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  unansweredNotice: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  /* Results */
  resultsHeader: {
    gap: spacing.lg,
  },
  resultsBadgeContainer: {
    alignSelf: 'flex-start',
  },
  scoreOverviewCard: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  scoreCardPassed: {
    borderColor: '#C2E0CE',
    backgroundColor: '#F5FAF7',
  },
  scoreCardReview: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFF8F8',
  },
  scoreCircle: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  scoreMessageGroup: {
    alignItems: 'center',
    gap: spacing.xs,
    textAlign: 'center',
  },
  scoreTitle: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  statBreakdownRow: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statBoxDivider: {
    backgroundColor: colors.border,
    width: StyleSheet.hairlineWidth,
  },
  resultsActionRow: {
    gap: spacing.md,
  },
  retakeButton: {
    minHeight: 50,
  },
  anotherQuizButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderRadius: 14,
    borderWidth: 1.5,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  reviewSection: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  reviewHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewList: {
    gap: spacing.md,
  },
  reviewCard: {
    gap: spacing.md,
    padding: spacing.md,
  },
  reviewCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewStatusBadge: {
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  statusBadgeCorrect: {
    backgroundColor: colors.primarySoft,
  },
  statusBadgeIncorrect: {
    backgroundColor: '#FFEBEE',
  },
  reviewQuestionText: {
    fontSize: 17,
    lineHeight: 23,
  },
  reviewOptionsList: {
    gap: spacing.sm,
  },
  reviewOptionRow: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.sm,
    alignItems: 'flex-start',
  },
  reviewOptionNormal: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  reviewOptionCorrect: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  reviewOptionWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  reviewLetterBadge: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  reviewOptionContent: {
    flex: 1,
    gap: 2,
  },
  reviewOptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  reviewChoiceLabel: {
    fontWeight: '700',
    fontSize: 11,
  },
  explanationBox: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    padding: spacing.md,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 21,
  },
  bottomNavSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});
