<script lang="ts" setup>
import type { FactorRouter, FactorUser } from '@factor/api'
import { useService, vue } from '@factor/api'
import ElSpinner from './ElSpinner.vue'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const authLoading = vue.ref(false)

if (factorRouter.routeRequiresAuth())
  authLoading.value = true

vue.onMounted(async () => {
  await factorUser.userInitialized({ caller: 'LoadingVeil' })
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
