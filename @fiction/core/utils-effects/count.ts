import { vue } from '../utils'

/**
 * Get the magnitude of a number
 */
export function magnitude(n: number) {
  const order = Math.floor(Math.log10(n))
  return 10 ** order
}
/**
 * Animate the count of a number using a reactive ref
 */
export function animateCount(args: {
  value?: number | string
  activeValue?: vue.Ref<number>
}) {
  const { activeValue = vue.ref(0) } = args
  let { value = 0 } = args

  if (typeof value === 'string')
    value = Number.parseInt(value)

  vue.watch(
    () => value,
    (end) => {
      if (end !== activeValue.value) {
        const range = end - activeValue.value
        const mag = Math.min(magnitude(range) / 10, 1)

        const stepTime = Math.abs(Math.floor(1200 / range))
        const timer = setInterval(() => {
          const increment = end > activeValue.value ? mag : -mag
          activeValue.value += increment

          if (activeValue.value === end)
            clearInterval(timer)

          setTimeout(() => clearInterval(timer), 3000)
        }, stepTime)
      }
    },
    { immediate: true },
  )

  return activeValue
}
