<script setup lang="ts">
// AppMain renders the active route via <router-view>. keep-alive could be
// added here for slice 4's nested routes if needed.
</script>

<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
.app-main {
  /* 50px = navbar height */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 16px;
}
</style>
