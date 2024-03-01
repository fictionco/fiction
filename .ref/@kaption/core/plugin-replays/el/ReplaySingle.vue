<script lang="ts" setup>
import { vue } from '@factor/api'
import { Replayer } from 'rrweb'
import type { eventWithTime, metaEvent } from 'rrweb/typings/types'
import ElProgressBar from '../../ui/ElProgressBar.vue'
import ElZeroState from '../../ui/ElZeroState.vue'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'
import type { ReplayEvent, ReplaySessionEvent } from '../types'
import PageWrap from '../../plugin-analytics/el/PageWrap.vue'
import SessionDetails from './SessionDetails.vue'
import SessionEvents from './SessionEvents.vue'

const { factorRouter, kaptionReplay } = useKaption()
const route = factorRouter.router.currentRoute

const replayId = vue.computed(() => {
  return route.value.params.replayId as string
})
const playing = vue.ref(false)
const loading = vue.ref(true)
const showSidebar = vue.ref(true)
const errorMessage = vue.ref<string | undefined>()
const fullSession = vue.ref<Partial<ReplaySessionEvent>>()
const renderWidth = vue.ref(0)
const renderHeight = vue.ref(0)
const containerHeight = vue.ref(0)
const replayer = vue.ref<Replayer | undefined>()
const currentTime = vue.ref<number>(0)
const playerMeta = vue.ref<Record<string, any>>({})

const recording = vue.computed<eventWithTime[]>(() => {
  const rec = fullSession.value?.replayData ?? []

  return rec as eventWithTime[]
})

function setDimensions(): void {
  const customPlayerEl = document.querySelector('#customPlayer') as HTMLElement
  if (customPlayerEl) {
    const containerBox = customPlayerEl.getBoundingClientRect()
    if (containerBox.width < renderWidth.value) {
      const ratio = containerBox.width / renderWidth.value
      containerHeight.value = renderHeight.value * ratio
      const wr = document.querySelector('.replayer-wrapper') as HTMLElement

      if (wr) {
        wr.style.position = 'absolute'
        wr.style.transform = `scale(${ratio})`
      }
    }
  }
}

const currentTimeFormatted = vue.computed(() => {
  const currentSeconds = currentTime.value / 1000
  const v = kaptionReplay.playerDuration(currentSeconds)

  return v
})
const totalTime = vue.computed<number>(() => {
  return playerMeta.value.totalTime as number
})
const percentComplete = vue.computed(() => {
  const p = (currentTime.value / totalTime.value) * 100
  return `${p}%`
})
const totalTimeFormatted = vue.computed(() => {
  return kaptionReplay.playerDuration(totalTime.value / 1000)
})

function pause(_args: { reason: string }): void {
  replayer.value?.pause()
  playing.value = false
}

function loopTimer(): void {
  if (errorMessage.value)
    return

  let __timer: number | undefined
  if (__timer) {
    cancelAnimationFrame(__timer)
    __timer = undefined
  }
  const updateTimer = (): void => {
    currentTime.value = replayer.value?.getCurrentTime() ?? 0

    if (
      currentTime.value > playerMeta.value.totalTime
      || typeof currentTime.value === 'undefined'
      || currentTime.value < 0
    ) {
      pause({ reason: 'bounds' })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      goToTime(0)
    }
    else if (playing.value === true) {
      __timer = requestAnimationFrame(updateTimer)
    }
  }
  __timer = requestAnimationFrame(updateTimer)
}

function play(timeOffset?: number): void {
  const _offset = timeOffset ?? currentTime.value
  replayer.value?.play(_offset)
  playing.value = true
  loopTimer()
}

function playPause(): void {
  if (playing.value)
    pause({ reason: 'playPause' })
  else
    play()
}

function goToTime(timeOffset: number): void {
  pause({ reason: 'goToTime' })
  play(timeOffset)
  if (!playing.value)
    pause({ reason: 'goToTimePause' })
}

function setOffset(event: MouseEvent): void {
  const el = document.querySelector('#playerTimeline')
  if (el) {
    const rect = el.getBoundingClientRect()
    const width = rect.width
    const x = event.clientX - rect.left
    const percentage = x / width
    const offset = totalTime.value * percentage
    goToTime(offset)
  }
}

