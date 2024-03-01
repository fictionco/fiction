<script lang="ts" setup>
import { resetUi, vue } from '@factor/api'
import { useKaption } from '../../utils'
import ElControl from '../../ui/ElControl.vue'

const { kaptionDashboard, factorRouter } = useKaption()
const filter = kaptionDashboard.kaptionFilter

const list = vue.computed(() => {
  return filter.activeDimensions.value.map((dimension) => {
    return {
      name: dimension.name,
      value: dimension.value,
      desc: dimension.custom ? 'custom' : '',
    }
  })
})

async function selectDimension(value?: string): Promise<void> {
  const route = factorRouter.router.currentRoute.value
  if (value) {
    await factorRouter.push({
      query: {
        ...route.query,
        dimension: value,
      },
    })
    resetUi({ scope: 'all', cause: 'selectDimension' })
  }
}

const selectedDimension = vue.computed<{ name: string, value: string }>(() => {
  const route = factorRouter.router.currentRoute.value
  const routeDimension = route.query.dimension

  const dimension = kaptionDashboard.kaptionFilter.activeDimensions.value.find(
    _ => _.value === routeDimension,
  )
  if (dimension)
    return dimension
  else
    return { name: 'Select Dimension', value: '' }
})
</script>

<template>
  <ElControl
    :list="list"
    default-value="day"
    :model-value="selectedDimension.value"
    align-dropdown="left"
    @update:model-value="selectDimension($event as string)"
  />
</template>
