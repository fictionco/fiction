<template>
  <div class="chart">
    <canvas ref="myChart" width="400" height="400" />
  </div>
</template>
<script lang="ts">
import { toLabel } from "@factor/api"
import Chart from "chart.js"
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  mounted() {
    const el = this.$refs.myChart as HTMLCanvasElement
    var ctx = el.getContext("2d")
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(84, 53, 255, .1)",
            borderColor: "#5435ff",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    })
  },
  methods: { toLabel },
}
</script>
<style lang="postcss" scoped>
.chart {
}
</style>
