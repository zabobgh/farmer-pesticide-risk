<template>
  <div class="section-container">
    <div class="sec-header">
      <div class="sec-icon">📋</div>
      <div>
        <div class="sec-title">ส่วนที่ 1 — ข้อมูลทั่วไป</div>
        <div class="sec-sub">กรุณากรอกข้อมูลให้ครบถ้วน</div>
      </div>
    </div>

    <!-- ID Card -->
    <div class="field-block">
      <div class="field-label">หมายเลขบัตรประชาชน <span class="req">จำเป็น</span></div>
      <div class="id-input-wrap">
        <input
          class="field-input"
          :class="{ 'input-valid': isIdValid, 'input-invalid': idRaw.length === 13 && !isIdValid }"
          :value="form.id_card"
          maxlength="17"
          inputmode="numeric"
          placeholder="X-XXXX-XXXXX-XX-X"
          @input="onIdInput"
        >
        <span class="id-badge">
          <span v-if="isIdValid" style="color: #0a5742">✓ ถูกต้อง</span>
          <span v-else-if="idRaw.length === 13" style="color: var(--r)">✗ เลขไม่ถูกต้อง</span>
          <span v-else-if="idRaw.length > 0" style="color: var(--muted)">{{ idRaw.length }}/13</span>
        </span>
      </div>
      <div v-if="idRaw.length === 13 && !isIdValid" class="field-hint-error">
        หมายเลขบัตรประชาชนไม่ถูกต้องตามสูตรคำนวณ 13 หลัก
      </div>
    </div>

    <!-- Prefix, Fullname & Age -->
    <div class="name-age-row">
      <div class="field-block field-prefix">
        <div class="field-label">คำนำหน้า</div>
        <select class="field-input" v-model="form.prefix" @change="onPrefixChange">
          <option value="นาย">นาย</option>
          <option value="นาง">นาง</option>
          <option value="นางสาว">นางสาว</option>
        </select>
      </div>
      <div class="field-block field-name">
        <div class="field-label">ชื่อ – นามสกุล <span class="req">จำเป็น</span></div>
        <input class="field-input" v-model="form.fullname" placeholder="กรอกชื่อ นามสกุล">
      </div>
      <div class="field-block field-age">
        <div class="field-label">อายุ (ปี)</div>
        <input class="field-input" type="number" min="1" max="120" v-model="form.age" placeholder="ระบุอายุ">
      </div>
    </div>

    <!-- Address -->
    <div style="margin-top: 14px; margin-bottom: 14px">
      <div class="field-label">ที่อยู่ปัจจุบัน</div>
      <div class="addr-grid-1">
        <div>
          <div class="sub-label">บ้านเลขที่ / หมู่</div>
          <input class="field-input" v-model="form.address" placeholder="เช่น 1/1 ม.5">
        </div>
        <div>
          <div class="sub-label">ตำบล <span style="color: var(--r)">*</span></div>
          <input class="field-input" v-model="form.tambon" list="tambon-list" placeholder="พิมพ์หรือเลือกตำบล">
          <datalist id="tambon-list">
            <option v-for="t in tambons" :key="t">{{ t }}</option>
          </datalist>
        </div>
        <div>
          <div class="sub-label">อำเภอ</div>
          <div class="addr-locked">บ้านแพ้ว</div>
        </div>
      </div>
      <div class="addr-grid-2">
        <div>
          <div class="sub-label">จังหวัด</div>
          <div class="addr-locked">สมุทรสาคร</div>
        </div>
        <div>
          <div class="sub-label">ถนน/ซอย (ถ้ามี)</div>
          <input class="field-input" v-model="form.road" placeholder="ถนน ซอย">
        </div>
      </div>
    </div>

    <!-- Occupation -->
    <div class="field-block">
      <div class="field-label">งานอาชีพหลัก</div>
      <div class="pill-group">
        <label v-for="job in jobs" :key="job" class="pill" :class="{ sel: form.occupation === job }">
          <input type="radio" :value="job" v-model="form.occupation"> {{ job }}
        </label>
      </div>
    </div>

    <!-- Crops -->
    <div class="field-block">
      <div class="field-label">ปัจจุบันทำการเพาะปลูกอะไรเป็นหลัก</div>
      <div class="pill-group" style="margin-bottom: 8px">
        <label v-for="crop in ['ไร่', 'นา', 'สวน']" :key="crop" class="pill" :class="{ sel: form.crop_category === crop }">
          <input type="radio" :value="crop" v-model="form.crop_category"> ทำ{{ crop }}
        </label>
      </div>
      <input class="field-input" v-model="form.crop_detail" placeholder="ระบุชนิดพืช เช่น ข้าว อ้อย มันสำปะหลัง ฝรั่ง มะนาว">
    </div>

    <!-- Involvement -->
    <div class="field-block">
      <div class="field-label">เกี่ยวข้องกับการใช้สารเคมีอย่างไร <span style="font-weight: 400; color: var(--muted); font-size: 11px">(เลือกได้มากกว่า 1 ข้อ)</span></div>
      <div class="pill-group">
        <label v-for="inv in involvements" :key="inv" class="pill" :class="{ sel: form.involvement.includes(inv) }">
          <input type="checkbox" :value="inv" v-model="form.involvement"> {{ inv }}
        </label>
      </div>
    </div>

    <!-- Health Center & Date -->
    <div class="field-row">
      <div class="field-block" style="margin-bottom: 0; grid-column: span 2">
        <div class="field-label">สถานบริการสุขภาพ <span class="req">จำเป็น</span></div>
        <select class="field-input" v-model="form.hospital">
          <option value="">— เลือกสถานบริการสุขภาพ —</option>
          <option v-for="h in hospitals" :key="h">{{ h }}</option>
        </select>
      </div>
      <div class="field-block" style="margin-bottom: 0">
        <div class="field-label">วันที่ประเมิน</div>
        <input class="field-input" type="date" v-model="form.survey_date">
      </div>
    </div>

    <!-- Interviewer -->
    <div class="field-row" style="margin-top: 10px">
      <div class="field-block" style="margin-bottom: 0">
        <div class="field-label">ผู้สัมภาษณ์</div>
        <input class="field-input" v-model="form.interviewer" placeholder="ชื่อผู้สัมภาษณ์">
      </div>
      <div class="field-block" style="margin-bottom: 0">
        <div class="field-label">ตำแหน่ง</div>
        <input class="field-input" v-model="form.interviewer_pos" placeholder="ตำแหน่ง">
      </div>
    </div>

    <div v-if="errorMsg" class="warn">{{ errorMsg }}</div>

    <div class="nav-row">
      <button class="btn-next" @click="onNext">ถัดไป — ส่วนที่ 2 →</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FormData } from '../types/form'
