<template>
  <div class="">
    <section class="splash">
      <div class="relative mb-24 overflow-hidden">
        <div
          class="overlay custom-shadow-inset pointer-events-none absolute top-0 left-0 z-20 h-full w-full select-none"
        ></div>
        <div
          class="relative z-0 m-auto grid max-w-screen-xl grid-cols-12 px-8 pt-16"
        >
          <div class="content col-span-6 py-24">
            <router-link
              class="mb-8 inline-block text-xs font-semibold uppercase tracking-wider text-slate-400"
              to="/showcase"
            >
              <span> &larr; Back to Showcase </span>
            </router-link>
            <div class="text">
              <div class="title-wrap">
                <div class="flex max-w-md items-center justify-between">
                  <div>
                    <h1 class="title text-xl font-bold lg:text-6xl">
                      {{ item.name }}
                    </h1>
                    <div
                      v-if="item.authorName"
                      class="author mt-2 text-sm font-semibold"
                    >
                      <span class="mr-1">by</span>
                      <a
                        :href="item.authorUrl"
                        target="_blank"
                        class="text-primary-500"
                      >
                        {{ item.authorName }}
                      </a>
                    </div>
                  </div>
                  <div v-if="item.icon" class="icon-area mb-4">
                    <img
                      :src="item.icon"
                      :alt="`${item.name} icon`"
                      class="h-12 w-12 rounded-lg"
                    />
                  </div>
                </div>
                <h3
                  class="description mt-6 max-w-md text-lg text-slate-700 lg:text-xl"
                >
                  {{ item.description }}
                </h3>

                <div class="actions mt-8 flex space-x-6">
                  <ElButton btn="primary" size="lg" :href="item.url">
                    View Site</ElButton
                  >
                  <ElButton
                    v-if="item.repo"
                    btn="default"
                    size="lg"
                    :href="item.repo"
                  >
                    View Code</ElButton
                  >
                </div>
                <div
                  v-if="item.tags"
                  class="tags mt-8 text-xs font-semibold text-slate-300"
                >
                  <span v-for="tag in item.tags" :key="tag" class="mr-2">{{
                    tag
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="media relative col-span-6 h-full">
            <div class="drawer relative h-full">
              <transition-group tag="div" name="gallery">
                <div
                  v-for="(img, i) in screenshots"
                  :key="img"
                  class="absolute left-20 h-full w-96 origin-bottom-right transition-all duration-500"
                  :style="screenshotStyle(i)"
                >
                  <div
                    class="aspect-h-12 aspect-w-8 absolute -bottom-12 h-full w-full cursor-pointer overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/10"
                    :class="`sc-${i + 1}`"
                    @click="nextScreenshot()"
                  >
                    <div
                      class="screenshot-image absolute h-full w-full bg-cover bg-center"
                      :style="{ backgroundImage: `url('${img}')` }"
                    />
                  </div>
                </div>
              </transition-group>
              <div
                v-if="screenshots.length > 1"
                class="arrow-wrap absolute bottom-4 z-20 text-center"
              >
                <div
                  class="arrow w-full cursor-pointer text-center text-6xl text-slate-500 opacity-20 transition-opacity hover:opacity-50"
                  @click="nextScreenshot()"
                >
                  &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { vue, vueRouter } from "@factor/api"
import ElButton from "@factor/ui/ElButton.vue"
import { map as showcase } from "./map"

const animationInterval = 3000
const timer = vue.ref<NodeJS.Timeout>()
const router = vueRouter.useRouter()
const screenshots = vue.ref<string[]>([])

const item = vue.computed(() => {
  const slug = router.currentRoute.value.params.slug

  return showcase.find((_) => _.permalink == slug) || {}
})

vue.watch(
  () => item.value,
  () => {
    screenshots.value = item.value.screenshots || []
  },
  { immediate: true },
)

const nextScreenshot = (): void => {
  if (screenshots.value.length <= 1) return

  const removed = screenshots.value.splice(0, 1)

  setTimeout(() => {
    screenshots.value = [...screenshots.value, ...removed]
  }, 500)

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  runTimer()
}

const runTimer = (): void => {
  if (screenshots.value.length <= 1) return
  if (timer.value) clearTimeout(timer.value)

  timer.value = setTimeout(() => nextScreenshot(), animationInterval)
}

const screenshotStyle = (
  index: number,
): { transform: string; zIndex: number } => {
  const style = {
    transform: `translate(${index * (15 - index)}%, ${index}%) scale(${
      1 - index * 0.05
    })`,
    zIndex: 50 - index,
  }

  return style
}

vue.onMounted(() => runTimer())
</script>

<style lang="less">
.custom-shadow-inset {
  box-shadow: inset 0 0 0 1px rgba(0, 43, 93, 0.06),
    inset 0 0 1px rgba(58, 55, 148, 0.25),
    inset 0 -12px 34px 0 rgba(24, 32, 41, 0.03);
}
</style>
