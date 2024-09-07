import process from 'node:process'
import { colorStandard, deepMerge, numberFormatter } from '@fiction/core/utils/index.js'
import * as ChartJS from 'chart.js'
import type { NumberFormats } from '@fiction/core/utils/index.js'
import type { Chart as ChartClassType, ChartConfiguration, ChartDataset, ChartType, ChartTypeRegistry, ScriptableContext, ScriptableLineSegmentContext, TooltipItem, TooltipLabelStyle, TooltipOptions } from 'chart.js'

// need to load this way due to ESM / Node issue at build
const { Chart, registerables } = ChartJS

export type DeepPartial<T> = T extends (...args: any[]) => any
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

function cssVar(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback
}

export interface DataSet {
  data: (number | null)[]
  label: string
  opts?: Record<string, unknown>
  color?: string
  bg?: string
  presentIndex?: number
  futureIndex?: number
}

export interface SetData {
  datasets: DataSet[]
  labels: string[]
  mode?: 'compare' | 'multi'
  dataKey?: string
}

// const colorCompare = (): string[] => [
//   colorStandard({ color: "primary" }),
//   colorStandard({ color: "slate", level: 300 }),
// ]

function lineColor(_dataset: DataSet) {
  return (_context: ScriptableContext<'line'>) => {
    return cssVar('--chart-line-color', colorStandard({ color: 'blue', level: 500 }))
  }
}

function gridColor() {
  return cssVar('--chart-grid-color', colorStandard({ color: 'slate', level: 50 }))
}

function textColor() {
  return cssVar('--chart-text-color', colorStandard({ color: 'slate', level: 500 }))
}

function tooltipBgColor() {
  return cssVar('--chart-tooltip-bg-color', 'rgba(15,23, 42, .85)')
}

function tooltipTextColor() {
  return cssVar('--chart-tooltip-text-color', 'blue')
}

function barColor(dataset: DataSet) {
  return (context: ScriptableContext<'bar'>) => {
    const presentIndex = dataset.presentIndex
    const color = context.datasetIndex % 2 === 0 ? colorStandard({ color: 'blue', level: 500 }) : colorStandard({ color: 'blue', level: 100 })

    const value = presentIndex !== undefined && presentIndex > -1 && context.dataIndex > presentIndex
      ? colorStandard({ color: 'blue', level: 50 })
      : color

    return value
  }
}

function tooltipDefaults<T extends ChartType>(): DeepPartial< TooltipOptions<T>> {
  return {
    mode: 'index',
    intersect: false,
    bodyColor: tooltipTextColor(),
    titleColor: tooltipTextColor(),
    // borderColor: "rgba(0, 0, 0, .1)",
    // borderWidth: 1,
    backgroundColor: tooltipBgColor(),
    titleMarginBottom: 12,
    bodySpacing: 12,
    footerMarginTop: 8,
    padding: 15,
    multiKeyBackground: 'none',
    usePointStyle: true,
    /**
     * Remove duplicates from tooltip
     * Tough to figure out as this runs many times.
     */
    filter: (e: TooltipItem<T>, index: number, array: TooltipItem<T>[]): boolean => {
      const labels = array
        .map((item) => {
          // @ts-expect-error  TODO
          return item.dataset.label as string
        })
        .map((item, i, arr) => {
          return arr.findIndex(_ => _ === item) !== i
        })

      return !labels[index]
    },
    // usePointStyle: true,
    // displayColors: false,
    callbacks: {
      labelPointStyle() {
        return { pointStyle: 'circle', rotation: 0 }
      },
      labelColor: (context: TooltipItem<T>): TooltipLabelStyle => {
        // @ts-expect-error  TODO
        const cb = context.dataset?.borderColor as (context: TooltipItem<T>,) => string
        const bg = cb ? cb(context) : '#000'
        return {
          borderColor: tooltipTextColor(),
          backgroundColor: bg,
          borderWidth: 2,
          borderRadius: 3,
        }
      },
      labelTextColor: (): string => {
        return tooltipTextColor()
      },

      label(context: TooltipItem<T>) {
        // @ts-expect-error TODO
        const label = context.dataset.label as string

        if (!label)
          return ''

        return `  ${label}: ${context.formattedValue}`
      },
    },
  } as const
}
export interface CreatedChart<T extends keyof ChartTypeRegistry> {
  chart?: ChartClassType<T>
  setData: (args?: SetData) => ChartClassType<T> | void
}

