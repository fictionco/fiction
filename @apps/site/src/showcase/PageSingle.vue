<template>
  <div class="">
    <section class="splash">
      <div class="relative overflow-hidden mb-24">
        <div
          class="overlay absolute w-full h-full top-0 left-0 z-20 pointer-events-none select-none custom-shadow-inset"
        ></div>
        <div
          class="grid grid-cols-12 m-auto max-w-screen-xl pt-16 px-8 z-0 relative"
        >
          <div class="content col-span-6 py-24">
            <router-link
              class="uppercase font-semibold text-color-400 text-xs tracking-wider inline-block mb-8"
              to="/showcase"
            >
              <span> &larr; Back to Showcase </span>
            </router-link>
            <div class="text">
              <div class="title-wrap">
                <div class="flex justify-between items-center max-w-md">
                  <div>
                    <h1 class="title text-xl lg:text-6xl font-bold">
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
                      class="rounded-lg w-12 h-12"
                    />
                  </div>
                </div>
                <h3
                  class="description text-color-700 text-lg lg:text-xl max-w-md mt-6"
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
                  class="tags text-xs mt-8 font-semibold text-color-300"
                >
                  <span v-for="tag in item.tags" :key="tag" class="mr-2">{{
                    tag
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="media col-span-6 h-full relative">
            <div class="drawer h-full relative">
              <transition-group tag="div" name="gallery">
                <div
                  v-for="(img, i) in screenshots"
                  :key="img"
                  class="duration-500 w-96 h-full absolute origin-bottom-right transition-all left-20"
                  :style="screenshotStyle(i)"
                >
                  <div
                    class="cursor-pointer shadow-lg ring-1 ring-opacity-10 ring-black aspect-h-12 aspect-w-8 -bottom-12 absolute w-full h-full bg-white rounded-md overflow-hidden"
                    :class="`sc-${i + 1}`"
                    @click="nextScreenshot()"
                  >
                    <div
                      class="screenshot-image bg-center bg-cover absolute h-full w-full"
                      :style="{ backgroundImage: `url('${img}')` }"
                    />
                  </div>
                </div>
              </transition-group>
              <div
                v-if="screenshots.length > 1"
                class="arrow-wrap z-20 absolute bottom-4 text-center"
              >
                <div
                  class="arrow text-6xl w-full text-center cursor-pointer transition-opacity opacity-20 hover:opacity-50 text-color-500"
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
import { computed, ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import ElButton from "@factor/ui/ElButton.vue"
import { map as showcase } from "./map"

const animationInterval = 3000
const timer = ref()
const router = useRouter()
const screenshots = ref<string[]>([])

const item = computed(() => {
  const slug = router.currentRoute.value.params.slug

  return showcase.find((_) => _.permalink == slug) || {}
})

watch(
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
  clearTimeout(timer.value)
  timer.value = setTimeout(() => nextScreenshot(), animationInterval)
}

const screenshotStyle = (index: number) => {
  const style = {
    transform: `translate(${index * (15 - index)}%, ${index}%) scale(${
      1 - index * 0.05
    })`,
    zIndex: 50 - index,
  }

  return style
}

onMounted(() => runTimer())
</script>

<style lang="less">
.custom-shadow-inset {
  box-shadow: inset 0 0 0 1px rgba(0, 43, 93, 0.06),
    inset 0 0 1px rgba(58, 55, 148, 0.25),
    inset 0 -12px 34px 0 rgba(24, 32, 41, 0.03);
}
</style>
