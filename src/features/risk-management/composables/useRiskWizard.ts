import { ref, computed, watch, unref, type MaybeRefOrGetter } from 'vue';
import type { ValidationErrors } from '../schemas/riskValidation';

export function useRiskWizard(totalStepsSource: MaybeRefOrGetter<number>) {
  const currentStep = ref(1);
  const stepErrors = ref<ValidationErrors>({});

  const totalSteps = computed(() => {
    const val = typeof totalStepsSource === 'function' ? totalStepsSource() : unref(totalStepsSource);
    return val > 0 ? val : 1;
  });

  const isFirstStep = computed(() => currentStep.value === 1);
  const isLastStep = computed(() => currentStep.value === totalSteps.value);
  const progressPercentage = computed(() => {
    if (totalSteps.value <= 1) return 100;
    return Math.round(((currentStep.value - 1) / (totalSteps.value - 1)) * 100);
  });

  // Bounds guard: if totalSteps decreases while user is on an escalated step, safely clamp
  watch(totalSteps, (maxSteps) => {
    if (currentStep.value > maxSteps) {
      currentStep.value = maxSteps;
      stepErrors.value = {};
    }
  });

  /**
   * Attempts to advance to the next step.
   * If a validation function is supplied and returns errors, progression is blocked.
   */
  function nextStep(validateCurrentStage?: () => { isValid: boolean; errors: ValidationErrors }): boolean {
    if (validateCurrentStage) {
      const validation = validateCurrentStage();
      if (!validation.isValid) {
        stepErrors.value = validation.errors;
        return false;
      }
    }

    stepErrors.value = {};
    if (!isLastStep.value) {
      currentStep.value++;
      return true;
    }
    return false;
  }

  /**
   * Free navigation backward without validation barriers.
   */
  function prevStep(): void {
    if (!isFirstStep.value) {
      stepErrors.value = {};
      currentStep.value--;
    }
  }

  /**
   * Navigate to a previous step directly.
   */
  function goToStep(targetStep: number): boolean {
    if (targetStep < currentStep.value && targetStep >= 1) {
      stepErrors.value = {};
      currentStep.value = targetStep;
      return true;
    }
    return false;
  }

  function clearErrors(): void {
    stepErrors.value = {};
  }

  return {
    currentStep,
    totalSteps,
    stepErrors,
    isFirstStep,
    isLastStep,
    progressPercentage,
    nextStep,
    prevStep,
    goToStep,
    clearErrors,
  };
}
