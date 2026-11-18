<script setup lang="ts">
import RiskFormWizard from './features/risk-management/components/RiskFormWizard.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <header class="max-w-4xl mx-auto mb-6 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
        <span>Vue 3 + TypeScript + Pinia + Tailwind CSS Architecture</span>
      </div>
      <h1 class="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
        Enterprise Risk Management
      </h1>
      <p class="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
        Arsitektur multi-step form terstruktur memisahkan Presentation, Logic Composable, Centralized Pinia Store, dan Pure API Layer untuk 50 data fields.
      </p>
    </header>

    <!-- Main Wizard Component -->
    <main>
      <RiskFormWizard />
    </main>

    <!-- Architecture Footer Guide -->
    <footer class="max-w-4xl mx-auto mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
      <p>Clean Frontend Architecture &middot; Strict Linear Validation &middot; Dynamic Components with Keep-Alive</p>
    </footer>
  </div>
</template>
