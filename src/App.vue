<template>
  <div class="app-container">
    <AppHeader
      :is-online="isOnline"
      :answered-count="answeredCount"
      :percent="progressPercent"
    />

    <DraftBanner
      :show="hasDraft && !isSubmitted"
      :draft-info="draftInfo"
      @restore="onRestoreDraft"
      @clear="clearDraft"
    />

    <StepNav
      v-if="!isSubmitted"
      :current-step="currentStep"
      @change-step="onStepClick"
    />

    <main class="main-content">
      <template v-if="!isSubmitted">
        <!-- Step 0: General Info -->
        <SectionGeneral
          v-if="currentStep === 0"
          :form="form"
          @next="currentStep = 1"
        />

        <!-- Step 1: Behavior (Questions 9-23) -->
        <SectionBehavior
          v-else-if="currentStep === 1"
          :form="form"
          @back="currentStep = 0"
          @next="currentStep = 2"
        />

        <!-- Step 2: Symptoms -->
        <SectionSymptoms
          v-else-if="currentStep === 2"
          :form="form"
          @back="currentStep = 1"
          @next="currentStep = 3"
        />

        <!-- Step 3: Result Summary -->
        <SectionResult
          v-else-if="currentStep === 3"
          :form="form"
          @go-step="goToStep"
          @submit="onSubmitForm"
        />

        <!-- Step 4: Blood Test & Chemicals -->
        <SectionBlood
          v-else-if="currentStep === 4"
          :form="form"
          @back="currentStep = 3"
          @submit="onSubmitForm"
        />
      </template>

      <!-- Success Screen -->
      <SuccessScreen
        v-else
        :name="submittedData.name"
        :id="submittedData.id"
        :submit-time="submittedData.time"
        :sync-status="submittedData.status"
        @reset="onResetApp"
      />
    </main>

    <ToastMessage
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import StepNav from './components/StepNav.vue'
import DraftBanner from './components/DraftBanner.vue'
import ToastMessage from './components/ToastMessage.vue'
import SectionGeneral from './components/SectionGeneral.vue'
import SectionBehavior from './components/SectionBehavior.vue'
import SectionSymptoms from './components/SectionSymptoms.vue'
import SectionResult from './components/SectionResult.vue'
import SectionBlood from './components/SectionBlood.vue'
import SuccessScreen from './components/SuccessScreen.vue'

import { useFormData } from './composables/useFormData'
import { useSync } from './composables/useSync'
import { validateThaiCitizenId } from './composables/useThaiId'
import { qAdata, qBdata, calculateRisk } from './composables/useRiskMatrix'

const { form, hasDraft, draftInfo, loadDraft, clearDraft } = useFormData()
const { isOnline, sendPayload } = useSync()

const currentStep = ref<number>(0)
const isSubmitted = ref<boolean>(false)

// Smooth scroll to top on every step change (Next, Back, StepNav, Review links)
watch(currentStep, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const submittedData = reactive({
  name: '',
  id: '',
  time: '',
  status: ''
})

const toast = reactive<{
  visible: boolean
  message: string
  type: 'success' | 'error'
}>({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimer: ReturnType<typeof setTimeout> | null = null
const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.message = msg
  toast.type = type
  toast.visible = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.visible = false }, 3500)
}

const answeredCount = computed(() => Object.keys(form.answers).length)
const progressPercent = computed(() => Math.round((answeredCount.value / 15) * 100))

const checkCanAccess = (targetStep: number): boolean => {
  if (targetStep === 0) return true
  const idRaw = (form.id_card || '').replace(/\D/g, '')
  if (!idRaw || idRaw.length < 13 || !form.fullname || !form.hospital) {
    showToast('กรุณากรอกเลขบัตรประชาชน, ชื่อ-นามสกุล และสถานบริการสุขภาพในส่วนที่ 1 ให้ครบถ้วน', 'error')
    currentStep.value = 0
    return false
  }
  if (!validateThaiCitizenId(idRaw)) {
    showToast('หมายเลขบัตรประชาชนไม่ถูกต้องตามสูตรคำนวณ 13 หลัก', 'error')
    currentStep.value = 0
    return false
  }
  if (targetStep >= 2 && answeredCount.value < 15) {
    showToast(`กรุณาตอบคำถามพฤติกรรมให้ครบทุกข้อ (${answeredCount.value}/15 ข้อ)`, 'error')
    currentStep.value = 1
    return false
  }
  return true
}

