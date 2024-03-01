<script lang="ts" setup>
import type { PropType } from 'vue'
import ElemButton from '../el/ElemButton.vue'
import type { CustomTrackEvent } from '..'
import { getRoute } from '..'

defineProps({
  list: { type: Array as PropType<CustomTrackEvent[]>, default: () => [] },
})
</script>

<template>
  <ul class="mt-3 divide-y divide-slate-200">
    <li
      v-for="(event, i) in list"
      :key="i"
      class="py-4 flex justify-between items-center"
    >
      <div class="flex flex-1 items-start">
        <div
          class="cursor-pointer h-10 w-10 rounded-full ring-8 ring-white flex items-center justify-center bg-green-100 text-green-600"
          @click="getRoute('projectEventEdit', { eventName: event.eventName })"
        >
          <svg
            v-if="event.eventType === 'event'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
        </div>

        <div class="ml-3 group cursor-pointer">
          <div class="flex items-center mb-1">
            <router-link
              :to="getRoute('projectEventEdit', { eventName: event.eventName })"
              class="font-semibold text-lg group-hover:text-primary-500 mr-2"
            >
              {{ event.eventName }}
            </router-link>
            <span
              class="ml-1 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-500"
            >
              {{ event.eventType }}
            </span>
          </div>
          <div
            class="flex flex-col items-start text-sm text-slate-500 lg:flex-row lg:items-center"
          >
            <p>{{ event.eventType }}</p>
            <div v-if="event.trigger" class="flex mr-4 mt-2 lg:mt-0">
              Trigger: {{ event.trigger }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <ElemButton
          size="sm"
          btn="default"
          :to="getRoute('projectEventEdit', { eventName: event.eventName })"
        >
          Edit Event
        </ElemButton>
      </div>
    </li>
  </ul>
</template>
