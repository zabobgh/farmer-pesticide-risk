<template>
  <div class="section-container">
    <div class="sec-header">
      <div class="sec-icon">🩺</div>
      <div>
        <div class="sec-title">ส่วนที่ 3 — อาการผิดปกติใน 1 เดือนที่ผ่านมา</div>
        <div class="sec-sub">ทำเครื่องหมายที่อาการที่มีหลังสัมผัสสารเคมี</div>
      </div>
    </div>

    <!-- Group 1 -->
    <div class="sx-section-label">กลุ่มที่ 1 — อาการทั่วไป (ผิวหนัง ระบบหายใจ ดวงตา)</div>
    <div class="sx-grid">
      <label
        v-for="s in sx1d"
        :key="s"
        class="sx-item"
        :class="{ chk: form.symptoms_g1.includes(s) }"
      >
        <input type="checkbox" :value="s" v-model="form.symptoms_g1">
        <span class="chkbox">{{ form.symptoms_g1.includes(s) ? '✓' : '' }}</span>
        <span>{{ s }}</span>
      </label>
    </div>

    <!-- Group 2 -->
    <div class="sx-section-label">กลุ่มที่ 2 — อาการระบบประสาทอัตโนมัติ</div>
    <div class="sx-grid">
      <label
        v-for="s in sx2d"
        :key="s"
        class="sx-item"
        :class="{ chk: form.symptoms_g2.includes(s) }"
      >
        <input type="checkbox" :value="s" v-model="form.symptoms_g2">
        <span class="chkbox">{{ form.symptoms_g2.includes(s) ? '✓' : '' }}</span>
        <span>{{ s }}</span>
      </label>
    </div>

    <!-- Group 3 -->
    <div class="sx-section-label group3">⚠️ กลุ่มที่ 3 — อาการรุนแรง (ระบบประสาทส่วนกลาง)</div>
    <div class="sx-grid">
      <label
        v-for="s in sx3d"
        :key="s"
        class="sx-item sx-danger"
        :class="{ chk: form.symptoms_g3.includes(s) }"
      >
        <input type="checkbox" :value="s" v-model="form.symptoms_g3">
        <span class="chkbox">{{ form.symptoms_g3.includes(s) ? '✓' : '' }}</span>
        <span>{{ s }}</span>
      </label>
    </div>

    <div v-if="form.symptoms_g3.length > 0" class="info-box danger-box">
      ⚠️ ตรวจพบอาการกลุ่มที่ 3 — ควรพิจารณาส่งต่อแพทย์ทันที
    </div>

    <div class="nav-row">
      <button class="btn-back" @click="('back')">← ย้อนกลับ</button>
      <button class="btn-next" @click="('next')">ดูผลประเมิน →</button>
    </div>
  </div>
</template>

<script setup>
import { sx1d, sx2d, sx3d } from '../composables/useRiskMatrix.js'

defineProps({ form: Object })
defineEmits(['back', 'next'])
</script>

<style scoped>
.sec-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; padding-bottom: .85rem; border-bottom: 2px solid var(--g3); }
.sec-icon { width: 40px; height: 40px; background: var(--g3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.sec-title { font-size: 16px; font-weight: 700; color: var(--g2); }
.sec-sub { font-size: 13px; color: var(--muted); }

.sx-section-label {
  font-size: 13.5px; font-weight: 700; color: var(--g2); margin: 16px 0 8px;
  padding: 8px 12px; background: var(--g3); border-radius: 6px; border-left: 4px solid var(--g);
}
.sx-section-label.group3 {
  background: var(--r2); border-left-color: var(--r); color: var(--r);
}

.sx-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 7px; margin-bottom: 6px; }
.sx-item {
  min-height: 48px; display: flex; align-items: center; gap: 10px; padding: 10px 14px;
  border: 1.5px solid var(--border); border-radius: var(--radius-sm); cursor: pointer;
  font-size: 13.5px; font-family: 'Sarabun', sans-serif; color: var(--txt); background: #fff;
  transition: all .15s; user-select: none; font-weight: 500; -webkit-tap-highlight-color: transparent;
}
.sx-item.chk { background: var(--g3); border-color: var(--g); color: var(--g2); font-weight: 600; }
.sx-item.sx-danger.chk { background: var(--r2); border-color: var(--r); color: var(--r); font-weight: 700; }
.sx-item:active { transform: scale(.98); }
.sx-item input { display: none; }
.chkbox {
  width: 22px; height: 22px; border: 2px solid var(--g4); border-radius: 5px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;
  background: #fff; transition: all .15s;
}
.sx-item.chk .chkbox { background: var(--g); border-color: var(--g); color: #fff; }
.sx-item.sx-danger.chk .chkbox { background: var(--r); border-color: var(--r); }

.danger-box { background: #fee2e2; border-color: var(--r); color: #7f1d1d; }
</style>
