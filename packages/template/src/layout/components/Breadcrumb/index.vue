<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, type RouteLocationMatched } from 'vue-router'
import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

const route = useRoute()
const levelList = ref<RouteLocationMatched[]>([])

function getBreadcrumb() {
  let matched = route.matched.filter((item) => item.meta && item.meta.title)
  const first = matched[0]
  // Prepend dashboard if not already first
  if (first && first.path !== '/dashboard') {
    matched = [
      { path: '/dashboard', meta: { title: 'Dashboard' } } as unknown as RouteLocationMatched,
      ...matched,
    ]
  }
  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false,
  )
}

getBreadcrumb()
watch(() => route.path, getBreadcrumb)
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="index === levelList.length - 1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a v-else @click.prevent="() => {}">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

  a {
    display: inline-block;
    padding: 0 8px;
    color: #475669;
    cursor: pointer;
  }
}
</style>
