import { deepMerge, numberFormatter } from '@factor/api'
import type {
  Chart as ChartClassType,
  ChartConfiguration,
  ChartDataset,
  ChartType,
  ChartTypeRegistry,
  CoreChartOptions,
  TooltipItem,
  TooltipLabelStyle,
  TooltipOptions,
} from 'chart.js'
import * as ChartJS from 'chart.js'
import type { ValueFormat } from '@kaption/types'
import { colorMulti, colorPrimary, colorText } from './_colors'

// need to load this way due to ESM / Node issue at build
const { Chart, registerables } = ChartJS

// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends Record<any, any>
      ? _DeepPartialObject<T>
      : T | undefined
type _DeepPartialArray<T> = Array<DeepPartial<T>>
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> }

if (registerables)
  Chart.register(...registerables)

export interface SetData<T extends keyof ChartTypeRegistry> {
  datasets: {
    data: (number | null)[]
    label: string
    opts?: Partial<ChartDataset<T>>
    color?: string
    bg?: string
    currentDateIndex?: number
  }[]
  labels: string[]
  mode?: 'compare' | 'multi'
}

const colorCompare = (): string[] => [colorPrimary(), colorText()]

function tooltipDefaults<T extends ChartType>(): DeepPartial<
  TooltipOptions<T>
> {
  return {
    mode: 'index',
    intersect: false,
    bodyColor: '#000',
    titleColor: 'blue',
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, .9)',
    titleMarginBottom: 12,

    bodySpacing: 12,
    footerMarginTop: 8,
    padding: 15,
    multiKeyBackground: 'none',

    bodyFont: { weight: 'bold' },

    // usePointStyle: true,
    // displayColors: false,
    callbacks: {
      labelColor: (context: TooltipItem<T>): TooltipLabelStyle => {
        // @ts-expect-error  TODO
        const borderColor = (context.dataset?.borderColor as string) ?? '#000'
        return {
          borderColor,
          backgroundColor: borderColor,
          borderWidth: 4,
          borderRadius: 3,
        }
      },
      labelTextColor: (): string => {
        return '#536573'
      },
      // title: (tooltipItem): string => {
      //   console.log("TOO", tooltipItem)
      //   return ""
      // },
      // beforeBody: (): string => {
      //   return ""
      // },
      label: (context: TooltipItem<T>): string => {
        // @ts-expect-error TODO
        return `  ${context.dataset.label}: ${context.formattedValue}`
      },
    },
  } as const
}
export interface LineChartInstance {
  chart: ChartClassType<keyof ChartTypeRegistry>
  setData: (args: SetData<'line'>) => ChartClassType<keyof ChartTypeRegistry>
}
export function createLineChart(args: {
  el: HTMLCanvasElement
  countFormat?: ValueFormat
  opts?: Partial<ChartConfiguration<'line'>>
}): {
    chart: ChartClassType<keyof ChartTypeRegistry>
    setData: (args: SetData<'line'>) => ChartClassType<keyof ChartTypeRegistry>
  } {
  const { el, countFormat, opts = {} } = args

  const config = deepMerge<ChartConfiguration>([
    {
      type: 'line',

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          // https://www.chartjs.org/docs/latest/configuration/legend.html
          legend: { display: false },

          tooltip: tooltipDefaults(),
        },
        elements: {
          line: { tension: 0.04 },
          point: { radius: 1, hoverBorderWidth: 3, hoverRadius: 3 },
        },

        scales: {
          y: {
            beginAtZero: true, // bottom of chart is zero

            grid: {
              display: false,
              borderColor: 'transparent',
              color: colorPrimary(0.05),
            },

            ticks: {
              font: { size: 10 },
              callback: (tickValue): string | number => {
                return countFormat === 'percent'
                  ? `${tickValue}%`
                  : numberFormatter(tickValue)
              },
              autoSkip: true,
              color: colorText(0.5),
              maxTicksLimit: 5,
            },
          },
          x: {
            beginAtZero: true,
            grid: {
              display: false,
              borderColor: 'transparent',
              color: colorPrimary(0.05),
            },
            ticks: {
              maxTicksLimit: 5,
              font: { size: 10 },
              autoSkip: true,
              maxRotation: 0,
              color: colorText(0.5),
            },
          },
        },
      },

      data: {
        labels: [''],
        datasets: [],
      },
    },
    opts as ChartConfiguration,
  ])

  const theChart = new Chart(el, config)

  return {
    chart: theChart,
    setData: ({
      labels,
      datasets,
      mode = 'compare',
    }: SetData<'line'>): ChartClassType<keyof ChartTypeRegistry> => {
      const colors = mode === 'compare' ? colorCompare() : colorMulti()
      theChart.data.labels = labels

      const chartDatasets: ChartDataset[] = datasets.flatMap((d, i) => {
        const color = d.color ? d.color : colors[i] ? colors[i] : colorPrimary()

        const bg = d.bg ?? '#FFFFFF'

        const config: Partial<ChartDataset> = deepMerge([
          {
            borderWidth: 2,
            borderColor: color,
            pointBorderColor: color,
            hoverBorderColor: color,
            backgroundColor: 'transparent',
            pointBackgroundColor: bg,
            pointHoverBackgroundColor: bg,
            pointRadius: d.data.length > 150 ? 0 : 3,
            pointHoverRadius: 8,
            pointHitRadius: 20,
            hoverRadius: 20,
            fill: true,
          },
          d.opts,
        ])

        const data = d.data
        const label = d.label

        if (
          typeof d.currentDateIndex !== 'undefined'
            && d.currentDateIndex > -1
        ) {
          const dashData = [...data].fill(null, 0, d.currentDateIndex - 1)
          const solidData = [...data].slice(0, d.currentDateIndex)

          return [
            {
              ...config,
              borderDash: [5, 5],
              label,
              data: dashData,
            },
            { ...config, label, data: solidData },
          ]
        }
        else {
          return [
            {
              ...config,
              label: d.label,
              data: d.data,
            },
          ]
        }
      })

      theChart.data.datasets = chartDatasets

      // theChart.data.datasets = datasets
      theChart.update()

      return theChart
    },
  }
}

