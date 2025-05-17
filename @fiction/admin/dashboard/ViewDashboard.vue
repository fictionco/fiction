<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '../index'
import type { WidgetConfig } from '../widgets/index'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{
  card: Card
}>()

const service = useService<{ fictionAdmin: FictionAdmin }>()

const loading = vue.ref(false)
const widgets = vue.shallowRef<WidgetConfig[]>([])

async function load() {
  loading.value = true
  try {
    widgets.value = await service.fictionAdmin.getWidgets({ card })
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => load())
</script>

<template>
  <div class="max-w-[960px] mx-auto p-6 md:p-12 flex flex-col gap-4 lg:gap-8 xl:gap-12 justify-center min-h-[100dvh] overflow-scroll">
    <component
      :is="widget.el"
      v-for="(widget, i) in widgets"
      :key="i"
      :card
      :widget
      class="w-full"
    />
  </div>
</template>
