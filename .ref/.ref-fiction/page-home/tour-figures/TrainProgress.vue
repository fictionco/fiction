<script lang="ts" setup>
import { vue } from '@factor/api'
import ElProgress from '@factor/ui/ElProgress.vue'

const animateTrigger = vue.ref(false)
const percent = vue.ref(0)
const message = vue.ref('')
const step = vue.ref(0)

function addPercent() {
  if (percent.value < 97) {
    percent.value += 3
    step.value = Math.min(Math.round(200 * (percent.value / 100)), 200)
    message.value = `starting ${step.value}/200`
  }
  else {
    percent.value = 100
    step.value = 200
    message.value = `server is running`
  }

  if (percent.value < 100)
    setTimeout(addPercent, 100)
}
vue.onMounted(() => {
  const el = document.querySelector(`.feature-train-progress`) as HTMLElement

  const observer = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        animateTrigger.value = true
        addPercent()
        setTimeout(() => {
          animateTrigger.value = false
          observer.unobserve(el)
        }, 2000)
      }
    },
    { threshold: 0.3 },
  )
  if (el)
    observer.observe(el)
})
</script>

<template>
  <div
    class="feature-train-progress border-theme-300 bg-theme-100 rounded-lg border py-2 px-8 shadow-md"
  >
    <ElProgress :percent="percent" :message="message" />
  </div>
</template>
