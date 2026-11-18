<script setup lang="ts">
import type { StepConfig } from '../types/risk.types';

defineProps<{
  steps: StepConfig[];
  currentStep: number;
  progressPercentage: number;
  isEscalated?: boolean;
}>();

const emit = defineEmits<{
  (e: 'navigate', stepNumber: number): void;
}>();

function handleStepClick(stepNumber: number, currentStep: number) {
  // Free backward navigation
  if (stepNumber < currentStep) {
    emit('navigate', stepNumber);
  }
}
</script>

<template>
  <div class="bg-white border-b border-slate-200 px-6 py-5">
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Stage {{ currentStep }} of {{ steps.length }}
          </span>
          <span
            v-if="isEscalated"
            class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
          >
            Escalation Active (8 Stages)
          </span>
          <span
            v-else
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200"
          >
            Standard Workflow (5 Stages)
          </span>
        </div>
        <h1 class="text-lg font-extrabold text-slate-800">
          {{ steps[currentStep - 1]?.title }}
        </h1>
      </div>
      <div class="text-right">
        <span class="text-xs font-semibold text-slate-500">Overall Progress</span>
        <div class="text-base font-black text-indigo-600">{{ progressPercentage }}%</div>
      </div>
    </div>

    <!-- Linear Progress Bar -->
    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
      <div
        class="h-full transition-all duration-300 ease-out"
        :class="isEscalated ? 'bg-rose-500' : 'bg-indigo-600'"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <!-- Stepper Breadcrumb Pills -->
    <div
      class="grid gap-2"
      :class="steps.length > 5 ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8' : 'grid-cols-2 md:grid-cols-5'"
    >
      <button
        v-for="step in steps"
        :key="step.id"
        type="button"
        @click="handleStepClick(step.id, currentStep)"
        :disabled="step.id > currentStep"
        class="flex items-center gap-2 p-2 rounded-lg text-left transition text-xs border"
        :class="[
          step.id === currentStep
            ? step.isEscalatedStep
              ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold shadow-sm'
              : 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-bold shadow-sm'
            : step.id < currentStep
            ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer'
            : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed opacity-60'
        ]"
      >
        <span
          class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0"
          :class="[
            step.id === currentStep
              ? step.isEscalatedStep ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
              : step.id < currentStep
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-200 text-slate-600'
          ]"
        >
          <svg v-if="step.id < currentStep" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ step.id }}</span>
        </span>
        <div class="truncate">
          <p class="truncate text-[11px] leading-tight">{{ step.title }}</p>
        </div>
      </button>
    </div>
  </div>
</template>
