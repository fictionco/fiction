<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '../..'
import type { getWidgets } from './index.js'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'

type WidgetConfig = ReturnType<typeof getWidgets>['sites']

defineProps({
  widget: { type: Object as vue.PropType<WidgetConfig>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
})
</script>

<template>
  <WidgetWrap :widget>
    test
  </WidgetWrap>
</template>
