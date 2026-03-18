<!-- src/components/editor/EMREditor.vue -->
<template>
  <div class="emr-editor">
    <el-row :gutter="20">
      <!-- 左侧引用面板 -->
      <el-col :span="6">
        <DataReferencePanel 
          @insert="handleInsert"
        />
      </el-col>
      
      <!-- 右侧编辑区 -->
      <el-col :span="18">
        <el-card class="editor-card" :body-style="{ padding: '20px' }">
          <!-- 患者信息栏 -->
          <div class="patient-info" v-if="currentPatient">
            <el-tag type="info">患者：{{ currentPatient.name }}</el-tag>
            <el-tag>{{ currentPatient.gender }} {{ currentPatient.age }}岁</el-tag>
            <el-tag type="success">床号：{{ currentPatient.bedNumber }}</el-tag>
            <el-tag type="warning">诊断：{{ currentPatient.diagnosis }}</el-tag>
          </div>
          
          <!-- 结构化表单 -->
          <StructuredForm 
            v-model:chiefComplaint="chiefComplaint"
            v-model:presentIllness="presentIllness"
            v-model:diagnoses="diagnoses"
          />
          
          <el-divider content-position="left">病历内容</el-divider>
          
          <!-- 使用 QuillEditor -->
          <div class="editor-wrapper">
            <QuillEditor 
              ref="editorRef"
              v-model="richTextContent"
              @update:modelValue="handleContentChange"
            />
          </div>
          
          <!-- 底部操作栏 -->
          <div class="editor-footer">
            <div class="footer-left">
              <span class="word-count">字数：{{ wordCount }}</span>
              <span class="save-status" :class="{ 'saved': isSaved }">
                {{ isSaved ? '已保存' : '保存中...' }}
              </span>
            </div>
            <div class="footer-right">
              <el-button @click="handlePreview">预览</el-button>
              <el-button type="primary" @click="handleSave" :loading="saving">
                保存病历
              </el-button>
              <el-button type="success" @click="handleSubmit">
                提交
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 草稿恢复提示 -->
    <DraftRecoveryBar 
      v-if="showDraftRecovery"
      @restore="restoreDraft"
      @ignore="ignoreDraft"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEmrStore } from '@/stores/emrStore'
import { usePatientStore } from '@/stores/patientStore'
import DataReferencePanel from './DataReferencePanel.vue'
import StructuredForm from './StructuredForm.vue'
import QuillEditor from './QuillEditor.vue'
import DraftRecoveryBar from '../common/DraftRecoveryBar.vue'
import { autoSave, loadDraft, clearDraft, hasDraft } from '@/utils/autoSave'
import { formatReferenceItem } from '@/utils/ruleEngine'

const emrStore = useEmrStore()
const patientStore = usePatientStore()

// 双向绑定数据
const chiefComplaint = ref(emrStore.chiefComplaint)
const presentIllness = ref(emrStore.presentIllness)
const diagnoses = ref(emrStore.diagnoses)
const richTextContent = ref(emrStore.richTextContent)

// UI状态
const saving = ref(false)
const isSaved = ref(true)
const showDraftRecovery = ref(false)
const editorRef = ref(null)

// 当前患者
const currentPatient = computed(() => patientStore.currentPatient)

// 字数统计
const wordCount = computed(() => {
  const text = richTextContent.value.replace(/<[^>]*>/g, '')
  return text.length
})

// 监听变化，触发自动保存
watch([chiefComplaint, presentIllness, diagnoses, richTextContent], () => {
  isSaved.value = false
  updateStore()
  autoSave()
}, { deep: true })

// 更新store
function updateStore() {
  emrStore.setChiefComplaint(chiefComplaint.value)
  emrStore.setPresentIllness(presentIllness.value)
  emrStore.diagnoses = diagnoses.value
  emrStore.richTextContent = richTextContent.value
}

// 处理插入引用
function handleInsert(items) {
  items.forEach(item => {
    const formattedText = formatReferenceItem(item)
    if (editorRef.value) {
      editorRef.value.insertReference?.(formattedText, item.type, item.id)
    }
  })
  ElMessage.success(`已插入 ${items.length} 项引用`)
}

// 处理内容变化
function handleContentChange(content) {
  richTextContent.value = content
}

// 保存病历
async function handleSave() {
  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateStore()
    isSaved.value = true
    clearDraft()
    ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}

// 预览
function handlePreview() {
  ElMessage.info('预览功能开发中')
}

// 提交
function handleSubmit() {
  ElMessageBox.confirm('确认提交病历？提交后将不可修改', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    handleSave()
    ElMessage.success('提交成功')
  })
}

// 草稿恢复
function restoreDraft() {
  const draft = loadDraft()
  if (draft) {
    chiefComplaint.value = draft.chiefComplaint
    presentIllness.value = draft.presentIllness
    diagnoses.value = draft.diagnoses
    richTextContent.value = draft.richTextContent
    showDraftRecovery.value = false
    ElMessage.success('草稿已恢复')
  }
}

function ignoreDraft() {
  clearDraft()
  showDraftRecovery.value = false
}

// 检查草稿
onMounted(() => {
  if (hasDraft() && !emrStore.richTextContent) {
    showDraftRecovery.value = true
  }
})
</script>

<style scoped>
.emr-editor {
  height: 100%;
  padding: 0;
}

.editor-card {
  min-height: calc(100vh - 120px);
}

.patient-info {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.patient-info .el-tag {
  margin-right: 10px;
}

.editor-wrapper {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  min-height: 400px;
  margin-bottom: 20px;
  background-color: #fff;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e4e7ed;
}

.footer-left {
  font-size: 14px;
  color: #909399;
}

.save-status {
  margin-left: 15px;
  color: #e6a23c;
}

.save-status.saved {
  color: #67c23a;
}
</style>