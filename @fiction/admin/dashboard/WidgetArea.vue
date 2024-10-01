<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import type { WidgetLocation } from '../types'
import { useService, vue } from '@fiction/core'
import { getWidgetMap, runWidgetRequests } from './util'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  location: { type: String as vue.PropType<WidgetLocation>, required: true },
})

const service = useService<{ fictionAdmin: FictionAdmin }>()

const widgets = vue.computed(() => {
  const widgetMap = getWidgetMap({ fictionAdmin: service.fictionAdmin })

  return widgetMap[props.location]
})
const loading = vue.ref(false)

async function load() {
  loading.value = true
  try {
    await runWidgetRequests({ widgets: widgets.value, fictionAdmin: service.fictionAdmin })
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => {
  load()
})
</script>

<template>
  <div>
    <div class="grid gap-4 lg:gap-[20px] grid-cols-1 md:grid-cols-2 lg:grid-cols-12 grid-rows-[minmax(0,1fr)]">
      <component
        :is="widget.settings.el"
        v-for="(widget, i) in widgets"
        :key="i"
        :card
        :widget
        class="col-span-12 min-w-0"
      />
    </div>
  </div>
</template>
