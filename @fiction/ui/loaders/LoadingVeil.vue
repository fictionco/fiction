<script lang="ts" setup>
import type { FictionRouter, FictionUser } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import ElSpinner from './ElSpinner.vue'

const { fictionRouter, fictionUser } = useService<{
  fictionRouter: FictionRouter
  fictionUser: FictionUser
}>()

const authLoading = vue.ref(false)

if (fictionRouter.routeRequiresAuth())
  authLoading.value = true

vue.onMounted(async () => {
  await fictionUser.userInitialized({ caller: 'LoadingVeil' })
  authLoading.value = false
})
</script>

<template>
  <div
    v-if="authLoading"
    class="loading-veil fixed top-0 left-0 flex h-full w-full items-center justify-center bg-white text-slate-300"
  >
    <ElSpinner class="h-12 w-12" />
  </div>
</template>

<style lang="less" scoped>
.loading-veil {
  z-index: 10000;
}
</style>
