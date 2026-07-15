<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElScrollbar } from 'element-plus'

const emit = defineEmits<{ (e: 'scroll'): void }>()

const tagAndTagSpacing = 4

const scrollContainer = ref<InstanceType<typeof ElScrollbar>>()

const scrollWrapper = computed<HTMLElement | undefined>(() => {
  return (scrollContainer.value as unknown as { wrapRef?: HTMLElement })?.wrapRef
})

function handleScroll(e: WheelEvent) {
  const eventDelta = (e as WheelEvent & { wheelDelta?: number }).wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollWrapper.value
  if ($scrollWrapper) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
  }
}

function emitScroll() {
  emit('scroll')
}

function moveToTarget(currentTag: HTMLElement, tagList: HTMLElement[]) {
  const $container = (scrollContainer.value as unknown as { $el?: HTMLElement })?.$el
  const $scrollWrapper = scrollWrapper.value
  if (!$container || !$scrollWrapper) return

  const $containerWidth = $container.offsetWidth

  let firstTag: HTMLElement | null = null
  let lastTag: HTMLElement | null = null

  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
  } else {
    const currentIndex = tagList.findIndex((item) => item === currentTag)
    const prevTag = tagList[currentIndex - 1]
    const nextTag = tagList[currentIndex + 1]

    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

onMounted(() => {
  scrollWrapper.value?.addEventListener('scroll', emitScroll, true)
})

onBeforeUnmount(() => {
  scrollWrapper.value?.removeEventListener('scroll', emitScroll)
})

defineExpose({ moveToTarget })
</script>

<template>
  <el-scrollbar ref="scrollContainer" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :deep() {
    .el-scrollbar__bar {
      bottom: 0;
    }

    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
