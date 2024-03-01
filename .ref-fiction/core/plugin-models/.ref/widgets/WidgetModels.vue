<script lang="ts" setup>
import { vue } from '@factor/api'
import WidgetWrap from '../../plugin-dashboards/WidgetWrap.vue'
import { useFictionApp } from '../../util'
import type { Model } from '../model'
import ElModalList from '../el/ElModalList.vue'

const { factorRouter, fictionModel } = useFictionApp()

const models = vue.shallowRef<Model[]>([])
const loading = vue.ref(true)
vue.onMounted(async () => {
  const r = await fictionModel.requestIndex({ table: 'model' })
  models.value = r.items || []
  loading.value = false
})
</script>

<template>
  <WidgetWrap
    :actions="[
      {
        btn: 'default',
        href: factorRouter.link('modelIndex').value,
        name: 'View Models',
      },
    ]"
    :loading="loading"
  >
    <div class="p-3 md:p-6">
      <ElModalList
        @item-click="
          factorRouter.goto('modelTrain', { modelId: $event.modelId })
        "
      />
    </div>
  </WidgetWrap>
</template>