export interface BarChartInstance {
  chart: ChartClassType<keyof ChartTypeRegistry>
  setData: (args: SetData<'bar'>) => ChartClassType<keyof ChartTypeRegistry>
}
export function createBarChart(args: {
  el: HTMLCanvasElement
  countFormat?: 'number' | 'percent' | 'dollar'
  opts?: Partial<CoreChartOptions<'bar'>>
}): BarChartInstance {
  const { el, countFormat, opts } = args

  const { maintainAspectRatio = false, aspectRatio = 2 } = opts ?? {}

  const theChart = new Chart<'bar'>(el, {
    type: 'bar',

    options: {
      responsive: true,
      maintainAspectRatio,
      aspectRatio,
      plugins: {
        // https://www.chartjs.org/docs/latest/configuration/legend.html
        legend: { display: false },
        tooltip: tooltipDefaults(),
      },

      scales: {
        y: {
          stacked: true,
          beginAtZero: true, // bottom of chart is zero

          grid: {
            display: false,
            borderColor: 'transparent',
            color: colorPrimary(0.05),
          },

          ticks: {
            font: { size: 10 },
            callback: (tickValue): string | number => {
              return countFormat === 'percent'
                ? `${tickValue}%`
                : numberFormatter(tickValue)
            },
            autoSkip: true,
            color: colorText(0.5),
            maxTicksLimit: 5,
          },
        },
        x: {
          stacked: true,
          beginAtZero: true,
          grid: {
            display: false,
            borderColor: 'transparent',
            color: colorPrimary(0.05),
          },
          ticks: {
            font: { size: 10 },
            autoSkip: true,
            maxRotation: 0,
            color: colorText(0.5),
          },
        },
      },
    },

    data: {
      labels: [''],
      datasets: [],
    },
  })

  return {
    chart: theChart,
    setData: ({
      labels,
      datasets,
      mode = 'compare',
    }: SetData<'bar'>): ChartClassType<keyof ChartTypeRegistry> => {
      const colors = mode === 'compare' ? colorCompare() : colorMulti()
      theChart.data.labels = labels

      const chartDatasets: ChartDataset[] = datasets.map((d, i) => {
        const color = colors[i] ? colors[i] : colorPrimary()

        const config: Partial<ChartDataset> = deepMerge([
          {
            borderWidth: 2,
            borderRadius: 2,

            backgroundColor: color,
            hoverBackgroundColor: colorPrimary(1, 'light'),
            pointHoverBorderColor: colorPrimary(1, 'light'),
            borderColor: color,
            pointBorderColor: color,
            hoverBorderColor: colorPrimary(1, 'light'),
            minBarLength: 5,
            hoverRadius: 20,
            fill: true,
          },
          d.opts,
        ])

        return {
          ...config,
          label: d.label,
          data: d.data,
        }
      })

      theChart.data.datasets = chartDatasets as ChartDataset<'bar'>[]
      theChart.update()
      return theChart
    },
  }
}
