<script lang="ts" setup>
import FigureChart from './FigureChart.vue'
import SurveyResultsVector from './SurveyResultsVector.svg'
</script>

<template>
  <div
    class="stage relative mx-auto max-w-lg"
    :style="{ perspective: `800px` }"
  >
    <div class="z-10" :style="{ transform: `rotateY(-4deg) rotateZ(1deg)` }">
      <FigureChart class="z-0 ml-12" :style="{ width: '700px' }" />
    </div>
    <img
      class="absolute -left-6 -bottom-16 z-10 w-full rounded-lg shadow-lg ring-1 ring-black/10 md:max-w-2xl"
      :style="{ transform: `rotateY(4deg) rotateZ(-1deg)` }"
      :src="SurveyResultsVector"
    >
  </div>
</template>
