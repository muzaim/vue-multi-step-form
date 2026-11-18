<script setup lang="ts">
import RiskFormWizard from './features/risk-management/components/RiskFormWizard.vue';
</script>

<template>
  <div class="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8 text-slate-900">
    <!-- Polished SaaS Header -->
    <header class="max-w-4xl mx-auto mb-6 text-center">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold mb-3">
        <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
        <span>Enterprise Risk Management Engine</span>
      </div>
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
        Governance & Risk Assessment Portal
      </h1>
      <p class="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
        Structured dual-track evaluation with automated benchmark scoring, discrete factor controls, and dynamic escalation protocols.
      </p>
    </header>

    <!-- Main Wizard Component -->
    <main>
      <RiskFormWizard />
    </main>

    <!-- Clean Architecture Footer -->
    <footer class="max-w-4xl mx-auto mt-10 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
      <p>Clean Enterprise Architecture &middot; Linear Multi-Step Validation &middot; Dynamic Branching (5 vs 8 Stages)</p>
    </footer>
  </div>
</template>
