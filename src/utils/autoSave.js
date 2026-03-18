// src/utils/autoSave.js
import { debounce } from 'lodash-es'
import { useEmrStore } from '@/stores/emrStore'  // 确保导入名称正确

// 自动保存（防抖30秒）
export const autoSave = debounce(() => {
  try {
    const emrStore = useEmrStore()
    const state = emrStore.fullState
    
    // 计算简单哈希
    const hash = btoa(JSON.stringify(state))
    state.draftHash = hash
    
    localStorage.setItem('emrDraft', JSON.stringify(state))
    console.log('草稿已自动保存', new Date().toLocaleTimeString())
  } catch (error) {
    console.error('自动保存失败:', error)
  }
}, 30000)

// 手动保存
export function manualSave() {
  try {
    const emrStore = useEmrStore()
    const state = emrStore.fullState
    const hash = btoa(JSON.stringify(state))
    state.draftHash = hash
    localStorage.setItem('emrDraft', JSON.stringify(state))
    return true
  } catch (error) {
    console.error('手动保存失败:', error)
    return false
  }
}

// 加载草稿
export function loadDraft() {
  const draft = localStorage.getItem('emrDraft')
  if (!draft) return null
  try {
    return JSON.parse(draft)
  } catch (error) {
    console.error('加载草稿失败:', error)
    return null
  }
}

// 清除草稿
export function clearDraft() {
  localStorage.removeItem('emrDraft')
}

// 检查是否有草稿
export function hasDraft() {
  return localStorage.getItem('emrDraft') !== null
}