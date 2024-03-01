<script lang="ts" setup>
import FigurePhone from '../@apps/site/src/figures/FigurePhone.vue'
import SurveyEngineDashboard from './SurveyEngineDashboard.svg'
import SurveyPhone from './SurveyPhone.svg'
</script>

<template>
  <div
    class="stage max-w-lg mx-auto relative"
    :style="{ perspective: `800px` }"
  >
    <div
      class="absolute -bottom-12 -right-12 z-10"
      :style="{ transform: `rotateY(-13deg) rotateZ(4deg)` }"
    >
      <FigurePhone class="shadow-xl w-36" layout="email">
        <img class="w-full" :src="SurveyPhone">
      </FigurePhone>
    </div>
    <img
      class="shadow-lg w-full md:max-w-2xl ring-black ring-opacity-10 ring-1 rounded-lg"
      :src="SurveyEngineDashboard"
    >
  </div>
</template>
