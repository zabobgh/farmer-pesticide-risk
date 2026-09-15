<template>
  <div v-if="show" class="draft-banner">
    <div class="draft-text">
      <span>📝 <strong>มีข้อมูลฉบับร่างค้างไว้</strong></span>
      <span v-if="draftInfo?.fullname" class="draft-sub"> — ของคุณ {{ draftInfo.fullname }} {{ draftInfo.time ? `(บันทึกเมื่อ ${draftInfo.time} น.)` : '' }}</span>
    </div>
    <div style="display: flex; gap: 6px; flex-shrink: 0">
      <button class="btn-restore" @click="$emit('restore')">กู้คืนข้อมูล</button>
      <button class="btn-clear" @click="$emit('clear')">เริ่มใหม่</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DraftInfo } from '../types/form'

defineProps<{
  show: boolean
  draftInfo?: DraftInfo | null
}>()

defineEmits<{
  (e: 'restore'): void
  (e: 'clear'): void
}>()
</script>

<style scoped>
.draft-banner {
  background: var(--a2); border-bottom: 1px solid #fcd34d; padding: 10px 16px;
  font-size: 13px; color: #78350f; font-weight: 500; display: flex; align-items: center;
  justify-content: space-between; gap: 8px; box-shadow: 0 1px 4px rgba(0,0,0,.05);
}
button {
  font-size: 12px; font-weight: 600; font-family: 'Sarabun', sans-serif;
  border: none; border-radius: 6px; padding: 5px 12px; cursor: pointer;
}
.btn-restore { background: var(--a); color: #fff; }
.btn-clear { background: #888; color: #fff; }
</style>
