<script lang="ts" setup>
import type { NavCardUserConfig } from '@fiction/admin'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import ManageIndex from './ManageIndex.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <div class="max-w-[920px] mx-auto py-12">
    <ManageIndex :card />
  </div>
</template>
