<template>
  <div class="section-container">
    <div class="sec-header">
      <div class="sec-icon">📊</div>
      <div>
        <div class="sec-title">ส่วนที่ 4 — สรุปผลการประเมินความเสี่ยง</div>
        <div class="sec-sub">คำนวณจากข้อ 9–23 และอาการที่พบ</div>
      </div>
    </div>

    <!-- Score strip -->
    <div class="score-strip">
      <div class="sc-card"><div class="sc-num">{{ scoreA }}</div><div class="sc-lbl">ส่วน A (9–17)</div></div>
      <div class="sc-card"><div class="sc-num">{{ scoreB }}</div><div class="sc-lbl">ส่วน B (18–23)</div></div>
      <div class="sc-card sc-total"><div class="sc-num">{{ totalScore }}</div><div class="sc-lbl">คะแนนรวม</div></div>
      <div class="sc-card"><div class="sc-num" style="font-size: 15px; padding-top: 4px">{{ symptomGroupLabel }}</div><div class="sc-lbl">กลุ่มอาการ</div></div>
    </div>

    <!-- Result Card -->
    <div class="result-card" :class="riskResult.meta.cls">
      <div class="r-badge">
        {{ riskResult.meta.icon }} คะแนนรวม {{ totalScore }} คะแนน ({{ scoreRange }}) · อาการ: {{ symptomGroupLabel }}
      </div>
      <div class="r-title">ระดับความเสี่ยง: {{ riskResult.risk }}</div>
      <div class="r-action">
        📋 <strong>คำแนะนำ:</strong> {{ riskResult.meta.action }}
        <template v-if="riskResult.meta.blood">
          <br>🩸 ควรนำผู้รับการประเมินตรวจเจาะเลือดหาระดับเอ็นไซม์คลอรีนเอสเตอเรส (ดำเนินการต่อในส่วนที่ 5)
        </template>
      </div>
    </div>

    <div class="matrix-note">
      ℹ️ หมายเหตุ: หากพบอาการทั้งกลุ่มที่ 1 และกลุ่มที่ 2 ให้เลือกกลุ่มที่มีความเสี่ยงสูงกว่า (กลุ่มที่ 2) มาใช้ในการหาระดับความเสี่ยง
    </div>

    <!-- Edit Buttons -->
    <div class="edit-nav">
      <button @click="$emit('go-step', 0)">✏️ แก้ไขข้อมูลทั่วไป</button>
      <button @click="$emit('go-step', 1)">✏️ แก้ไขการใช้สารเคมี</button>
      <button @click="$emit('go-step', 2)">✏️ แก้ไขอาการ</button>
    </div>

    <div class="action-stack">
      <!-- Case: Blood test recommended -->
      <template v-if="riskResult.meta.blood">
        <button class="btn-action-primary danger-btn" @click="$emit('go-step', 4)">
          🩸 แนะนำตรวจเลือด: ดำเนินการต่อในส่วนที่ 5 →
        </button>
        <button class="btn-action-secondary" @click="$emit('submit')">
          บันทึกและส่งข้อมูล (กรณีไม่ประสงค์ตรวจเลือด)
        </button>
      </template>

      <!-- Case: Normal/Low risk -->
      <template v-else>
        <button class="btn-action-primary success-btn" @click="$emit('submit')">
          ✅ บันทึกและส่งข้อมูล (ไม่จำเป็นต้องตรวจเลือด)
        </button>
        <button class="btn-action-subtle" @click="$emit('go-step', 4)">
          ไปยังส่วนที่ 5 — บันทึกการตรวจเลือดเพิ่มเติม (ถ้ามีประวัติใช้ยากำจัดแมลง) →
        </button>
      </template>

      <button class="btn-back-link" @click="$emit('go-step', 2)">← ย้อนกลับไปแก้ไขอาการ</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormData, RiskResult } from '../types/form'
import { qAdata, qBdata, calculateRisk } from '../composables/useRiskMatrix'

const props = defineProps<{ form: FormData }>()
defineEmits<{
  (e: 'go-step', step: number): void
  (e: 'submit'): void
}>()

const scoreA = computed<number>(() => qAdata.reduce((acc, q) => acc + (props.form.answers[q.n] || 0), 0))
const scoreB = computed<number>(() => qBdata.reduce((acc, q) => acc + (props.form.answers[q.n] || 0), 0))
const totalScore = computed<number>(() => scoreA.value + scoreB.value)

const symptomGroup = computed<number>(() => {
  if (props.form.symptoms_g3.length > 0) return 3
  if (props.form.symptoms_g2.length > 0) return 2
  if (props.form.symptoms_g1.length > 0) return 1
  return 0
})

