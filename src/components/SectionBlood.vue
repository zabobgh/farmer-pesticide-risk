<template>
  <div class="section-container">
    <div class="sec-header">
      <div class="sec-icon">🩸</div>
      <div>
        <div class="sec-title">ส่วนที่ 5 — ตรวจระดับเอ็นไซม์คลอรีนเอสเตอเรส</div>
        <div class="sec-sub">เฉพาะผู้ใช้สารเคมีกำจัดแมลง</div>
      </div>
    </div>

    <div class="info-box">
      เฉพาะกลุ่มที่มีการใช้สารเคมีกำจัดแมลง — <strong>ไม่ตรวจ</strong>ในผู้ที่ใช้เฉพาะสารเคมีกำจัดวัชพืช (ยาฆ่าหญ้า)
    </div>

    <!-- Diseases -->
    <div class="field-block">
      <div class="field-label">1. โรคประจำตัว <span style="font-weight: 400; color: var(--muted); font-size: 12px">(เลือกได้มากกว่า 1 ข้อ)</span></div>
      <div class="pill-group">
        <label
          v-for="d in diseases"
          :key="d"
          class="pill"
          :class="{ sel: form.disease.includes(d) }"
        >
          <input type="checkbox" :value="d" @change="onDiseaseChange(d, $event.target.checked)">
          {{ d === 'ไม่มี' ? 'ไม่มี' : 'โรค' + d }}
        </label>
      </div>
    </div>

    <!-- Muscle Relaxant -->
    <div class="field-block">
      <div class="field-label">2. รับประทานยาคลายกล้ามเนื้อ pyridostigmine / bromide หรือไม่</div>
      <div class="pill-group">
        <label v-for="m in ['รับประทาน', 'ไม่ได้รับประทาน']" :key="m" class="pill" :class="{ sel: form.med_pyridostigmine === m }">
          <input type="radio" :value="m" v-model="form.med_pyridostigmine"> {{ m }}
        </label>
      </div>
    </div>

    <!-- Last Exposure -->
    <div class="field-block">
      <div class="field-label">3. ฉีดพ่น/สัมผัสสารเคมีครั้งหลังสุดเมื่อไหร่</div>
      <div class="pill-group">
        <label v-for="item in lastExposures" :key="item.val" class="pill" :class="{ sel: form.last_exposure === item.val }">
          <input type="radio" :value="item.val" v-model="form.last_exposure"> {{ item.label }}
        </label>
      </div>
    </div>

    <!-- Days Per Month -->
    <div class="field-block">
      <div class="field-label">4. จำนวนวันเฉลี่ยของการใช้สารเคมีต่อเดือน</div>
      <div class="pill-group">
        <label v-for="item in daysOptions" :key="item.val" class="pill" :class="{ sel: form.days_per_month === item.val }">
          <input type="radio" :value="item.val" v-model="form.days_per_month"> {{ item.label }}
        </label>
      </div>
    </div>

    <!-- Chemical Purpose -->
    <div class="field-block">
      <div class="field-label">5. ใช้สารเคมีเพื่อวัตถุประสงค์ใด</div>
      <div class="pill-group">
        <label v-for="p in ['กำจัดแมลง', 'กำจัดวัชพืช', 'อื่นๆ']" :key="p" class="pill" :class="{ sel: form.chem_purpose.includes(p) }">
          <input type="checkbox" :value="p" v-model="form.chem_purpose"> {{ p }}
        </label>
      </div>
    </div>

    <!-- Chemical Table -->
    <div class="field-block">
      <div class="field-label">6. ระบุชื่อสารเคมีที่ใช้</div>
      <table class="chem-table">
        <thead>
          <tr><th style="width: 40px">ลำดับ</th><th>ชื่อการค้า</th><th>ชื่อสามัญ (ถ้าทราบ)</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in form.chems" :key="idx">
            <td class="row-num">{{ idx + 1 }}</td>
            <td><input v-model="row.trade" placeholder="ชื่อการค้า"></td>
            <td><input v-model="row.common" placeholder="ชื่อสามัญ"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Blood Test Result -->
    <div class="field-block">
      <div class="field-label">ผลการตรวจเอ็นไซม์คลอรีนเอสเตอเรส</div>
      <div class="pill-group" style="margin-top: 4px">
        <label v-for="b in bloodOptions" :key="b.val" class="pill" :class="{ sel: form.blood_result === b.val }">
          <input type="radio" :value="b.val" v-model="form.blood_result"> {{ b.label }}
        </label>
      </div>
      <div v-if="bloodTag" style="margin-top: 8px">
        <span class="blood-tag" :class="bloodTag.cls">{{ bloodTag.msg }}</span>
      </div>
    </div>

    <div class="nav-row">
      <button class="btn-back" @click="('back')">← ย้อนกลับ</button>
      <button class="btn-submit" @click="('submit')">✅ บันทึกและส่งข้อมูล</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ form: Object })
defineEmits(['back', 'submit'])

