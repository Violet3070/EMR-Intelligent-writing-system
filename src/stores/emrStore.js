// src/stores/emrStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEmrStore = defineStore('emr', () => {
  // 结构化字段
  const chiefComplaint = ref('')  // 主诉
  const presentIllness = ref('急性')  // 现病史类型
  const diagnoses = ref([])  // 诊断列表
  
  // 患者信息
  const currentPatient = ref(null)
  
  // 富文本内容
  const richTextContent = ref('')
  
  // 引用记录
  const referenceRecords = ref([])
  
  // 草稿哈希
  const draftHash = ref('')
  
  // 更新方法
  function setChiefComplaint(value) {
    chiefComplaint.value = value
  }
  
  function setPresentIllness(value) {
    presentIllness.value = value
  }
  
  function addDiagnosis(diagnosis) {
    diagnoses.value.push(diagnosis)
  }
  
  function removeDiagnosis(index) {
    diagnoses.value.splice(index, 1)
  }
  
  function setCurrentPatient(patient) {
    currentPatient.value = patient
  }
  
  function addReferenceRecord(record) {
    referenceRecords.value.push(record)
  }
  
  // 完整状态（用于保存）
  const fullState = computed(() => ({
    chiefComplaint: chiefComplaint.value,
    presentIllness: presentIllness.value,
    diagnoses: diagnoses.value,
    currentPatient: currentPatient.value,
    richTextContent: richTextContent.value,
    referenceRecords: referenceRecords.value,
    draftHash: draftHash.value
  }))
  
  // 恢复状态
  function restoreState(state) {
    chiefComplaint.value = state.chiefComplaint || ''
    presentIllness.value = state.presentIllness || '急性'
    diagnoses.value = state.diagnoses || []
    currentPatient.value = state.currentPatient || null
    richTextContent.value = state.richTextContent || ''
    referenceRecords.value = state.referenceRecords || []
    draftHash.value = state.draftHash || ''
  }
  
  // 重置状态
  function $reset() {
    chiefComplaint.value = ''
    presentIllness.value = '急性'
    diagnoses.value = []
    currentPatient.value = null
    richTextContent.value = ''
    referenceRecords.value = []
    draftHash.value = ''
  }
  
  return {
    chiefComplaint,
    presentIllness,
    diagnoses,
    currentPatient,
    richTextContent,
    referenceRecords,
    draftHash,
    setChiefComplaint,
    setPresentIllness,
    addDiagnosis,
    removeDiagnosis,
    setCurrentPatient,
    addReferenceRecord,
    fullState,
    restoreState,
    $reset
  }
})