import { formatThaiId, validateThaiCitizenId } from '../composables/useThaiId'

const props = defineProps<{ form: FormData }>()
const emit = defineEmits<{ (e: 'next'): void }>()

const errorMsg = ref<string>('')

const idRaw = computed(() => (props.form.id_card || '').replace(/\D/g, ''))
const isIdValid = computed(() => validateThaiCitizenId(idRaw.value))

const onIdInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  props.form.id_card = formatThaiId(target.value)
}

const onPrefixChange = () => {
  if (props.form.prefix === 'นาย') props.form.gender = 'ชาย'
  else if (props.form.prefix === 'นาง' || props.form.prefix === 'นางสาว') props.form.gender = 'หญิง'
}

if (!props.form.gender && props.form.prefix) {
  onPrefixChange()
}

const onNext = () => {
  if (!idRaw.value || idRaw.value.length < 13 || !props.form.fullname || !props.form.hospital) {
    errorMsg.value = 'กรุณากรอกเลขบัตรประชาชน, ชื่อ-นามสกุล และสถานบริการสุขภาพให้ครบถ้วน'
    return
  }
  if (!isIdValid.value) {
    errorMsg.value = 'หมายเลขบัตรประชาชนไม่ถูกต้องตามสูตรคำนวณ 13 หลัก'
    return
  }
  errorMsg.value = ''
  emit('next')
}

const tambons: string[] = ['หลักสาม', 'ทุ่งอินทรีย์', 'โคกงูเห่า', 'บ้านแพ้ว', 'หนองสองห้อง', 'โรงเข้', 'บ้านดอนสะแก', 'บ้านกลางนา', 'บ้านดอนโฆ', 'หลักสอง', 'เจ็ดริ้ว', 'คลองตัน', 'สวนส้ม', 'เกษตรพัฒนา']
const jobs: string[] = ['เพาะปลูก (ทำเอง)', 'เพาะปลูก (รับจ้าง)', 'รับจ้างฉีดพ่น', 'รับจ้างอื่นๆ']
const involvements: string[] = ['เป็นผู้ผสมสารเคมี', 'เป็นผู้ฉีดพ่นเอง', 'อยู่ในบริเวณที่ฉีดพ่น', 'รับจ้างฉีดพ่น', 'สัมผัสผักผลไม้ที่ฉีดพ่น']
const hospitals: string[] = ['รพ.สต.หลักสาม', 'รพ.สต.ทุ่งอินทรีย์', 'รพ.สต.โคกงูเห่า', 'รพ.สต.บ้านทำนบแพ้ว', 'รพ.สต.โรงเข้', 'รพ.สต.บ้านดอนสะแก', 'รพ.สต.บ้านกลางนา', 'รพ.สต.หนองสองห้อง', 'รพ.สต.บ้านกลางคลองสองห้อง', 'รพ.สต.บ้านดอนโฆ', 'รพ.สต.หลักสอง', 'รพ.สต.บ้านรางช้างสี', 'รพ.สต.เจ็ดริ้ว', 'รพ.สต.คลองตัน', 'รพ.สต.บ้านช่องสาร', 'รพ.สต.บ้านท่าแร้ง', 'รพ.สต.สวนส้ม', 'รพ.สต.บ้านคลองตัน', 'รพ.สต.เกษตรพัฒนา', 'รพ.บ้านแพ้ว']
</script>

<style scoped>
.sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; padding-bottom: .85rem; border-bottom: 2px solid var(--g3); }
.sec-icon { width: 40px; height: 40px; background: var(--g3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.sec-title { font-size: 16px; font-weight: 700; color: var(--g2); }
.sec-sub { font-size: 13px; color: var(--muted); }

.name-age-row { display: grid; grid-template-columns: 120px 1fr 110px; gap: 10px; margin-top: 14px; }
.name-age-row .field-block { margin-bottom: 0; }
@media(max-width: 580px) {
  .name-age-row { grid-template-columns: 110px 1fr; }
  .name-age-row .field-age { grid-column: span 2; }
}
</style>
