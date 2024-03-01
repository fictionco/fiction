import { vue } from '@factor/api'

export function magnitude(n: number) {
  const order = Math.floor(Math.log10(n))
  return 10 ** order
}

export function animateCount(args: { data: number, v: vue.Ref<number> }) {
  const { data, v } = args
  vue.watch(
    () => data,
    (end) => {
      if (end !== v.value) {
        const range = end - v.value
        const mag = Math.min(magnitude(range) / 10, 1)

        const stepTime = Math.abs(Math.floor(1200 / range))
        const timer = setInterval(() => {
          const increment = end > v.value ? mag : -mag
          v.value += increment

          if (v.value === end)
            clearInterval(timer)

          setTimeout(() => clearInterval(timer), 3000)
        }, stepTime)
      }
    },
    { immediate: true },
  )

  return v
}
