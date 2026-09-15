<template>
  <div v-if="show" class="draft-banner">
    <span>📝 มีข้อมูลที่บันทึกค้างไว้ — ต้องการกรอกต่อหรือไม่?</span>
    <div style="display: flex; gap: 6px">
      <button class="btn-restore" @click="('restore')">กรอกต่อ</button>
      <button class="btn-clear" @click="('clear')">เริ่มใหม่</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean })
defineEmits(['restore', 'clear'])
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