const symptomGroupLabel = computed<string>(() => {
  return ['ไม่มีอาการ', 'กลุ่มที่ 1', 'กลุ่มที่ 2', 'กลุ่มที่ 3'][symptomGroup.value]
})

const scoreRange = computed<string>(() => {
  return totalScore.value <= 24 ? '15–24' : totalScore.value <= 30 ? '25–30' : '31–45'
})

const riskResult = computed<RiskResult>(() => calculateRisk(totalScore.value, symptomGroup.value))
</script>

<style scoped>
.sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; padding-bottom: .85rem; border-bottom: 2px solid var(--g3); }
.sec-icon { width: 40px; height: 40px; background: var(--g3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.sec-title { font-size: 16px; font-weight: 700; color: var(--g2); }
.sec-sub { font-size: 13px; color: var(--muted); }

.score-strip { display: flex; gap: 8px; margin: 1.1rem 0; flex-wrap: wrap; }
.sc-card { flex: 1; min-width: 76px; background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px 8px; text-align: center; }
.sc-num { font-size: 28px; font-weight: 700; color: var(--txt); font-variant-numeric: tabular-nums; }
.sc-lbl { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.4; font-weight: 500; }
.sc-total { background: var(--g3); border-color: var(--g); }
.sc-total .sc-num { color: var(--g2); }

.result-card { border-radius: var(--radius); padding: 1.4rem 1.6rem; border: 2px solid; margin: 1.1rem 0; }
.r-low { background: var(--g3); border-color: var(--g); color: var(--g2); }
.r-mid { background: var(--a2); border-color: var(--a); color: #78350f; }
.r-high { background: var(--r2); border-color: #ea580c; color: #9a3412; }
.r-vhigh { background: #fee2e2; border-color: var(--r); color: #7f1d1d; }
.r-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.r-badge { display: inline-block; font-size: 13px; padding: 4px 14px; border-radius: 20px; margin-bottom: 12px; font-weight: 600; background: rgba(255, 255, 255, .75); }
.r-action { margin-top: 14px; padding: 12px 16px; background: rgba(255, 255, 255, .65); border-radius: var(--radius-sm); font-size: 13.5px; line-height: 1.6; }

.matrix-note { font-size: 12px; color: var(--muted); margin-top: 10px; padding: 8px 12px; background: #f7f7f5; border-radius: var(--radius-sm); line-height: 1.6; }
.edit-nav { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
.edit-nav button { flex: 1; padding: 9px; border: 1.5px solid var(--border); border-radius: var(--radius-sm); background: #fff; color: var(--muted); cursor: pointer; font-size: 13px; font-family: 'Sarabun', sans-serif; transition: background .15s; }
.edit-nav button:hover { background: #f0fdf9; }

.action-stack { display: flex; flex-direction: column; gap: 10px; margin-top: 1.5rem; }
.btn-action-primary {
  width: 100%; min-height: 48px; padding: 12px 20px; border: none; border-radius: var(--radius-sm);
  color: #fff; font-size: 15px; font-weight: 700; font-family: 'Sarabun', sans-serif;
  cursor: pointer; transition: opacity .15s, transform .15s;
}
.btn-action-primary:active { transform: scale(.99); }
.danger-btn { background: var(--r); }
.danger-btn:hover { background: #991b1b; }
.success-btn { background: var(--g2); }
.success-btn:hover { background: #063e2c; }

.btn-action-secondary {
  width: 100%; min-height: 44px; padding: 10px 16px; border: 1.5px solid var(--border);
  border-radius: var(--radius-sm); background: #fff; color: var(--muted);
  font-size: 14px; font-weight: 600; font-family: 'Sarabun', sans-serif; cursor: pointer;
  transition: all .15s;
}
.btn-action-secondary:hover { background: #f7faf8; color: var(--txt); }

.btn-action-subtle {
  width: 100%; padding: 10px 14px; border: 1px dashed var(--border);
  border-radius: var(--radius-sm); background: #fafdfb; color: var(--muted);
  font-size: 13px; font-family: 'Sarabun', sans-serif; cursor: pointer;
}
.btn-action-subtle:hover { background: #f0fdf9; border-color: var(--g4); }

.btn-back-link {
  background: none; border: none; color: var(--muted); font-size: 13.5px;
  font-family: 'Sarabun', sans-serif; font-weight: 600; cursor: pointer;
  padding: 8px; margin-top: 4px; text-decoration: underline; text-underline-offset: 3px;
}
.btn-back-link:hover { color: var(--txt); }
</style>
