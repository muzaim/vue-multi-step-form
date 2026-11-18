<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number;
    type?: string;
    placeholder?: string;
    hasError?: boolean;
    disabled?: boolean;
  }>(),
  {
    type: 'text',
    placeholder: '',
    hasError: false,
    disabled: false,
  }
);

defineEmits<{
  (e: 'update:modelValue', val: any): void;
}>();
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="$emit('update:modelValue', type === 'number' ? Number(($event.target as HTMLInputElement).value) : ($event.target as HTMLInputElement).value)"
    class="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400"
    :class="[
      hasError
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400'
    ]"
  />
</template>
