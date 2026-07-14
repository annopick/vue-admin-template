<script setup lang="ts">
import { computed } from 'vue'
import { isExternal } from '@/utils/validate'

const props = defineProps<{ to: string }>()

const isExternalLink = computed(() => isExternal(props.to))
const linkType = computed(() => (isExternalLink.value ? 'a' : 'router-link'))
</script>

<template>
  <component :is="linkType" :to="!isExternalLink ? to : undefined" :href="isExternalLink ? to : undefined">
    <slot />
  </component>
</template>
