<template>
  <v-text-field v-model="keyword" label="keyword" />
  <v-text-field v-model="keyword2" label="keyword2" />
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";

const keyword = ref("");
const keyword2 = ref("");

watch(keyword, (newVal, oldVal) => {
  // ชัดเจน: watch ค่า keyword เท่านั้น
  console.log("keyword changed", oldVal, "→", newVal);
});

watchEffect(() => {
  // จะ track ทุกตัวที่อ่านในนี้
  console.log("keyword is", keyword.value);
  console.log("keyword2 is", keyword2.value);
});
</script>
