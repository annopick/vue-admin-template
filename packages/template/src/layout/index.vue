<script setup lang="ts">
// Layout shell placeholder. Full Sidebar/Navbar/AppMain arrive in slice 4.
// For now it just renders the child route so the login → dashboard flow works.
</script>

<template>
  <div class="app-wrapper">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  min-height: 100vh;
}
</style>
