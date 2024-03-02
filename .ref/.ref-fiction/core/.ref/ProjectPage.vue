<script lang="ts" setup>
import { onResetUi, useService, vue } from '@factor/api'
import ElPage from '../ui/ElPage.vue'
import type { FactorAdmin } from '..'

defineProps({
  pro: {
    type: Boolean,
    default: false,
  },
})

const { factorAdmin } = useService<{
  factorAdmin: FactorAdmin
}>()

const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))
</script>

<template>
  <ElPage :menu="factorAdmin.getOrgMenu().value">
    <slot />
    <template v-if="$slots.editor && !pro" #editor>
      <slot name="editor" />
    </template>
  </ElPage>
</template>