const onStepClick = (stepIndex: number) => {
  if (checkCanAccess(stepIndex)) {
    currentStep.value = stepIndex
  }
}

const goToStep = (stepIndex: number) => {
  currentStep.value = stepIndex
}

const onRestoreDraft = () => {
  loadDraft()
  showToast('✅ กู้คืนข้อมูลฉบับร่างครบถ้วนแล้ว')
}

const buildPayload = () => {
  let scA = 0, scB = 0
  qAdata.forEach(q => { scA += (form.answers[q.n] || 0) })
  qBdata.forEach(q => { scB += (form.answers[q.n] || 0) })
  const scTot = scA + scB

  let sg = 0
  if (form.symptoms_g3.length > 0) sg = 3
  else if (form.symptoms_g2.length > 0) sg = 2
  else if (form.symptoms_g1.length > 0) sg = 1
  const sgLabel = ['ไม่มีอาการ', 'กลุ่มที่ 1', 'กลุ่มที่ 2', 'กลุ่มที่ 3'][sg]

  const { risk } = calculateRisk(scTot, sg)

  const qAns: Record<string, any> = {}
  for (let i = 9; i <= 23; i++) {
    qAns['q' + i] = form.answers[i] !== undefined ? form.answers[i] : '-'
  }

  return {
    survey_date: form.survey_date,
    id_card: (form.id_card || '').replace(/\D/g, ''),
    id_card_formatted: form.id_card,
    prefix: form.prefix,
    fullname: form.fullname,
    gender: form.gender,
    age: form.age,
    address: form.address,
    tambon: form.tambon,
    amphoe: 'บ้านแพ้ว',
    province: 'สมุทรสาคร',
    road: form.road,
    occupation: form.occupation,
    crop_category: form.crop_category,
    crop_type: form.crop_category ? ('ทำ' + form.crop_category + (form.crop_detail ? ' (' + form.crop_detail + ')' : '')) : form.crop_detail,
    involvement: form.involvement,
    hospital: form.hospital,
    interviewer: form.interviewer,
    interviewer_pos: form.interviewer_pos,
    score_a: scA,
    score_b: scB,
    score_total: scTot,
    symptom_group: sgLabel,
    risk_level: risk,
    symptoms_g1: form.symptoms_g1,
    symptoms_g2: form.symptoms_g2,
    symptoms_g3: form.symptoms_g3,
    disease: form.disease,
    med_pyridostigmine: form.med_pyridostigmine,
    last_exposure: form.last_exposure,
    days_per_month: form.days_per_month,
    chem_purpose: form.chem_purpose,
    chem1_trade: form.chems[0]?.trade || '', chem1_common: form.chems[0]?.common || '',
    chem2_trade: form.chems[1]?.trade || '', chem2_common: form.chems[1]?.common || '',
    chem3_trade: form.chems[2]?.trade || '', chem3_common: form.chems[2]?.common || '',
    chem4_trade: form.chems[3]?.trade || '', chem4_common: form.chems[3]?.common || '',
    chem5_trade: form.chems[4]?.trade || '', chem5_common: form.chems[4]?.common || '',
    blood_result: form.blood_result || 'ไม่ได้ตรวจ',
    ...qAns
  }
}

const onSubmitForm = async () => {
  const payload = buildPayload()
  submittedData.name = form.fullname || 'ไม่ระบุชื่อ'
  submittedData.id = form.id_card || '—'
  submittedData.time = new Date().toLocaleString('th-TH')

  const res = await sendPayload(payload)
  submittedData.status = res.ok ? 'success' : 'offline'

  clearDraft()
  isSubmitted.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const onResetApp = () => {
  window.location.reload()
}
</script>

<style scoped>
.app-container { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { max-width: 660px; margin: 0 auto; width: 100%; padding: 1.25rem 1rem 5rem; flex: 1; }
</style>
