<template>
  <div class="success-screen">
    <div class="success-icon">✅</div>
    <div class="success-title">บันทึกข้อมูลสำเร็จ</div>
    <div class="success-sub">
      บันทึกข้อมูล <strong>{{ name }}</strong><br>
      <small style="color: var(--muted)">บัตรประชาชน: {{ id }}</small><br>
      <small style="color: var(--muted)">เวลา: {{ submitTime }}</small><br>
      <div style="margin-top: 8px; font-size: 13.5px">
        <span v-if="syncStatus === 'success'" style="color: var(--g)">✅ บันทึกลง Google Sheet สำเร็จ</span>
        <span v-else style="color: var(--a)">📥 ออฟไลน์ — บันทึกในเครื่องแล้ว จะส่งให้อัตโนมัติเมื่อออนไลน์</span>
      </div>
    </div>
    <div class="btn-group">
      <button class="btn-new" @click="('reset')">+ บันทึกรายถัดไป</button>
      <button class="btn-review" @click="printForm">🖨️ พิมพ์ใบสรุป</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  id: String,
  submitTime: String,
  syncStatus: String
})
defineEmits(['reset'])

const printForm = () => window.print()
</script>

<style scoped>
.success-screen { text-align: center; padding: 2.5rem 1rem; }
.success-icon { font-size: 60px; margin-bottom: 1rem; }
.success-title { font-size: 24px; font-weight: 700; color: var(--g2); margin-bottom: .6rem; }
.success-sub { font-size: 14.5px; color: var(--muted); margin-bottom: 1.6rem; line-height: 1.7; }
.btn-group { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
.btn-new {
  display: inline-block; padding: 12px 28px; background: var(--g); color: #fff;
  border: none; border-radius: var(--radius-sm); font-size: 15px; font-family: 'Sarabun', sans-serif;
  font-weight: 600; cursor: pointer; margin: 4px;
}
.btn-review {
  display: inline-block; padding: 12px 28px; background: #fff; color: var(--g2);
  border: 1.5px solid var(--g); border-radius: var(--radius-sm); font-size: 15px;
  font-family: 'Sarabun', sans-serif; font-weight: 600; cursor: pointer; margin: 4px;
}
</style>
