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
  if (stepNumber < currentStep) {
    emit('navigate', stepNumber);
  }
}
</script>

<template>
  <div class="bg-white border-b border-slate-200 px-5 py-3.5 space-y-2.5">
    <!-- Compact Header: Stage info + Progress -->
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 min-w-0">
        <span
          class="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0"
        >
          {{ currentStep }}
        </span>
        <div class="truncate">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Stage {{ currentStep }} / {{ steps.length }}
            </span>
            <span
              v-if="isEscalated"
              class="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200"
            >
              8 Stages (Escalated)
            </span>
            <span
              v-else
              class="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200"
            >
              5 Stages
            </span>
          </div>
          <h2 class="text-sm font-bold text-slate-900 truncate">
            {{ steps[currentStep - 1]?.title }}
          </h2>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="text-xs font-mono font-bold text-slate-700">{{ progressPercentage }}%</span>
      </div>
    </div>

    <!-- Segmented Tracker Bar -->
    <div class="flex items-center gap-1 w-full" :title="`Stage ${currentStep}: ${steps[currentStep - 1]?.title}`">
      <button
        v-for="step in steps"
        :key="step.id"
        type="button"
        @click="handleStepClick(step.id, currentStep)"
        :disabled="step.id > currentStep"
        class="h-1.5 rounded-full transition-all flex-1"
        :class="[
          step.id === currentStep
            ? 'bg-slate-900 ring-2 ring-slate-900/20'
            : step.id < currentStep
            ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer'
            : 'bg-slate-200 cursor-not-allowed'
        ]"
        :title="`Stage ${step.id}: ${step.title}`"
      ></button>
    </div>

    <!-- Micro Breadcrumb Pills -->
    <div class="flex items-center gap-1 overflow-x-auto text-[11px] text-slate-500 py-0.5 no-scrollbar">
      <span
        v-for="(step, idx) in steps"
        :key="step.id"
        class="whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors"
        @click="handleStepClick(step.id, currentStep)"
        :class="[
          step.id === currentStep ? 'font-bold text-slate-900' :
          step.id < currentStep ? 'text-slate-600 hover:text-slate-900' :
          'text-slate-300 cursor-not-allowed'
        ]"
      >
        <span v-if="idx > 0" class="text-slate-300 font-normal mr-0.5">&rsaquo;</span>
        <span
          v-if="step.id < currentStep"
          class="text-emerald-600 font-bold"
        >&check;</span>
        <span>{{ step.title.split(' ')[0] }}</span>
      </span>
    </div>
  </div>
</template>