const diseases = ['เบาหวาน', 'ไต', 'ตับ', 'ขาดสารอาหาร', 'พิษสุราเรื้อรัง', 'ไม่มี']

const onDiseaseChange = (disease, isChecked) => {
  if (disease === 'ไม่มี' && isChecked) {
    props.form.disease = ['ไม่มี']
  } else if (disease !== 'ไม่มี' && isChecked) {
    props.form.disease = props.form.disease.filter(d => d !== 'ไม่มี')
    props.form.disease.push(disease)
  } else {
    props.form.disease = props.form.disease.filter(d => d !== disease)
  }
}

const lastExposures = [
  { val: '1-2วัน', label: '1–2 วันที่ผ่านมา' },
  { val: '3-7วัน', label: '3–7 วัน' },
  { val: '8-14วัน', label: 'มากกว่า 7–14 วัน' },
  { val: '14วันขึ้นไป', label: '14 วันขึ้นไป' }
]

const daysOptions = [
  { val: 'น้อยกว่า7วัน', label: 'น้อยกว่า 7 วัน/เดือน' },
  { val: 'มากกว่า7วัน', label: 'มากกว่า 7 วัน/เดือน' }
]

const bloodOptions = [
  { val: 'ปกติ', label: '1. ปกติ' },
  { val: 'ปลอดภัย', label: '2. ปลอดภัย' },
  { val: 'มีความเสี่ยง', label: '3. มีความเสี่ยง' },
  { val: 'ไม่ปลอดภัย', label: '4. ไม่ปลอดภัย' }
]

const bloodMap = {
  'ปกติ': { cls: 'bt-normal', msg: 'ผลปกติ — ระดับเอ็นไซม์อยู่ในเกณฑ์ปกติ' },
  'ปลอดภัย': { cls: 'bt-safe', msg: 'ปลอดภัย — ระดับเอ็นไซม์อยู่ในระดับที่ยอมรับได้' },
  'มีความเสี่ยง': { cls: 'bt-risk', msg: '⚠️ มีความเสี่ยง — ควรติดตามและลดการสัมผัสสารเคมี' },
  'ไม่ปลอดภัย': { cls: 'bt-unsafe', msg: '🚨 ไม่ปลอดภัย — ต้องหยุดสัมผัสสารเคมีและพบแพทย์ทันที' }
}

const bloodTag = computed(() => bloodMap[props.form.blood_result] || null)
</script>

<style scoped>
.sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; padding-bottom: .85rem; border-bottom: 2px solid var(--g3); }
.sec-icon { width: 40px; height: 40px; background: var(--g3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.sec-title { font-size: 16px; font-weight: 700; color: var(--g2); }
.sec-sub { font-size: 13px; color: var(--muted); }

.chem-table { width: 100%; border-collapse: collapse; border: 1.5px solid var(--g4); border-radius: var(--radius); overflow: hidden; margin-top: 8px; }
.chem-table th { font-size: 13px; font-weight: 600; color: var(--g2); text-align: left; padding: 10px 12px; background: var(--g3); border-bottom: 1.5px solid var(--g4); }
.chem-table td { padding: 4px 6px; border-bottom: 1px solid #e2f2eb; }
.chem-table tr:last-child td { border-bottom: none; }
.chem-table input {
  width: 100%; min-height: 42px; border: 1px solid transparent; border-radius: 4px;
  padding: 6px 10px; font-size: 14px; font-family: 'Sarabun', sans-serif; color: var(--txt);
  background: transparent; outline: none; transition: all .15s;
}
.chem-table input:focus { background: #fff; border-color: var(--g); }
.row-num { text-align: center; font-size: 13px; font-weight: 600; color: var(--muted); width: 40px; background: #f5faf8; padding: 8px; }

.blood-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.bt-normal { background: #e6f7f1; color: #0a5742; border: 1.5px solid #8bd9c0; }
.bt-safe { background: #dbeafe; color: #1e40af; border: 1.5px solid #93c5fd; }
.bt-risk { background: #fef3c7; color: #92400e; border: 1.5px solid #fcd34d; }
.bt-unsafe { background: #fee2e2; color: #991b1b; border: 1.5px solid #fca5a5; }

@media(max-width: 600px) {
  .chem-table, .chem-table tbody, .chem-table tr, .chem-table td { display: block; width: 100%; }
  .chem-table thead, .chem-table th { display: none; }
  .chem-table tr { background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 10px; padding: 8px 10px; }
  .chem-table td { border-bottom: none; padding: 3px 0; }
  .chem-table td.row-num { background: none; width: auto; text-align: left; font-weight: 700; color: var(--g); border-bottom: 1px dashed var(--border); padding-bottom: 5px; margin-bottom: 6px; }
  .chem-table input { border: 1.5px solid var(--border); border-radius: 6px; padding: 8px 10px; background: #fcfefd; margin-top: 2px; }
  .chem-table input:focus { background: #fff; border-color: var(--g); }
}
</style>
