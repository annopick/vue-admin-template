<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import ScrollPane from './ScrollPane.vue'
import { useTagsViewStore, type TagView } from '@/store/modules/tagsView'
import { useRouteStore } from '@/store/modules/route'
import type { RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()
const routeStore = useRouteStore()

const scrollPane = ref<InstanceType<typeof ScrollPane>>()
const tagsViewContainer = ref<HTMLElement>()

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<TagView>({} as TagView)

const visitedViews = computed(() => tagsViewStore.visitedViews)
const routes = computed(() => routeStore.routes)

watch(route, () => {
  addTags()
  moveToCurrentTag()
})

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  addTags()
})

function isActive(tag: TagView): boolean {
  return tag.path === route.path
}

function addTags() {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route as unknown as TagView)
  }
}

function moveToCurrentTag() {
  nextTick(() => {
    const tagEls = Array.from(
      tagsViewContainer.value?.querySelectorAll('.tags-view-item') ?? [],
    ) as HTMLElement[]
    const currentEl = tagEls.find((el) => el.classList.contains('active'))
    if (currentEl && scrollPane.value) {
      scrollPane.value.moveToTarget(currentEl, tagEls)
    }
  })
}

function closeSelectedTag(view: TagView) {
  const { visitedViews: views } = tagsViewStore.delViewSync(view)
  if (isActive(view)) {
    toLastView(views)
  }
}

function closeOthersTags() {
  tagsViewStore.delOthersViewsSync(selectedTag.value)
  moveToCurrentTag()
}

function closeAllTags() {
  const { visitedViews: views } = tagsViewStore.delAllViewsSync()
  toLastView(views)
}

function toLastView(visitedViews: TagView[]) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath as string)
  } else {
    router.push('/')
  }
}

function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105
  const offsetLeft = tagsViewContainer.value!.getBoundingClientRect().left
  const offsetWidth = tagsViewContainer.value!.offsetWidth
  const maxLeft = offsetWidth - menuMinWidth
  const leftVal = e.clientX - offsetLeft + 15

  left.value = leftVal > maxLeft ? maxLeft : leftVal
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

function closeMenu() {
  visible.value = false
}

function resolvePath(basePath: string, routePath: string): string {
  return path.resolve(basePath, routePath)
}
</script>

<template>
  <div id="tags-view-container" ref="tagsViewContainer" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="closeMenu">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query as Record<string, string> | undefined }"
        custom
        v-slot="{ navigate }"
      >
        <span
          :class="isActive(tag) ? 'active' : ''"
          class="tags-view-item"
          @click="navigate"
          @click.middle="closeSelectedTag(tag)"
          @contextmenu.prevent="openMenu(tag, $event)"
        >
          {{ tag.title }}
          <el-icon
            v-if="!tag.meta?.affix"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <Close />
          </el-icon>
        </span>
      </router-link>
    </scroll-pane>

    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭全部</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
// Reset element-plus el-icon-close sizing inside tags (global, not scoped)
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