export function createLineChart(args: {
  el: HTMLCanvasElement
  countFormat?: NumberFormats
  opts?: Partial<ChartConfiguration<'line'>>
}): CreatedChart<'line'> {
  // no canvas in tests
  if (process.env.TEST_ENV === 'unit')
    return { setData: () => {} }

  const { el, countFormat, opts = {} } = args

  const config = deepMerge<ChartConfiguration<'line'>>([
    {
      type: 'line',
      options: {
        animation: { duration: 500 },
        responsive: true,
        aspectRatio: 2,
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
              // display: false,
              // borderColor: "transparent",
              color: gridColor(),
            },

            ticks: {
              maxTicksLimit: 5,
              font: { size: 11, weight: 'bold' },
              callback: (tickValue): string | number => countFormat === 'percent' ? `${tickValue}%` : numberFormatter(tickValue),
              autoSkip: true,
              color: textColor(),
            },
          },
          x: {
            beginAtZero: true,
            grid: {
              display: false,
              /// borderColor: "transparent",
              color: gridColor(),
            },
            ticks: {
              maxTicksLimit: 5,
              font: { size: 11, weight: 'bold' },
              autoSkip: true,
              maxRotation: 0,
              color: textColor(),
            },
          },
        },
      },

      data: { labels: [''], datasets: [] },
    },
    opts as ChartConfiguration<'line'>,
  ])

  const theChart = new Chart(el, config)

  return {
    chart: theChart,
    setData: (params?: SetData): ChartClassType<'line'> => {
      const { labels, datasets = [] } = params || {}
      //    const colors = mode === "compare" ? colorCompare() : colorMulti()
      theChart.data.labels = labels

      if (!theChart.data.datasets)
        theChart.data.datasets = []

      const chartDatasets: ChartDataset<'line'>[] = datasets.flatMap((d) => {
        // const data = d.data
        // const label = d.label

        let out: ChartDataset<'line'>[] = []

        const bg = d.bg ?? cssVar('--chart-bg-color', '#FFFFFF')

        const config: Partial<ChartDataset<'line'>> = deepMerge([
          {
            borderWidth: 2,
            borderColor: lineColor(d),
            pointBorderColor: lineColor(d),
            hoverBorderColor: lineColor(d),
            backgroundColor: 'transparent',
            pointBackgroundColor: bg,
            pointHoverBackgroundColor: bg,
            pointRadius: d.data.length > 120 ? 0 : 3,
            pointHoverRadius: 8,
            pointHitRadius: 20,
            // hoverRadius: 20,
            fill: true,
            animation: {
              delay: (context: ScriptableContext<'line'>) => {
                return context.dataIndex * 3
              },
            },
            segment: {
              borderDash: (context: ScriptableLineSegmentContext) => {
                // p0 -> p1 for each segment span
                if (d.presentIndex !== undefined && d.presentIndex > -1 && context.p1DataIndex >= d.presentIndex) {
                  return [5, 5]
                }
              },
            },
          },
          d.opts,
        ])

        // if (typeof d.presentIndex !== "undefined" && d.presentIndex > -1) {
        //   const dashData = [...data].fill(null, 0, d.presentIndex)
        //   const solidData = [...data].slice(0, d.presentIndex + 1)

        //   const ds: ChartDataset<"line">[] = [
        //     {
        //       ...config,
        //       borderDash: [5, 5],
        //       data: dashData,
        //       label,
        //     },
        //     { ...config, label, data: solidData },
        //   ]

        //   out = ds
        // } else {
        //   out = [{ ...config, label: d.label, data: d.data }]
        // }

        out = [{ ...config, label: d.label, data: d.data }]

        return out
      })

      theChart.data.datasets = chartDatasets

      // theChart.data.datasets = datasets
      theChart.update()

      return theChart
    },
  }
}

export function createBarChart(args: {
  el: HTMLCanvasElement
  countFormat?: 'number' | 'percent' | 'dollar'
  opts?: Partial<ChartConfiguration<'bar'>>
}): CreatedChart<'bar'> {
  // no canvas in tests
  if (process.env.TEST_ENV === 'unit')
    return { setData: () => {} }

  const { el, countFormat, opts } = args

  const config = deepMerge<ChartConfiguration<'bar'>>([
    {
      type: 'bar',

      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2.5,
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
              // borderColor: "transparent",
              color: gridColor(),
            },

            ticks: {
              font: { size: 10 },
              callback: (tickValue): string | number => {
                return countFormat === 'percent' ? `${tickValue}%` : numberFormatter(tickValue)
              },
              autoSkip: true,
              color: textColor(),
              maxTicksLimit: 5,
            },
          },
          x: {
            stacked: true,
            beginAtZero: true,
            grid: {
              display: false,
              // borderColor: "transparent",
              color: gridColor(),
            },
            ticks: {
              font: { size: 10 },
              autoSkip: true,
              maxRotation: 0,
              color: textColor(),
            },
          },
        },
      },

      data: {
        labels: [''],
        datasets: [],
      },
    },
    opts as ChartConfiguration<'bar'>,
  ])

  const theChart = new Chart<'bar'>(el, config)

  return {
    chart: theChart,
    setData: (params?: SetData): ChartClassType<'bar'> => {
      const { labels, datasets = [] } = params || {}
      // const colors = mode === "compare" ? colorCompare() : colorMulti()
      theChart.data.labels = labels
      if (!theChart.data.datasets)
        theChart.data.datasets = []

      const _chartDatasets: ChartDataset[] = datasets.map((d, i) => {
        // const color = d.color || colors[i] || colorStandard()

        const config: Partial<ChartDataset<'bar'>> = deepMerge([
          {
            order: i,
            borderWidth: 2,
            borderRadius: 2,
            borderColor: barColor(d),
            backgroundColor: barColor(d),
            hoverBackgroundColor: colorStandard({ color: 'pink', level: 500 }),
            hoverBorderColor: colorStandard({ color: 'pink', level: 500 }),
            minBarLength: 3,
            animation: {
              delay: (context: ScriptableContext<'bar'>) => {
                return context.dataIndex * 20
              },
            },
            // pointBorderColor: color,
          },
          d.opts,
        ])

        const out = {
          ...config,
          label: d.label,
          data: d.data as number[],
        }

        const found = theChart.data.datasets.findIndex(
          ds => ds.label === d.label,
        )

        if (found > -1) {
          theChart.data.datasets[found].backgroundColor = config.backgroundColor
          theChart.data.datasets[found].borderColor = config.borderColor
          theChart.data.datasets[found].data = out.data
        }
        else {
          theChart.data.datasets.push(out)
        }

        return out
      })

      // theChart.data.datasets = chartDatasets as ChartDataset<"bar">[]
      theChart.update()
      return theChart
    },
  }
}
