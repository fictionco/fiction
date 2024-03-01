<script lang="ts" setup>
import FigureNps from '../@apps/site/src/figures/FigureNps.vue'
import FigureCsat from '../@apps/site/src/figures/FigureCsat.vue'
import VectorDashboard from './VectorDashboard.svg'
</script>

<template>
  <div class="stage max-w-lg mx-auto">
    <FigureNps
      class="nps-figure absolute -right-6 md:-left-48 -bottom-10 md:bottom-12 shadow-lg"
    />
    <FigureCsat
      class="csat-figure hidden md:block absolute -right-48 top-12"
    />
    <img
      class="shadow-lg w-full md:max-w-2xl ring-black ring-opacity-10 ring-1 rounded-lg"
      :src="VectorDashboard"
    >
  </div>
</template>

<style lang="less">
.stage {
  perspective: 1000px;
}
</style>
