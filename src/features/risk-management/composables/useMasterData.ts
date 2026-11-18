import { ref } from 'vue';
import { masterDataApi, type MasterDataOption } from '../api/masterDataApi';

// Shared module-level state untuk caching opsi agar tidak re-fetch berulang kali
const riskCategories = ref<MasterDataOption[]>([]);
const departments = ref<MasterDataOption[]>([]);
const operationalImpacts = ref<MasterDataOption[]>([]);
const treatmentStrategies = ref<MasterDataOption[]>([]);
const boardCommittees = ref<MasterDataOption[]>([]);

// Master data khusus fraud
const fraudLossCategories = ref<MasterDataOption[]>([]);
const digitalEvidenceStatuses = ref<MasterDataOption[]>([]);
const lawEnforcementAgencies = ref<MasterDataOption[]>([]);

const isLoading = ref(false);
const error = ref<string | null>(null);
let hasLoaded = false;

export function useMasterData() {
  async function loadAllMasterData(forceReload = false) {
    if (hasLoaded && !forceReload) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const [
        categoriesRes,
        deptRes,
        impactsRes,
        strategiesRes,
        committeesRes,
        fraudLossRes,
        evidenceRes,
        lawEnforceRes,
      ] = await Promise.all([
        masterDataApi.getRiskCategories(),
        masterDataApi.getDepartments(),
        masterDataApi.getOperationalImpacts(),
        masterDataApi.getTreatmentStrategies(),
        masterDataApi.getBoardCommittees(),
        masterDataApi.getFraudLossCategories(),
        masterDataApi.getDigitalEvidenceStatuses(),
        masterDataApi.getLawEnforcementAgencies(),
      ]);

      riskCategories.value = categoriesRes;
      departments.value = deptRes;
      operationalImpacts.value = impactsRes;
      treatmentStrategies.value = strategiesRes;
      boardCommittees.value = committeesRes;

      fraudLossCategories.value = fraudLossRes;
      digitalEvidenceStatuses.value = evidenceRes;
      lawEnforcementAgencies.value = lawEnforceRes;

      hasLoaded = true;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat master data';
    } finally {
      isLoading.value = false;
    }
  }

  // Trigger load jika belum pernah dimuat
  if (!hasLoaded && !isLoading.value) {
    loadAllMasterData();
  }

  return {
    riskCategories,
    departments,
    operationalImpacts,
    treatmentStrategies,
    boardCommittees,
    fraudLossCategories,
    digitalEvidenceStatuses,
    lawEnforcementAgencies,
    isLoading,
    error,
    reload: () => loadAllMasterData(true),
  };
}
