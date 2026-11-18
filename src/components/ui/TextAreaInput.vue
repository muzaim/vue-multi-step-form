<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    rows?: number;
    hasError?: boolean;
    disabled?: boolean;
  }>(),
  {
    placeholder: '',
    rows: 3,
    hasError: false,
    disabled: false,
  }
);

defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();
</script>

<template>
  <textarea
    :value="modelValue"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    class="w-full px-3.5 py-2 text-sm text-slate-800 bg-white border rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 resize-y"
    :class="[
      hasError
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 hover:border-slate-400'
    ]"
  ></textarea>
</template>
