<template>
  <div class="section-container">
    <div class="sec-header">
      <div class="sec-icon">🧪</div>
      <div>
        <div class="sec-title">ส่วนที่ 2 — พฤติกรรมการใช้สารเคมี</div>
        <div class="sec-sub">ข้อ 9–23 ตอบให้ครบทุกข้อ</div>
      </div>
    </div>

    <div class="score-hint">
      <strong>ส่วน A (ข้อ 9–17):</strong> ไม่ใช่ = 1 คะแนน | ใช้เป็นบางครั้ง = 2 | ใช้ทุกครั้ง = 3<br>
      <strong>ส่วน B (ข้อ 18–23):</strong> ไม่ใช่ = 3 คะแนน | ใช้เป็นบางครั้ง = 2 | ใช้ทุกครั้ง = 1
    </div>

    <!-- Section A Questions -->
    <div
      v-for="q in qAdata"
      :key="q.n"
      class="q-card"
      :class="{ answered: form.answers[q.n] !== undefined }"
    >
      <div class="q-text"><span class="q-num">{{ q.n }}.</span> {{ q.t }}</div>
      <div class="opts">
        <label
          v-for="opt in optsA"
          :key="opt.v"
          class="opt"
          :class="[opt.c, { sel: form.answers[q.n] === opt.v }]"
          @click="selectAnswer(q.n, opt.v)"
        >
          {{ opt.l }}
        </label>
      </div>
    </div>

    <!-- Section B Questions -->
    <div
      v-for="q in qBdata"
      :key="q.n"
      class="q-card"
      :class="{ answered: form.answers[q.n] !== undefined }"
    >
      <div class="q-text"><span class="q-num">{{ q.n }}.</span> {{ q.t }}</div>
      <div class="opts">
        <label
          v-for="opt in optsB"
          :key="opt.v"
          class="opt"
          :class="[opt.c, { sel: form.answers[q.n] === opt.v }]"
          @click="selectAnswer(q.n, opt.v)"
        >
          {{ opt.l }}
        </label>
      </div>
    </div>

    <!-- Score strip -->
    <div class="score-strip">
      <div class="sc-card"><div class="sc-num">{{ scoreA }}</div><div class="sc-lbl">ส่วน A<br>(ข้อ 9–17)</div></div>
      <div class="sc-card"><div class="sc-num">{{ scoreB }}</div><div class="sc-lbl">ส่วน B<br>(ข้อ 18–23)</div></div>
      <div class="sc-card sc-total"><div class="sc-num">{{ totalScore }}</div><div class="sc-lbl">คะแนนรวม<br>(9–23)</div></div>
    </div>

    <div v-if="errorMsg" class="warn">{{ errorMsg }}</div>

    <div class="nav-row">
      <button class="btn-back" @click="('back')">← ย้อนกลับ</button>
      <button class="btn-next" @click="onNext">ถัดไป — ส่วนที่ 3 →</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { qAdata, qBdata } from '../composables/useRiskMatrix.js'

const props = defineProps({ form: Object })
const emit = defineEmits(['back', 'next'])

const errorMsg = ref('')

const optsA = [
  { l: 'ไม่ใช่', v: 1, c: 's1' },
  { l: 'เป็นบางครั้ง', v: 2, c: 's2' },
  { l: 'ทุกครั้ง', v: 3, c: 's3' }
]

const optsB = [
  { l: 'ไม่ใช่', v: 3, c: 's3' },
  { l: 'เป็นบางครั้ง', v: 2, c: 's2' },
  { l: 'ทุกครั้ง', v: 1, c: 's1' }
]

const selectAnswer = (qNum, val) => {
  props.form.answers[qNum] = val
}

const scoreA = computed(() => {
  return qAdata.reduce((acc, q) => acc + (props.form.answers[q.n] || 0), 0)
})

const scoreB = computed(() => {
  return qBdata.reduce((acc, q) => acc + (props.form.answers[q.n] || 0), 0)
})

const totalScore = computed(() => scoreA.value + scoreB.value)

const onNext = () => {
  const answeredCount = Object.keys(props.form.answers).length
  if (answeredCount < 15) {
    errorMsg.value = `กรุณาตอบคำถามพฤติกรรมให้ครบทุกข้อ (${answeredCount}/15 ข้อ)`
    return
  }
  errorMsg.value = ''
  emit('next')
}
</script>

<style scoped>
.sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; padding-bottom: .85rem; border-bottom: 2px solid var(--g3); }
.sec-icon { width: 40px; height: 40px; background: var(--g3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.sec-title { font-size: 16px; font-weight: 700; color: var(--g2); }
.sec-sub { font-size: 13px; color: var(--muted); }
.score-hint { font-size: 12px; color: var(--muted); background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; line-height: 1.6; }

.q-card { background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 14px 16px; margin-bottom: 10px; transition: border-color .2s, box-shadow .2s; }
.q-card.answered { border-color: var(--g); box-shadow: 0 0 0 3px rgba(21, 128, 93, .08); }
.q-text { font-size: 14.5px; color: var(--txt); margin-bottom: 12px; line-height: 1.6; font-weight: 500; }
.q-num { font-weight: 700; color: var(--g2); margin-right: 2px; }
.opts { display: flex; gap: 6px; }
.opt {
  flex: 1; min-height: 46px; display: flex; align-items: center; justify-content: center;
  padding: 10px 8px; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  cursor: pointer; font-size: 13.5px; font-family: 'Sarabun', sans-serif; color: var(--muted);
  text-align: center; transition: all .15s; user-select: none; line-height: 1.3; font-weight: 500;
  -webkit-tap-highlight-color: transparent;
}
.opt:hover:not(.sel) { background: #f7fffe; border-color: var(--g4); color: var(--txt); }
.opt:active { transform: scale(.98); }
.opt.s1.sel { background: var(--g3); border-color: var(--g); color: var(--g2); font-weight: 700; }
.opt.s2.sel { background: var(--a2); border-color: var(--a); color: #78350f; font-weight: 700; }
.opt.s3.sel { background: var(--r2); border-color: var(--r); color: var(--r); font-weight: 700; }

.score-strip { display: flex; gap: 8px; margin: 1.1rem 0; flex-wrap: wrap; }
.sc-card { flex: 1; min-width: 76px; background: #fff; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 12px 8px; text-align: center; }
.sc-num { font-size: 28px; font-weight: 700; color: var(--txt); font-variant-numeric: tabular-nums; }
.sc-lbl { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.4; font-weight: 500; }
.sc-total { background: var(--g3); border-color: var(--g); }
.sc-total .sc-num { color: var(--g2); }

@media(max-width: 600px) {
  .opts { flex-direction: column; gap: 6px; }
  .opt { text-align: left; padding: 12px 14px; justify-content: flex-start; }
}
</style>
