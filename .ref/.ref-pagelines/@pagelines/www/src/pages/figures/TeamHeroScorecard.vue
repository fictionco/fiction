<script lang="ts" setup>
import { randomBetween } from '@factor/api'
import { ref } from 'vue'
import LogoCostco from './LogoCostco.svg'

interface StoreItem {
  name: string
  members?: number
  nps?: number
  csat?: number
  responses?: number
}

const stores = ref<StoreItem[]>([
  {
    name: 'Denver',
  },
  {
    name: 'Boulder',
  },
  {
    name: 'Salt lake',
  },
  { name: 'Ogden' },
  { name: 'Newport Beach' },
  {
    name: 'San Clemente',
  },
  {
    name: 'Laguna Beach',
  },
])

function setData(): void {
  stores.value = stores.value
    .map((_) => {
      return {
        ..._,
        members: randomBetween(80, 150),
        nps: randomBetween(60, 80),
        csat: randomBetween(2, 5, 1),
        responses: randomBetween(20, 200),
      }
    })
    .sort((a, b) => {
      const ap = a.nps || 70
      const bp = b.nps || 70

      let result = 0

      if (ap > bp)
        result = -1
      else if (ap < bp)
        result = 1

      return result
    })
}

setInterval(() => {
  setData()
}, 10_000)

setData()
</script>

<template>
  <div class="" :style="{ transform: `` }">
    <div
      class="text-theme-800 w-full rounded-lg bg-white p-5 text-left text-sm shadow-xl ring-1 ring-black/5"
    >
      <img class="mb-4 w-12" :src="LogoCostco">
      <div class="divide-y divide-slate-200">
        <transition-group name="list">
          <div
            v-for="store in stores"
            :key="store.name"
            class="grid grid-cols-12 gap-2 py-2"
          >
            <div class="col-span-4 rounded-md">
              <div class="font-bold">
                {{ store.name }}
              </div>
              <div class="text-theme-400">
                <span class="">{{ store.members }}</span>
                Members
              </div>
            </div>
            <div class="col-span-4">
              <span class="font-bold text-primary-500">{{
                store.responses
              }}</span>
              Responses
            </div>

            <div class="col-span-2">
              <span class="font-bold text-primary-500">{{ store.nps }}</span>
              NPS
            </div>
            <div class="col-span-2">
              <span class="font-bold text-primary-500">{{ store.csat }}</span>
              CSAT
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.list-enter-active,
.list-leave-active,
.list-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.list-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.list-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.list-leave-active {
  position: absolute;
}

.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}
</style>
