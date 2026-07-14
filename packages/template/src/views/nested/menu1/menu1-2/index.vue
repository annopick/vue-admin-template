<script setup lang="ts">
// Nested menu1-2 — renders its own <router-view> for deeper nesting
</script>

<template>
  <div class="nested-container">
    <h3>Menu 1-2</h3>
    <router-view />
  </div>
</template>

<style scoped>
.nested-container {
  padding: 10px 20px;
}
</style>
