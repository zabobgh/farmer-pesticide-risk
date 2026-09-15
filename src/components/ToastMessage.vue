<template>
  <div v-if="visible" class="toast-box" :class="type">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  visible: boolean
  message: string
  type?: 'success' | 'error'
}>(), {
  type: 'success'
})
</script>

<style scoped>
.toast-box {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  padding: 10px 20px; border-radius: 20px; font-size: 13.5px;
  font-family: 'Sarabun', sans-serif; z-index: 9999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, .2); color: #fff; white-space: nowrap;
}
.toast-box.success { background: #0F6E56; }
.toast-box.error { background: #993C1D; }
</style>