function loadPlayer(events: ReplayEvent[]): void {
  const customPlayerEl = document.querySelector('#customPlayer') as HTMLElement

  if (customPlayerEl) {
    replayer.value = new Replayer(events as eventWithTime[], {
      root: customPlayerEl,
      skipInactive: true,
    })

    const dimensionEvent: metaEvent = events.find(
      e => e.type === 4,
    ) as metaEvent

    if (!dimensionEvent) {
      loading.value = false
      errorMessage.value = 'there was an issue with this replay'
      throw new Error('no replay dimension event was found')
    }
    else {
      const { width, height } = dimensionEvent?.data ?? {}

      renderWidth.value = width
      renderHeight.value = height

      setDimensions()

      playerMeta.value = replayer.value.getMetaData()

      play()
    }
  }
}

async function loadFullSession(): Promise<void> {
  loading.value = true

  const r = await kaptionReplay.requestFullReplaySession({
    replayId: replayId.value,
  })

  if (r.status === 'success' && r.data?.replayData) {
    fullSession.value = r.data

    loadPlayer(r.data.replayData)
  }
  else {
    errorMessage.value = r.message
  }

  loading.value = false
}

async function init(): Promise<void> {
  if (!replayId.value)
    return

  loading.value = true

  const customPlayerEl = document.querySelector('#customPlayer') as HTMLElement

  if (customPlayerEl)
    customPlayerEl.innerHTML = ''

  pause({ reason: 'init' })
  goToTime(0)

  await loadFullSession()
  loading.value = false
}

vue.onMounted(() => init())

vue.watch(
  () => route.value.query.replay,
  () => init(),
)
</script>

<template>
  <PageWrap>
    <template #actions>
      <ElButton btn="primary" :to="factorRouter.link(`replayIndex`).value">
        &larr; Back to All Replays
      </ElButton>
    </template>
    <div class="grid grid-cols-12 gap-8">
      <div
        class="col-span-12 overflow-hidden rounded-md border border-slate-300"
        :class="showSidebar ? `lg:col-span-9 ` : ``"
      >
        <div v-if="loading" class="m-72 flex items-center justify-center">
          <ElProgressBar text="Downloading" />
        </div>
        <ElZeroState
          v-else-if="!loading && errorMessage"
          class="py-32 text-center text-lg font-semibold text-theme-400"
          :title="`${errorMessage}`"
        />
        <div
          v-else
          class="relative z-0 flex items-center justify-between border-b border-slate-300 bg-white p-2"
        >
          <div class="mr-2 flex w-full items-center justify-center space-x-3">
            <div
              class="text-primary-500 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-theme-100"
              @click="playPause()"
            >
              <!-- play -->
              <svg
                v-if="!playing"
                class="h-8"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M17.5192 11.1362C18.1807 11.5221 18.1807 12.4779 17.5192 12.8638L8.50387 18.1227C7.83721 18.5116 7 18.0308 7 17.259L7 6.74104C7 5.96925 7.83722 5.48838 8.50387 5.87726L17.5192 11.1362Z"
                />
              </svg>
              <!-- pause -->
              <svg
                v-else
                class="h-8"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 8V17M15 8V17"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div
              class="flex items-center justify-center rounded-full text-sm font-medium text-theme-500"
            >
              {{ currentTimeFormatted }} / {{ totalTimeFormatted }}
            </div>

            <div
              id="playerTimeline"
              class="group relative mx-4 flex grow cursor-pointer rounded-full border bg-theme-100"
              @mouseup="setOffset($event)"
            >
              <div
                class="handler bg-primary-500 absolute -top-1.5 left-1/2 z-30 -ml-2 block h-4 w-4 cursor-pointer rounded-full shadow-xl"
                :style="{ left: percentComplete }"
              />
              <div
                class="bg-primary-400 h-1.5 w-1/2 rounded-full"
                :style="{ width: percentComplete }"
              />
            </div>
          </div>
        </div>

        <!-- video -->
        <div class="relative">
          <div
            id="customPlayer"
            class="flex grow justify-center overflow-hidden rounded-xl"
            :style="{
              height: containerHeight ? `${containerHeight}px` : 'auto',
            }"
          />
        </div>
      </div>

      <div v-show="showSidebar" class="col-span-12 lg:col-span-3">
        <SessionDetails />
        <SessionEvents :recording="recording" />
      </div>
    </div>
  </PageWrap>
</template>

<style lang="less">
@import "./player.css";
.replayer-wrapper {
  transform-origin: 0 0;
  top: 0;
  left: 0;
}
</style>
