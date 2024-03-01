<script lang="ts" setup>
import type { PropType } from 'vue'
import type { CustomTrackEvent } from '..'
import { getRoute } from '..'

defineProps({
  list: { type: Array as PropType<CustomTrackEvent[]>, default: () => [] },
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 py-6 lg:grid-cols-2 xl:grid-cols-3">
    <div
      v-for="(event, i) in list"
      :key="i"
      class="flex flex-col col-span-1 bg-white rounded-md border border-slate-200 divide-y divide-slate-200"
    >
      <div
        class="flex-grow w-full flex items-center justify-between p-6 space-x-6"
      >
        <div class="group cursor-pointer">
          <div class="flex items-center mb-1">
            <router-link
              :to="getRoute('projectEventEdit', { eventId: event.eventId })"
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
        <div
          class="flex-shrink-0 p-3 rounded-md ring-8 ring-white flex items-center justify-center bg-green-100 text-green-600"
        >
          <router-link
            :to="getRoute('projectEventEdit', { eventId: event.eventId })"
          >
            <svg
              v-if="event.eventType === 'event'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
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
              class="w-6 h-6"
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
          </router-link>
        </div>
      </div>
      <div class="mt-auto">
        <div class="flex divide-x divide-slate-200">
          <div class="w-0 flex-1 flex">
            <router-link
              to="/"
              class="relative w-0 flex-1 inline-flex items-center justify-center py-3 text-sm text-slate-500 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 hover:bg-gray-50"
            >
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span class="ml-3">Results</span>
            </router-link>
          </div>
          <div class="w-0 flex-1 flex">
            <router-link
              :to="getRoute('projectEventEdit', { eventId: event.eventId })"
              class="relative w-0 flex-1 inline-flex items-center justify-center py-3 text-sm text-slate-500 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 hover:bg-gray-50"
            >
              <svg
                class="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="ml-3">Edit</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
