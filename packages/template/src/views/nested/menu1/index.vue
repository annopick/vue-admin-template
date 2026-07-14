<script setup lang="ts">
// Nested menu1 — renders its own <router-view> for nested children
</script>

<template>
  <div class="nested-container">
    <h2>Menu 1</h2>
    <router-view />
  </div>
</template>

<style scoped>
.nested-container {
  padding: 20px;
}
</style>
