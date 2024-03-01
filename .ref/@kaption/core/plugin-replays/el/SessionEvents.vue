<script lang="ts" setup>
import { durationFormatter, vue } from '@factor/api'
import type { customEvent, eventWithTime } from 'rrweb/typings/types'
import ElBox from '../../ui/ElAvatar.vue'
import type { ReplayEvent } from '../types'
import type { EventParams } from '../../plugin-beacon'

const props = defineProps({
  recording: { type: Array as vue.PropType<ReplayEvent[]>, default: () => [] },
})

const initialTimestamp = vue.computed(() => {
  const v = props.recording?.[0] ?? undefined
  return v ? v.timestamp : undefined
})

function delay(ts: number): number {
  if (!initialTimestamp.value)
    return 0
  return ts - initialTimestamp.value
}
const replayEvents = vue.computed(() => {
  const rec = props.recording as (customEvent<EventParams> & eventWithTime)[]
  const filtered = rec.filter(_ => _.type === 5 && _.data.payload.event)

  return filtered.map((event) => {
    const { data, timestamp } = event
    const payload = data.payload
    const d = delay(timestamp)
    const page = payload.pathname
    const e = {
      ...payload,
      delay: d,
      page,
      timeline: durationFormatter(Math.round(d / 1000)),
      timestamp,
    }

    return e
  })
})
</script>

<template>
  <ElBox
    v-if="replayEvents.length > 0"
    class="mb-6"
    title="Points of Interest"
  >
    <div
      class="scrolling-touch max-h-120 flow-root overflow-hidden overflow-y-auto py-6 px-4 lg:px-6"
    >
      <ul class="overflow-hidden">
        <li v-for="(ev, i) in replayEvents" :key="i">
          <div class="relative pb-8">
            <span
              class="absolute top-5 left-3 -ml-px h-full w-0.5 bg-theme-200"
              aria-hidden="true"
            />
            <div class="relative flex items-start space-x-3">
              <div class="px-0">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white"
                  :class="[
                    ev.category === 'friction'
                      ? 'bg-gray-500 text-white'
                      : ev.category === 'interaction'
                        ? 'bg-primary-500 text-white'
                        : 'bg-theme-100 text-gray-500',
                  ]"
                >
                  <svg
                    class="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <template v-if="ev.event === 'view'">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"
                      />
                    </template>
                    <template v-else-if="ev.event === 'error'">
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </template>
                    <template v-else-if="ev.category === 'friction'">
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </template>
                    <template v-else-if="ev.category === 'interaction'">
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </template>
                    <template v-else>
                      <path
                        fill-rule="evenodd"
                        d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                        clip-rule="evenodd"
                      />
                    </template>
                  </svg>
                </div>
              </div>

              <div class="flex flex-1 text-sm leading-6">
                <div class="mr-0.5">
                  <div class="flex">
                    <div class="font-semibold capitalize">
                      {{ ev.event }}
                    </div>
                  </div>
                  <div class="text-xs text-theme-500">
                    <div v-if="ev.label">
                      <span class="mr-3 opacity-50">Label:</span>
                      <span>{{ ev.label }}</span>
                    </div>
                    <div v-if="ev.page">
                      <span class="mr-3 opacity-50">Path:</span>
                      <span>{{ ev.page }}</span>
                    </div>
                    <div v-if="ev.selector">
                      <span class="mr-3 opacity-50">Selector:</span>
                      <span>{{ ev.selector }}</span>
                    </div>
                  </div>
                </div>
                <div class="ml-auto whitespace-nowrap">
                  <router-link to="/" class="text-primary-500 font-medium">
                    {{
                      ev.timeline
                    }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </ElBox>
</template>
