export default {}
// import { getRouter, dayjs } from "@factor/api"
// import { computed } from "vue"
// import { ComparePeriods, TimeLineInterval } from "@kaption/core"

// export type RangeValue<T = unknown> = {
//   name: string
//   timeStart: dayjs.Dayjs
//   timeEnd: dayjs.Dayjs
//   value: T
// }

// export const naiveIsoString = (dateTime: dayjs.Dayjs): string => {
//   return dateTime.format("YYYY-MM-DD")
// }
// export const activeCompare = computed<ComparePeriods>(() => {
//   const route = getRouter().currentRoute.value
//   const compare = route.query.compare as ComparePeriods

//   return compare ?? "period"
// })

// export const activeEndTime = computed<string>(() => {
//   const route = getRouter().currentRoute.value
//   const toQ = route.query.to as string
//   const endTime = toQ ? toQ : naiveIsoString(dayjs().local().startOf("day"))

//   return endTime
// })

// export const activeStartTime = computed<string>(() => {
//   const route = getRouter().currentRoute.value
//   const fromQ = route.query.from as string
//   const startTime = fromQ
//     ? fromQ
//     : naiveIsoString(dayjs(activeEndTime.value).subtract(7, "day"))
//   return startTime
// })

// export const activeInterval = computed<TimeLineInterval>(() => {
//   const route = getRouter().currentRoute.value
//   const interval = route.query.interval as TimeLineInterval

//   const end = dayjs(activeEndTime.value)
//   const start = dayjs(activeStartTime.value)

//   const sliceInterval = interval
//     ? interval
//     : end.diff(start, "day") > 4
//     ? "day"
//     : "hour"

//   return sliceInterval
// })
// export const compareDateRangeList = (): RangeValue<ComparePeriods>[] => {
//   const end = dayjs(activeEndTime.value)
//   const start = dayjs(activeStartTime.value)
//   const diff = end.diff(start, "day") + 1

//   return [
//     {
//       name: "period",
//       timeStart: start.subtract(diff, "day"),
//       timeEnd: end.subtract(diff, "day"),
//       value: "period",
//     },
//     {
//       name: "week",
//       timeStart: start.subtract(1, "week"),
//       timeEnd: end.subtract(1, "week"),
//       value: "week",
//     },
//     {
//       name: "month",
//       timeStart: start.subtract(1, "month"),
//       timeEnd: end.subtract(1, "month"),
//       value: "month",
//     },
//     {
//       name: "quarter",
//       timeStart: start.subtract(3, "month"),
//       timeEnd: end.subtract(3, "month"),
//       value: "quarter",
//     },
//     {
//       name: "year",
//       timeStart: start.subtract(1, "year"),
//       timeEnd: end.subtract(1, "year"),
//       value: "year",
//     },
//   ]
// }

// const activeCompareRange = computed((): RangeValue<string> => {
//   const ranges = compareDateRangeList()
//   return ranges.find((_) => _.value === activeCompare.value) ?? ranges[0]
// })

// export const getCurrentDateIndex = <T extends { date: string }>(
//   data: T[],
// ): number => {
//   const interval = activeInterval.value

//   return data.findIndex(
//     (_) =>
//       dayjs(_.date).isSame(dayjs(), interval) ||
//       dayjs(_.date).isAfter(dayjs(), interval),
//   )
// }

// /**
//  * Refines and adjusts raw data from the API
//  * Fills in empty dates, etc.
//  */
// export const intervalDataPoints = <T extends { date: string }>(args: {
//   timeStart?: dayjs.Dayjs
//   timeEnd?: dayjs.Dayjs
//   interval?: TimeLineInterval
//   windowInterval?: TimeLineInterval
//   compare?: boolean
//   data: T[]
// }): T[] => {
//   const comp = activeCompareRange.value

//   const { compare, interval = activeInterval.value } = args

//   const {
//     timeStart = compare ? comp.timeStart : dayjs(activeStartTime.value),
//     timeEnd = compare ? comp.timeEnd : dayjs(activeEndTime.value),
//     windowInterval = interval === "month" ? "month" : "day",
//     data,
//   } = args
//   const newData: { date: string; [key: string]: any }[] = []

//   let loopTime = timeStart.local().startOf(windowInterval)
//   const finishTime = timeEnd.local().endOf(windowInterval)

//   while (
//     loopTime.isSame(finishTime, interval) ||
//     loopTime.isBefore(finishTime, interval)
//   ) {
//     const date = loopTime.utc().toISOString()

//     const found = data.find((_) => _.date === date)

//     newData.push({ date, ...found })
//     loopTime = loopTime.add(1, interval)
//   }

//   return newData as T[]
// }

// export const activeDateFormat = computed(() => {
//   const interval = activeInterval.value
//   const out = [`MMM DD`]

//   if (interval === "hour") {
//     out.push("ha")
//   }
//   return out.join(", ")
// })

// // export const activeDaysBetween = computed<number>(() => {
// //   return activeEndTime.value.diff(activeStartTime.value, "day")
// // })

// export const dateRangeList = (): {
//   name: string
//   timeStart: string
//   timeEnd: string
// }[] => {
//   const today = dayjs().local().startOf("day")

//   const dates = {
//     today,
//     yesterday: today.subtract(1, "day"),
//     recent: today.subtract(3, "day"),
//     week: today.subtract(7, "day"),
//     month: today.subtract(28, "day"),
//     quarter: today.subtract(3, "month"),
//     year: today.subtract(365, "day"),
//     yearToDate: today.startOf("year"),
//   }

//   const ranges = [
//     {
//       name: "Today",
//       timeStart: naiveIsoString(dates.today),
//     },
//     {
//       name: "Yesterday",
//       timeEnd: naiveIsoString(dates.yesterday),
//       timeStart: naiveIsoString(dates.yesterday),
//     },
//     {
//       name: "Last 3 Days",
//       timeStart: naiveIsoString(dates.recent),
//     },
//     {
//       name: "Last 7 Days",
//       timeStart: naiveIsoString(dates.week),
//     },
//     {
//       name: "Last Month",
//       timeStart: naiveIsoString(dates.month),
//     },
//     {
//       name: "Last Quarter",
//       timeStart: naiveIsoString(dates.quarter),
//     },
//     {
//       name: "Last Year",
//       timeStart: naiveIsoString(dates.year),
//     },
//     {
//       name: "Month to date",
//       timeStart: naiveIsoString(today.startOf("month")),
//     },
//     {
//       name: "Year to date",
//       timeStart: naiveIsoString(today.startOf("year")),
//     },
//   ]

//   const r = ranges.map((r) => {
//     return { timeEnd: naiveIsoString(dates.today), ...r }
//   })

//   return r
// }

// export const intervalList = (): Partial<RangeValue<TimeLineInterval>>[] => {
//   return [
//     {
//       name: "Hour",
//       value: "hour",
//     },
//     {
//       name: "Day",
//       value: "day",
//     },
//     {
//       name: "Week",
//       value: "week",
//     },
//     {
//       name: "Month",
//       value: "month",
//     },
//   ]
// }
