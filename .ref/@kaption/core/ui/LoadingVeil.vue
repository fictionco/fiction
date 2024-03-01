<script lang="ts" setup>
import type { FactorRouter, FactorUser } from '@factor/api'
import { vue } from '@factor/api'
import ElLoading from './ElLoading.vue'

const props = defineProps({
  factorUser: {
    type: Object as vue.PropType<FactorUser>,
    required: true,
  },
  factorRouter: {
    type: Object as vue.PropType<FactorRouter>,
    required: true,
  },
})
const authLoading = vue.ref(false)

if (props.factorRouter.routeRequiresAuth())
  authLoading.value = true

vue.onMounted(async () => {
  await props.factorUser.userInitialized()
  authLoading.value = false
})
</script>

<template>
  <div
    v-if="authLoading"
    class="loading-veil fixed top-0 left-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900 text-primary-500"
  >
    <ElLoading class="h-16 w-16" />
  </div>
</template>

<style lang="less" scoped>
.loading-veil {
  z-index: 10000;
}
</style>
