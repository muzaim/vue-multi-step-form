export interface MasterDataOption {
  value: string;
  label: string;
}

function simulateDelay(ms: number = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const masterDataApi = {
  /**
   * Mengambil daftar master kategori risiko
   */
  async getRiskCategories(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'operational', label: 'Operational Risk (Operasional & Sistem)' },
      { value: 'financial', label: 'Financial Risk (Finansial & Likuiditas)' },
      { value: 'cybersecurity', label: 'Cybersecurity & Data Privacy' },
      { value: 'compliance', label: 'Legal & Regulatory Compliance' },
      { value: 'reputational', label: 'Reputational & Brand Damage' },
    ];
  },

  /**
   * Mengambil daftar departemen organisasi
   */
  async getDepartments(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'IT Infrastructure & Cloud', label: 'IT Infrastructure & Cloud' },
      { value: 'Finance & Treasury', label: 'Finance & Treasury' },
      { value: 'Information Security (InfoSec)', label: 'Information Security (InfoSec)' },
      { value: 'Legal & Corporate Secretary', label: 'Legal & Corporate Secretary' },
      { value: 'Product & Engineering', label: 'Product & Engineering' },
      { value: 'People & Culture (HR)', label: 'People & Culture (HR)' },
    ];
  },

  /**
   * Mengambil daftar level dampak operasional
   */
  async getOperationalImpacts(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'negligible', label: 'Negligible (Dampak minor, sistem normal)' },
      { value: 'moderate', label: 'Moderate (Gangguan parsial < 2 jam)' },
      { value: 'severe', label: 'Severe (Downtime sistem inti 2-8 jam)' },
      { value: 'catastrophic', label: 'Catastrophic (Total outage > 24 jam)' },
    ];
  },

  /**
   * Mengambil daftar strategi mitigasi risiko
   */
  async getTreatmentStrategies(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'avoid', label: 'Avoid (Hentikan / eliminasi aktivitas berisiko)' },
      { value: 'mitigate', label: 'Mitigate (Terapkan kontrol mitigasi tambahan)' },
      { value: 'transfer', label: 'Transfer (Asuransi atau outsourcing SLA)' },
      { value: 'accept', label: 'Accept (Penerimaan risiko terukur)' },
    ];
  },

  /**
   * Mengambil daftar komite pengawas dewan komisaris / direksi
   */
  async getBoardCommittees(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'Audit & Risk Oversight Committee', label: 'Audit & Risk Oversight Committee' },
      { value: 'Cybersecurity Governance Board', label: 'Cybersecurity Governance Board' },
      { value: 'Executive Steering Council', label: 'Executive Steering Council' },
      { value: 'Compliance & Ethics Committee', label: 'Compliance & Ethics Committee' },
    ];
  },

  /**
   * Mengambil kategori kerugian akibat fraud
   */
  async getFraudLossCategories(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'asset_misappropriation', label: 'Asset Misappropriation (Penggelapan Aset & Dana)' },
      { value: 'procurement_kickback', label: 'Procurement Corruption & Vendor Kickback' },
      { value: 'financial_statement_fraud', label: 'Financial Statement Manipulation / Window Dressing' },
      { value: 'data_theft_espionage', label: 'Corporate Espionage & Customer Data Selling' },
      { value: 'unauthorized_transaction', label: 'Unauthorized Trading & Core Ledger Tampering' },
    ];
  },

  /**
   * Mengambil status pengamanan bukti digital & forensik
   */
  async getDigitalEvidenceStatuses(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'secured_quarantine', label: 'Secured & Isolated in Hardware Quarantine' },
      { value: 'forensic_image_verified', label: 'Bit-stream Forensic Image Created & Hash Verified' },
      { value: 'cloud_log_preserved', label: 'Immutable Cloud Audit Logs Preserved' },
      { value: 'in_progress', label: 'Evidence Collection & Imaging in Progress' },
    ];
  },

  /**
   * Mengambil daftar instansi penegak hukum yang berwenang
   */
  async getLawEnforcementAgencies(): Promise<MasterDataOption[]> {
    await simulateDelay();
    return [
      { value: 'kepolisian_tipidkor', label: 'Bareskrim Polri (Direktorat Tindak Pidana Korupsi/Siber)' },
      { value: 'kejaksaan_agung', label: 'Kejaksaan Agung RI (Jampidsus)' },
      { value: 'kpk', label: 'Komisi Pemberantasan Korupsi (KPK)' },
      { value: 'ojk_ppatk', label: 'OJK Penyidikan Sektor Jasa Keuangan & PPATK' },
    ];
  },
};
