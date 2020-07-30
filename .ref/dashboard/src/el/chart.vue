<template>
  <div class="chart-wrap">
    <canvas ref="myChart" class="chart" width="200" height="300" />
  </div>
</template>
<script lang="ts">
import { toLabel } from "@factor/api"
import Chart from "chart.js"
import { numberFormatter, dateFormatter } from "../util"
import { getGraphData } from "./data"

const graphData = getGraphData()

export default {
  components: {},
  props: {},
  data() {
    return {
      graphData: {},
      colorPrimary: "84,53,255",
      colorSecondary: "255,138,0",
    }
  },
  computed: {},
  mounted(this: any) {
    const el = this.$refs.myChart as HTMLCanvasElement
    this.ctx = el.getContext("2d")

    const label = "Visitors"

    const dataSet = this.buildDataSet(
      graphData.plot,
      graphData.presentIndex,
      this.ctx,
      label
    )

    this.chart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: graphData.labels,
        datasets: dataSet,
      },
      options: {
        legend: { display: false },
        responsive: true,
        maintainAspectRatio: false,
        elements: { line: { tension: 0 }, point: { radius: 0 } },
        onClick: this.onClick.bind(this),
        tooltips: {
          mode: "index",
          intersect: false,
          titleFontSize: 16,
          footerFontSize: 12,
          bodyFontSize: 16,
          backgroundColor: "rgba(25, 30, 56)",
          titleMarginBottom: 8,
          bodySpacing: 6,
          footerMarginTop: 8,
          xPadding: 16,
          yPadding: 12,
          multiKeyBackground: "none",
          callbacks: {
            title: (dataPoints) => {
              const { xLabel } = dataPoints[0]

              return dateFormatter(xLabel as string, graphData.interval)
            },
            beforeBody: (): string => {
              this.drawnLabels = {}
              return ""
            },
            label: (item): string => {
              let out = ""
              const {
                data: { datasets },
              } = this.chart

              const datasetIndex = item.datasetIndex ?? 0

              const dataset = datasets[datasetIndex]

              if (!this.drawnLabels[dataset.label]) {
                this.drawnLabels[dataset.label] = true
                out = ` ${item.yLabel} ${dataset.label}`
              }

              return out
            },
            footer: (): string => {
              if (graphData.interval === "month") {
                return "Click to view month"
              } else if (graphData.interval === "date") {
                return "Click to view day"
              } else return ""
            },
          },
        },
        scales: {
          yAxes: [
            {
              id: "y1",
              scaleLabel: { labelString: "Vis" },
              ticks: {
                callback: numberFormatter,
                beginAtZero: true,
                autoSkip: true,
                maxTicksLimit: 8,
              },
              gridLines: {
                zeroLineColor: "transparent",
                drawBorder: false,
              },
            },
            // {
            //   id: "y2",
            //   scaleLabel: { labelString: "Bounce" },
            //   position: "right",
            //   ticks: {
            //     callback: (v) => Math.floor(v * 100) + "%",
            //     beginAtZero: true,
            //     autoSkip: true,
            //     maxTicksLimit: 8,
            //   },
            //   gridLines: {
            //     display: false,
            //   },
            // },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: 8,
                callback: (isoDate) => dateFormatter(isoDate, graphData.interval),
              },
            },
          ],
        },
      },
    })
  },
  methods: {
    toLabel,
    onClick(e) {
      console.log("DO SOMETHING ON CLICK")
    },
    createGradient(this: any, baseRGB = "84,53,255", opacity: 1): CanvasGradient {
      var gradient = this.ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, `rgba(${baseRGB}, ${opacity * 0.3})`)
      gradient.addColorStop(1, `rgba(${baseRGB}, 0.0)`)
      return gradient
    },
    rgba(rgb: string, opacity = 1): string {
      return `rgba(${rgb}, ${opacity})`
    },
    lineColor(
      this: any,
      rgb: string,
      opacity = 1
    ): {
      borderWidth: number
      borderColor: string
      pointBackgroundColor: string
      backgroundColor: string | CanvasGradient
    } {
      return {
        borderWidth: 3,
        borderColor: this.rgba(rgb, opacity),
        pointBackgroundColor: this.rgba(rgb, opacity),
        backgroundColor: this.createGradient(rgb, opacity),
      }
    },
    buildDataSet(
      plot: number[],
      presentIndex: number,
      ctx: CanvasRenderingContext2D,
      label: string
    ) {
      if (presentIndex) {
        var dashedPart = plot.slice(presentIndex - 1)
        var dashedPlot = new Array(plot.length - dashedPart.length).concat(dashedPart)
        for (var i = presentIndex; i < plot.length; i++) {
          plot[i] = undefined
        }

        return [
          {
            label,
            data: plot,
            ...this.lineColor(this.colorPrimary),
          },
          {
            label,
            data: dashedPlot,
            borderDash: [5, 10],
            ...this.lineColor(this.colorPrimary),
          },
          // {
          //   label: "Something else",
          //   yAxisID: "y2",
          //   data: graphData.plot2,
          //   ...this.lineColor(this.colorSecondary, 0.6),
          // },
        ]
      } else {
        return [
          {
            label,
            data: plot,
            ...this.lineColor(this.colorPrimary),
          },
        ]
      }
    },
  },
}
</script>
<style lang="postcss" scoped>
.chart-wrap {
  .chart {
    width: 100%;
    height: 300px;
  }
}
</style>
