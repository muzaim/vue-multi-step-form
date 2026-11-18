<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    label?: string;
    hint?: string;
    disabled?: boolean;
    hasError?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: 4,
    disabled: false,
    hasError: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void;
}>();

const scoreOptions = [
  { value: 1, label: '1 - Minimal (Negligible Exposure)' },
  { value: 2, label: '2 - Very Low (Insignificant Risk)' },
  { value: 3, label: '3 - Low (Acceptable Boundary)' },
  { value: 4, label: '4 - Minor (Routine Monitoring)' },
  { value: 5, label: '5 - Moderate (Standard Oversight)' },
  { value: 6, label: '6 - Noticeable (Requires Active Focus)' },
  { value: 7, label: '7 - High (Significant Risk Exposure)' },
  { value: 8, label: '8 - Elevated (Urgent Priority)' },
  { value: 9, label: '9 - Severe (Immediate Intervention)' },
  { value: 10, label: '10 - Critical (Maximum Severity Impact)' },
];

const selectedRatingBadge = computed(() => {
  const v = props.modelValue;
  if (v <= 3) {
    return {
      label: 'Low',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }
  if (v <= 6) {
    return {
      label: 'Medium',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    };
  }
  if (v <= 8) {
    return {
      label: 'High',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  }
  return {
    label: 'Critical',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  };
});

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', Number(target.value));
}
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between">
      <label v-if="label" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {{ label }}
      </label>
      <span
        class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md border"
        :class="selectedRatingBadge.badgeClass"
      >
        Factor: {{ modelValue }}/10 &middot; {{ selectedRatingBadge.label }}
      </span>
    </div>

    <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>

    <div class="relative">
      <select
        :value="modelValue"
        :disabled="disabled"
        @change="onChange"
        class="w-full pl-3.5 pr-8 py-2 text-sm text-slate-800 bg-white border rounded-lg shadow-sm transition-colors appearance-none focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400"
        :class="[
          hasError
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400',
        ]"
      >
        <option v-for="opt in scoreOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <p v-if="hasError && errorMessage" class="text-xs text-rose-600">
      {{ errorMessage }}
    </p>
  </div>
</template>
