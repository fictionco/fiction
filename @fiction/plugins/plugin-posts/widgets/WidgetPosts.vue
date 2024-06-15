<script lang="ts" setup>
import type { vue } from '@fiction/core'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import type { FictionPosts } from '..'

type SubscriberWidget = FictionPosts['widgets']['recentPosts']

const props = defineProps({
  widget: { type: Object as vue.PropType<SubscriberWidget>, required: true },
})
</script>

<template>
  <WidgetWrap :widget>
    123
  </WidgetWrap>
</template>
