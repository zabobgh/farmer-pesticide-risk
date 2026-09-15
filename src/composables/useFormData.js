import { reactive, watch, ref } from 'vue'

const DRAFT_KEY = 'nbk156_draft'

export function useFormData() {
  const form = reactive({
    id_card: '',
    prefix: 'นาย',
    fullname: '',
    gender: 'ชาย',
    age: '',
    address: '',
    tambon: '',
    amphoe: 'บ้านแพ้ว',
    province: 'สมุทรสาคร',
    road: '',
    occupation: '',
    crop_category: '',
    crop_detail: '',
    involvement: [],
    hospital: '',
    survey_date: new Date().toISOString().split('T')[0],
    interviewer: '',
    interviewer_pos: '',

    // คำตอบข้อ 9-23
    answers: {},

    // อาการ
    symptoms_g1: [],
    symptoms_g2: [],
    symptoms_g3: [],

    // ส่วนที่ 5
    disease: [],
    med_pyridostigmine: '',
    last_exposure: '',
    days_per_month: '',
    chem_purpose: [],
    chems: [
      { trade: '', common: '' },
      { trade: '', common: '' },
      { trade: '', common: '' },
      { trade: '', common: '' },
      { trade: '', common: '' }
    ],
    blood_result: ''
  })

  const hasDraft = ref(false)
  const draftInfo = ref(null)

  // ตรวจสอบ Draft
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const d = JSON.parse(raw)
      if (d.id_card && d.fullname && (Date.now() - (d.ts || 0)) < 86400000 * 2) {
        hasDraft.value = true
        draftInfo.value = {
          fullname: d.fullname,
          time: d.ts ? new Date(d.ts).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''
        }
      }
    }
  } catch (e) {}

  const syncGender = (prefix) => {
    if (prefix === 'นาย') form.gender = 'ชาย'
    else if (prefix === 'นาง' || prefix === 'นางสาว') form.gender = 'หญิง'
  }

  // Watch prefix to ensure gender is always strictly synced
  watch(() => form.prefix, (newVal) => {
    syncGender(newVal)
  }, { immediate: true })

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        Object.assign(form, d)
        syncGender(form.prefix)
        hasDraft.value = false
        draftInfo.value = null
        return true
      }
    } catch (e) {}
    return false
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    hasDraft.value = false
    draftInfo.value = null
  }

  // Auto-save debounce
  let timer = null
  watch(form, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, ts: Date.now() }))
      } catch (e) {}
    }, 400)
  }, { deep: true })

  return { form, hasDraft, draftInfo, loadDraft, clearDraft }
}
