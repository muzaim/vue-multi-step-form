<script setup lang="ts">
interface OptionItem {
  label: string;
  value: string | number;
}

withDefaults(
  defineProps<{
    modelValue: string | number;
    options: OptionItem[];
    placeholder?: string;
    hasError?: boolean;
    disabled?: boolean;
  }>(),
  {
    placeholder: 'Select an option',
    hasError: false,
    disabled: false,
  }
);

defineEmits<{
  (e: 'update:modelValue', val: any): void;
}>();
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    class="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400"
    :class="[
      hasError
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400'
    ]"
  >
    <option value="" disabled>{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>
