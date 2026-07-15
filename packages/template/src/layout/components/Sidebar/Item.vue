<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
  title?: string
}>()

const iconComponent = computed(() => props.icon || '')
</script>

<template>
  <!-- Use a fragment-like span that lays out icon + title inline-flex so EP's
       el-menu-item / el-sub-menu__title flexbox treats them as a single row. -->
  <span class="menu-item-content">
    <component :is="iconComponent" v-if="icon" class="sub-el-icon" />
    <span v-if="title" class="menu-item-title">{{ title }}</span>
  </span>
</template>

<style scoped>
.menu-item-content {
  display: inline-flex;
  align-items: center;
}

.menu-item-title {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
