<script lang="ts" setup>
import WidgetWrap from '../../plugin-dashboards/WidgetWrap.vue'
import ElRenderList from '../el/ElRenderList.vue'
import { useFictionApp } from '../../util'

const { factorRouter, fictionModel } = useFictionApp()

// const indexState = fictionModel.activeIndexState

// vue.onMounted(async () => {
//   await fictionModel.loadIndex({ table: "render" })
// })

// const renders = vue.computed(() => {
//   if (!indexState.value?.render) return []

//   return indexState.value.render
// })
</script>

<template>
  <WidgetWrap
    :actions="[
      {
        btn: 'default',
        href: factorRouter.link('renderCreate').value,
        name: 'View Renders',
      },
    ]"
  >
    <div class="p-3 md:p-6">
      <ElRenderList />
    </div>
  </WidgetWrap>
</template>
