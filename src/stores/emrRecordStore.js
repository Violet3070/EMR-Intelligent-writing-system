// src/stores/emrRecordStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEmrRecordStore = defineStore('emrRecord', () => {
  // 最近编辑的病历记录
  const recentEmrRecords = ref([
    { 
      id: 'emr_001',
      patientId: 'p001',
      patientName: '张明',
      gender: '男',
      age: 45,
      type: '入院记录',
      createTime: '2026-03-17 09:30',
      status: 'pending',
      alert: { level: 'warning', message: '入院记录应在8小时内完成，已超时2小时' }
    },
    { 
      id: 'emr_002',
      patientId: 'p002',
      patientName: '李芳',
      gender: '女',
      age: 52,
      type: '病程记录',
      createTime: '2026-03-16 14:20',
      status: 'pending',
      alert: { level: 'error', message: '病程记录应在24小时内完成，已超时5小时' } // 将 danger 改为 error
    },
    { 
      id: 'emr_003',
      patientId: 'p003',
      patientName: '王伟',
      gender: '男',
      age: 38,
      type: '出院小结',
      createTime: '2026-03-17 15:45',
      status: 'completed',
      alert: null
    }
  ])

  // 更新病历状态为已完成
  function updateRecordStatus(patientId, emrId) {
    console.log('更新病历状态:', patientId, emrId)
    
    // 查找匹配的病历记录
    const record = recentEmrRecords.value.find(r => r.id === emrId || r.patientId === patientId)
    
    if (record) {
      console.log('找到记录，更新状态:', record)
      record.status = 'completed'
      record.alert = null
      
      // 触发响应式更新 - 重新赋值数组
      recentEmrRecords.value = [...recentEmrRecords.value]
    } else {
      console.log('未找到匹配的记录，创建新记录')
      // 获取当前时间
      const now = new Date()
      const timeStr = now.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-')
      
      // 创建新记录
      const newRecord = {
        id: emrId,
        patientId: patientId,
        patientName: '张明', // 这里应该从患者信息获取，暂时用默认值
        gender: '男',
        age: 45,
        type: '病历记录',
        createTime: timeStr,
        status: 'completed',
        alert: null
      }
      recentEmrRecords.value = [newRecord, ...recentEmrRecords.value]
    }
  }

  // 添加新病历记录
  function addRecord(record) {
    recentEmrRecords.value = [record, ...recentEmrRecords.value]
  }

  // 获取告警列表
  const alerts = computed(() => {
    return recentEmrRecords.value
      .map(record => record.alert)
      .filter(alert => alert !== null)
  })

  // 获取待办数量
  const pendingCount = computed(() => {
    return recentEmrRecords.value.filter(r => r.status === 'pending').length
  })

  // 获取告警数量
  const alertCount = computed(() => alerts.value.length)

  return {
    recentEmrRecords,
    alerts,
    pendingCount,
    alertCount,
    updateRecordStatus,
    addRecord
  }
})