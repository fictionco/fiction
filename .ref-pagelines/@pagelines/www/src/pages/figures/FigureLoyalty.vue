<script lang="ts" setup>
import FigureChart from './FigureChart.vue'
import FigureReviewList from './FigureReviewList.vue'
</script>

<template>
  <div class="relative">
    <div class="z-10 aspect-[3/1]">
      <FigureChart
        class="chart-width app-adjust-right z-0 aspect-[3/1] w-full"
      />

      <div
        class="app-adjust-left absolute bottom-8 -left-8 scale-75 md:-left-24"
      >
        <FigureReviewList />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chart-width {
  width: 500px;
  @media (max-width: 600px) {
    transform: scale(0.8);
  }
}
</style>
