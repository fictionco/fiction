export default {}
// import { FactorPlugin, FactorDb } from "@factor/api"
// import { KaptionCache } from "../plugin-cache"
// import { ProjectPrivate } from "../plugin-admin"
// type KaptionUsageSettings = {
//   factorDb: FactorDb
//   kaptionCache: KaptionCache
// }

// type CountItem = "replay" | "event" | "session"
// interface GetCount {
//   projectId: string
//   addOne?: boolean
//   item: CountItem
//   allowed?: number
// }

// interface ItemCounter {
//   total: number
//   lastAddedTime: number
// }

// interface EventKeys {
//   lastAdded: string
//   usage: string
//   daily: string
//   lastReset: string
// }

// type EventKeyMap = {
//   lastReported: string
//   session: EventKeys
//   event: EventKeys
//   replay: EventKeys
// }

// export class KaptionUsage extends FactorPlugin<KaptionUsageSettings> {
//   factorDb!: FactorDb
//   kaptionCache!: KaptionCache
//   constructor(settings: KaptionUsageSettings) {
//     super("usage", settings)

//     if (!this.utils.isApp()) {
//       this.factorDb = settings.factorDb
//       this.kaptionCache = settings.kaptionCache
//     }
//   }
//   setup() {}
//   getOrgCacheKey = (id: string): string => {
//     return `org:${id}`
//   }

//   getTrackingKey = (id: string, item: CountItem, key: string): string => {
//     return `org:${id}:${item}:${key}`
//   }

//   getKeys = (organizationId: string): EventKeyMap => {
//     const baseKey = `org:${organizationId}`

//     const dataTypes = ["session", "event"]

//     const dataTypeEntries = dataTypes.map((key) => {
//       return [
//         key,
//         {
//           usage: `${baseKey}:${key}:usage`,
//           lastAdded: `${baseKey}:${key}:lastAdded`,
//           lastReset: `${baseKey}:${key}:lastReset`,
//           daily: `${baseKey}:${key}:daily`,
//         },
//       ] as [string, Record<string, string>]
//     })

//     const dataTypeKeys =
//       Object.fromEntries<Record<string, string>>(dataTypeEntries)

//     return {
//       lastReported: `${baseKey}:lastReported`,
//       ...dataTypeKeys,
//     } as EventKeyMap
//   }

//   /**
//    * Get amount of items within 24 hour sliding window
//    */
//   getAmountToday = async (args: {
//     organizationId: string
//     item: CountItem
//     addOne: boolean
//   }): Promise<ItemCounter> => {
//     const { organizationId, item, addOne = false } = args
//     const cache = this.kaptionCache.getCache()

//     if (!cache) throw new Error("server cache is not available")

//     const keys = this.getKeys(organizationId)

//     const lastResetKey = keys[item].lastReset

//     const dailyKey = keys[item].daily
//     const usageKey = keys[item].usage
//     const lastAddedKey = keys[item].lastAdded

//     // check if daily key is today, if not update it and reset daily counter
//     const currentDay = this.utils.dayjs().startOf("day").toISOString()
//     const dailyResetValue = await cache.get(lastResetKey)
//     if (dailyResetValue !== currentDay) {
//       this.log.info(`reset daily: ${dailyResetValue} - current: ${currentDay} `)
//       await cache.multi().set(dailyKey, 0).set(lastResetKey, currentDay).exec()
//     }

//     if (addOne) {
//       await cache
//         .multi()
//         .incr(usageKey)
//         .incr(dailyKey)
//         .set(lastAddedKey, +Date.now())
//         .exec()
//     }

//     const r = await cache.multi().get(dailyKey).get(lastAddedKey).exec()

//     const [total, lastAddedTime] =
//       r?.map(([_err, result]) => +(result as string) || 0) ?? []

//     return { total, lastAddedTime }
//   }

//   dailyCounter = async (args: GetCount): Promise<ItemCounter> => {
//     const { projectId, addOne = false, item } = args

//     const project: ProjectPrivate | undefined =
//       await this.kaptionCache.fetchProjectDetails(projectId)

//     const organizationId = project?.organizationId

//     if (!organizationId) {
//       throw this.stop({ message: "no organization id" })
//     }

//     return await this.getAmountToday({ organizationId, item, addOne })
//   }

//   getActiveProject = async (args: {
//     projectId: string
//     addSession?: boolean
//     addReplay?: boolean
//     addEvent?: boolean
//   }): Promise<ProjectPrivate | undefined> => {
//     const { projectId, addSession, addReplay, addEvent } = args

//     const result: ProjectPrivate | undefined =
//       await this.kaptionCache.fetchProjectDetails(projectId)

//     if (result) {
//       result.dailyEvents = 250_000
//       result.dailySessions = 50_000
//       result.dailyReplays = 15

//       const [todaySessions, todayReplays, todayEvents] = await Promise.all([
//         await this.dailyCounter({
//           projectId,
//           addOne: addSession,
//           item: "session",
//         }),
//         await this.dailyCounter({
//           projectId,
//           addOne: addReplay,
//           item: "replay",
//         }),
//         await this.dailyCounter({ projectId, addOne: addEvent, item: "event" }),
//       ])
//       result.todaySessions = todaySessions.total
//       result.todayReplays = todayReplays.total
//       result.todayEvents = todayEvents.total

//       // result.trackingEligible = todaySessions.total < result.dailySessions

//       // const noThrottle =
//       //   todayReplays.lastAddedTime < +Date.now() - 1000 * 60 * 30

//       // // eligible if under limit, throttle by 5 minutes
//       // result.replayEligible =
//       //   process.env.NODE_ENV === "development" ||
//       //   (todayReplays.total < result.dailyReplays && noThrottle)

//       // result.details = [
//       //   `throttle: ${noThrottle} (${todayReplays.lastAddedTime})`,
//       //   `replays: ${todayReplays.total}`,
//       //   `e: ${result.todayEvents}`,
//       // ]
//     }

//     return result
//   }
// }
