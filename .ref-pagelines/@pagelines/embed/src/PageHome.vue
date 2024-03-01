<script lang="ts" setup>
import type { FactorRouter } from '@factor/api'
import { useService } from '@factor/api'
import ElLoading from '@factor/ui/ElLoading.vue'

useService<{ factorRouter: FactorRouter }>()
</script>

<template>
  <div class="p-12 text-center text-xs uppercase text-slate-300">
    <div
      class="loading-veil text-theme-500 fixed inset-0 z-50 flex h-full w-full items-center justify-center"
    >
      <ElLoading key="loading" />
    </div>
  </div>
</template>
