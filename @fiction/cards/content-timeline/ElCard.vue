<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { dayjs, pathCheck, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import AnimItemPop from '@fiction/ui/anim/AnimItemPop.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import { schema } from './config'

defineOptions({ name: 'TimelineCard' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const timelineProgress = vue.ref(0)

function updateProgress() {
  const element = document.getElementById(props.card.cardId)
  if (!element)
    return

  const rect = element.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const elementTop = rect.top + scrollTop
  const elementHeight = rect.height

  // Calculate how far we've scrolled into the element
  const scrolledIntoElement = scrollTop - elementTop + (elementHeight * 0.6)

  // Convert to percentage (0 to 1)
  const progress = Math.max(0, Math.min(1, scrolledIntoElement / elementHeight))

  // Scale the progress to be between 0.2 and 0.9
  const scaledProgress = 0.2 + (progress * 0.8)

  timelineProgress.value = scaledProgress
}
// Set up scroll listener
vue.onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress() // Initial calculation

  useElementVisible({
    caller: 'timelineCard',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: 'fade',
        config: {
          overallDelay: 150,
          stagger: 100,
        },
      })
    },
  })
})

vue.onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

function easeIn(x: number): number {
  return x * x
}

const timelineLineStyle = vue.computed(() => {
  const rawProg = timelineProgress.value
  // Apply easeIn to keep progress low initially then accelerate
  const easedProg = easeIn(Math.min(rawProg, 0.93)) * 100

  return {
    background: `linear-gradient(to bottom,
      rgba(var(--primary-500) / 0.1) 0%,
      rgba(var(--primary-500) / 0.8) 15%,
      rgba(var(--primary-500) / 0.8) ${easedProg}%,
      rgba(var(--primary-500) / 0.2) ${easedProg + 7}%,
      rgba(var(--primary-500) / 0.1) 100%
    )`,
  }
})
</script>

<template>
  <div v-if="uc.items?.length" :id="card.cardId" :class="card.classes.value.contentWidth">
    <div class="flex flex-col gap-12 md:gap-24 max-w-4xl mx-auto relative pt-24 pb-8">
      <!-- Animated Timeline Line -->
      <div
        class="absolute left-[19px] md:left-[156px] top-0 bottom-0 w-0.5 transition-all duration-300 ease-in-out"
        :style="timelineLineStyle"
      />

      <!-- Rest of the template remains the same -->
      <div
        v-for="(milestone, i) in uc.items"
        :key="i"
        class="animate-item relative flex gap-4 lg:gap-10 items-start"
      >
        <!-- Date Section -->
        <div class="flex items-center gap-6">
          <AnimItemPop class="hidden md:block w-[120px] pt-2 pr-8 text-right" caller="timelineDate">
            <div class="text-sm font-medium text-theme-600 dark:text-theme-0 font-sans">
              <div
                v-if="milestone.date"
                class="text-theme-500 dark:text-theme-400"
                @click="card.setEditPath({ path: pathCheck(`items.${i}.date`, schema), caller: 'timelineDate' })"
              >
                {{ dayjs(milestone.date).format('MMM YYYY') }}
              </div>
              <div
                v-if="milestone.endDate"
                class="text-theme-500 dark:text-theme-400"
                @click="card.setEditPath({ path: pathCheck(`items.${i}.endDate`, schema), caller: 'timelineDateEnd' })"
              >
                {{ dayjs(milestone.endDate).format('MMM YYYY') }}
              </div>
            </div>
          </AnimItemPop>

          <AnimItemPop class="relative z-10 flex-none" caller="timeline">
            <div class="relative md:-ml-[13px] mt-1">
              <div class="absolute inset-0 bg-primary-50 dark:bg-primary-900/50 rounded-full blur-md opacity-50" />
              <div class="relative flex items-center justify-center size-10 md:size-14 rounded-full bg-primary-50 dark:bg-primary-975 border-2 border-primary-300 dark:border-primary-600">
                <XIcon
                  v-if="milestone.icon"
                  :media="milestone.icon"
                  class="size-6 md:size-8 text-primary-500"
                />
                <div
                  v-else
                  class="size-2 rounded-full bg-primary-500"
                />
              </div>
            </div>
          </AnimItemPop>
        </div>

        <div class="flex-1">
          <div class="space-y-8">
            <div class="space-y-4">
              <div class="flex flex-col ">
                <div class="">
                  <CardText
                    :card="card"
                    :path="pathCheck(`items.${i}.title`, schema)"
                    tag="h3"
                    class="text-xl md:text-3xl lg:text-4xl font-semibold x-font-title"
                    animate="fade"
                  />
                </div>
                <div class="flex flex-col items-start md:flex-row md:items-center gap-1 md:gap-4 mt-1 text-theme-600 dark:text-theme-200 text-base lg:text-2xl">
                  <CardText
                    v-if="milestone.subTitle"
                    :card
                    :path="pathCheck(`items.${i}.subTitle`, schema)"
                    tag="span"
                    :animate="true"
                  />
                  <CardActionArea
                    size="xs"
                    :card
                    :base-path="pathCheck(`items.${i}.badges`, schema)"
                    class="pt-2"
                    :classes="{ buttons: 'flex gap-3' }"
                  />
                </div>
              </div>
              <CardText
                v-if="milestone.content"
                :card="card"
                :path="pathCheck(`items.${i}.content`, schema)"
                tag="p"
                class="text-theme-600 dark:text-theme-400 text-sm md:text-base lg:text-2xl"
                :animate="true"
              />
            </div>

            <div v-if="milestone.media" class="mt-8">
              <XMedia
                :media="milestone.media"
                class="w-full aspect-video rounded-lg overflow-hidden"
              />
            </div>

            <CardActionArea
              v-if="milestone.action"
              :card
              :base-path="pathCheck(`items.${i}.action`, schema)"
              class="pt-2"
              :classes="{ buttons: 'flex gap-4 lg:gap-5' }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
