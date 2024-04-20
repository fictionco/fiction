<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElButton from '@fiction/ui/ElButton.vue'
import ElIndexGrid from '@fiction/ui/ElIndexGrid.vue'
import type { FictionExtend } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

type UserConfig = {
  isNavItem: boolean
}
const service = useService<{ fictionExtend: FictionExtend }>()

const list = vue.computed(() => {
  return service.fictionExtend.extensions.value.map((ext) => {
    return {
      ...ext,
      key: ext.extensionId,
    }
  })
})
</script>

<template>
  <ElIndexGrid :list="list" />
</template>
