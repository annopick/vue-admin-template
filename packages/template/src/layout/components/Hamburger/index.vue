<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'

defineProps<{ isActive: boolean }>()
const emit = defineEmits<{ (e: 'toggleClick'): void }>()
</script>

<template>
  <div class="hamburger" @click="emit('toggleClick')">
    <el-icon :size="20">
      <component :is="isActive ? 'Fold' : 'Expand'" />
    </el-icon>
  </div>
</template>

<style scoped>
.hamburger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
</style>
