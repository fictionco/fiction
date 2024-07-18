export default {}
// import { describe, it, expect } from "vitest"

// describe("detect multiple clicks", () => {
//   const event = new MouseEvent("click")

//   it("return false clicks number less than target count", () => {
//     expect(
//       detectMultiClick({
//         count: 2,
//         interval: 1,
//         clicks: [
//           {
//             event,
//             time: new Date(),
//           },
//         ],
//         radius: 1,
//       }),
//     ).toBe(false)
//   })

//   it("return false when time diff is greater than interval", () => {
//     expect(
//       detectMultiClick({
//         count: 2,
//         interval: 1,
//         clicks: [
//           {
//             event,
//             time: new Date(),
//           },
//           {
//             event,
//             time: new Date(Date.now() + 2000),
//           },
//         ],
//         radius: 1,
//       }),
//     ).toBe(false)
//   })

//   it("will check distance between click points 1", () => {
//     expect(
//       detectMultiClick({
//         count: 2,
//         interval: 2,
//         clicks: [
//           {
//             event,
//             time: new Date(),
//           },
//           {
//             event,
//             time: new Date(Date.now() + 1000),
//           },
//         ],
//         radius: 1,
//       }),
//     ).toBe(true)
//   })

//   it("will check distance between click points 2", () => {
//     expect(
//       detectMultiClick({
//         count: 2,
//         interval: 2,
//         clicks: [
//           {
//             event: {
//               ...event,
//               clientX: 1,
//               clientY: 1.1,
//             },
//             time: new Date(),
//           },
//           {
//             event,
//             time: new Date(Date.now() + 1000),
//           },
//         ],
//         radius: 1,
//       }),
//     ).toBe(false)
//   })
// })

// describe("activity trigger", () => {
//   beforeEach(() => {
//     jest.useFakeTimers()
//   })

//   afterEach(() => {
//     jest.useRealTimers()
//   })

//   it("trigger onIdle hook when no interactions in idleTime", () => {
//     return new Promise((resolve) => {
//       activityTrigger({
//         onIdle() {
//           expect(true).toBe(true)
//           resolve(true)
//         },
//       })
//       window.dispatchEvent(new MouseEvent("click"))
//       jest.advanceTimersByTime(10 * 60 * 1000)
//     })
//   })

//   it("trigger onActive hook when listened interactions during timer", () => {
//     return new Promise((resolve) => {
//       activityTrigger({
//         onActive() {
//           expect(true).toBe(true)
//           resolve(true)
//         },
//       })
//       // start
//       window.dispatchEvent(new MouseEvent("click"))
//       // onActive
//       window.dispatchEvent(new MouseEvent("click"))
//     })
//   })
// })
