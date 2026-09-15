<template>
  <div class="step-nav">
    <button
      v-for="(step, idx) in steps"
      :key="idx"
      class="sn-btn"
      :class="{
        active: currentStep === idx,
        done: currentStep > idx
      }"
      @click="$emit('change-step', idx)"
    >
      <span class="sn-num">{{ step.num }}</span>
      {{ step.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentStep: { type: Number, default: 0 }
})
defineEmits(['change-step'])

const steps = [
  { num: '①', label: 'ข้อมูลทั่วไป' },
  { num: '②', label: 'การใช้สารเคมี' },
  { num: '③', label: 'อาการผิดปกติ' },
  { num: '④', label: 'ผลประเมิน' },
  { num: '⑤', label: 'เจาะเลือด' }
]
</script>

<style scoped>
.step-nav {
  display: flex;
  background: #fff;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.step-nav::-webkit-scrollbar { display: none; }
.sn-btn {
  flex: 1; min-width: 68px; padding: 12px 6px 10px; font-size: 12px;
  font-family: 'Sarabun', sans-serif; text-align: center; cursor: pointer;
  background: none; border: none; color: var(--muted); border-bottom: 3px solid transparent;
  transition: all .2s; line-height: 1.3; white-space: nowrap; user-select: none;
}
.sn-btn.active { color: var(--g2); border-bottom-color: var(--g); font-weight: 700; }
.sn-btn.done { color: var(--g); border-bottom-color: var(--g4); font-weight: 500; }
.sn-num { font-size: 17px; display: block; margin-bottom: 2px; }
</style>
