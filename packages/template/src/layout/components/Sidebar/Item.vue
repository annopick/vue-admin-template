<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
  title?: string
}>()

// Element Plus icons are globally registered; render via <component :is>.
const iconComponent = computed(() => props.icon || '')
</script>

<template>
  <span>
    <component :is="iconComponent" v-if="icon" class="sub-el-icon" />
    <span v-if="title">{{ title }}</span>
  </span>
</template>
