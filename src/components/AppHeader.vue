<template>
  <div class="app-header">
    <div class="hd-top">
      <div>
        <div class="hd-title">แบบประเมินความเสี่ยงเกษตรกรจากสารเคมีกำจัดศัตรูพืช</div>
        <div class="hd-code">นบก.1-56 · อำเภอบ้านแพ้ว จังหวัดสมุทรสาคร</div>
      </div>
      <div class="offline-badge">
        <span class="offline-dot" :class="{ offline: !isOnline }"></span>
        <span>{{ isOnline ? 'ออนไลน์' : 'ออฟไลน์' }}</span>
      </div>
    </div>
    <div class="prog-bar-wrap">
      <div class="prog-track">
        <div class="prog-fill" :style="{ width: percent + '%' }"></div>
      </div>
      <span class="prog-txt">{{ answeredCount }} / 15 ข้อ</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOnline: Boolean,
  answeredCount: { type: Number, default: 0 },
  percent: { type: Number, default: 0 }
})
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #063e2c 0%, #15805d 100%);
  color: #fff;
  padding: 1.1rem 1.25rem .9rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 16px rgba(0, 0, 0, .22);
}
.hd-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.hd-title { font-size: 16px; font-weight: 700; line-height: 1.3; }
.hd-code { font-size: 12px; opacity: .9; margin-top: 2px; font-weight: 400; }
.offline-badge {
  font-size: 11px; font-weight: 600; background: rgba(255, 255, 255, .2);
  border: 1px solid rgba(255, 255, 255, .35); border-radius: 20px;
  padding: 4px 10px; white-space: nowrap; display: flex; align-items: center; gap: 5px;
}
.offline-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; }
.offline-dot.offline { background: #f87171; }
.prog-bar-wrap { margin-top: .75rem; display: flex; align-items: center; gap: 12px; }
.prog-track { flex: 1; height: 6px; background: rgba(255, 255, 255, .3); border-radius: 3px; overflow: hidden; }
.prog-fill { height: 100%; background: #fff; border-radius: 3px; transition: width .4s ease; }
.prog-txt { font-size: 12px; font-weight: 600; opacity: .95; white-space: nowrap; font-variant-numeric: tabular-nums; }
@media(max-width: 480px) { .hd-title { font-size: 14px; } }
</style>
