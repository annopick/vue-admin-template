<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { isExternal } from '@/utils/validate'
import Item from './Item.vue'
import AppLink from './Link.vue'
import path from 'path-browserify'

const props = withDefaults(
  defineProps<{
    item: RouteRecordRaw
    isNest?: boolean
    basePath?: string
  }>(),
  { isNest: false, basePath: '' },
)

// onlyOneChild is set during hasOneShowingChild evaluation
const onlyOneChild = ref<RouteRecordRaw | null>(null)

function hasOneShowingChild(children: RouteRecordRaw[] = [], parent: RouteRecordRaw): boolean {
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, display the child by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child routers to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', meta: { ...parent.meta, noShowingChildren: true } }
    return true
  }

  return false
}

function resolvePath(routePath: string): string {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}

const visible = computed(() => !props.item.meta?.hidden)
</script>

<template>
  <div v-if="visible">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild?.children || (onlyOneChild?.meta as Record<string, unknown>)?.noShowingChildren) &&
        !(item.meta?.alwaysShow as boolean | undefined)
      "
    >
      <app-link v-if="onlyOneChild?.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="(onlyOneChild.meta as Record<string, unknown>).icon as string"
            :title="(onlyOneChild.meta as Record<string, unknown>).title as string"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item
          v-if="item.meta"
          :icon="(item.meta as Record<string, unknown>).icon as string"
          :title="(item.meta as Record<string, unknown>).title as string"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>
