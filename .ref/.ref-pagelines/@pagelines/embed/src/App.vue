<script lang="ts" setup>
import type { FactorRouter } from '@factor/api'
import { useService } from '@factor/api'

useService<{ factorRouter: FactorRouter }>()
</script>

<template>
  <div class="wrap-app">
    <RouterView />
  </div>
</template>
