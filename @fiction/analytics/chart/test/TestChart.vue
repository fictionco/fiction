<script lang="ts" setup>
import DateChart from '../DateChart.vue'
import { data } from './sampleData'
</script>

<template>
  <div class="p-12 max-w-lg mx-auto">
    <DateChart v-bind="data" />
  </div>
</template>
