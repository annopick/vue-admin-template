<script setup lang="ts">
import { ref } from 'vue'
import { ElTree } from 'element-plus'

interface TreeNode {
  label: string
  children?: TreeNode[]
}

const treeData = ref<TreeNode[]>([
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [{ label: 'Level three 1-1-1' }],
      },
    ],
  },
  {
    label: 'Level one 2',
    children: [
      { label: 'Level two 2-1' },
      { label: 'Level two 2-2' },
    ],
  },
])

const defaultProps = { children: 'children', label: 'label' }
</script>

<template>
  <div class="app-container">
    <h2>Tree 示例</h2>
    <el-tree :data="treeData" :props="defaultProps" default-expand-all />
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
