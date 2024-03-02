<script lang="ts" setup>
import dayjs from 'dayjs'
import { randomBetween, timeAgo } from '@factor/api'
import { ref } from 'vue'
import LogoTesla from './LogoTesla.svg'
import avatarBoy1 from './img/avatarBoy1.svg'
import avatarBoy3 from './img/avatarBoy3.svg'
import avatarBoy4 from './img/avatarBoy4.svg'
import avatarBoy5 from './img/avatarBoy5.svg'
import avatarGirl1 from './img/avatarGirl1.svg'
import avatarGirl2 from './img/avatarGirl2.svg'

interface StoreItem {
  name: string
  avatar?: string
  message?: string
  timestamp?: number
  timeAgo?: string
}

const stores = ref<StoreItem[]>([
  {
    name: 'Niels Bohr',
    avatar: avatarBoy1,
  },
  {
    name: 'Emily Watson',
    avatar: avatarGirl1,
  },
  { name: 'Albert Einstein', avatar: avatarBoy3 },

  { name: 'Richard Feynmann', avatar: avatarBoy4 },

  {
    name: 'Isaac Newton',
    avatar: avatarBoy5,
  },
  {
    name: 'Marie Curie',
    avatar: avatarGirl2,
  },
])

const messages = [
  'Hey, I have a question',
  `I can't seem to figure out how to install this program.`,
  `Are you guys open on President's day?`,
  `Thank you so much for this...`,
  `I have a pricing question.`,
  `I have a question for your management team`,
  `Holiday sale question`,
  `Directions to this location.`,
]

function setData(): void {
  stores.value = stores.value
    .map((_, i) => {
      const sent = dayjs().subtract(randomBetween(1, 8), 'day')
      return {
        ..._,
        message: messages[i],
        timestamp: sent.unix(),
        timeAgo: timeAgo(sent),
      }
    })
    .sort((a, b) => {
      const ap = a.timestamp || 70
      const bp = b.timestamp || 70

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
      <img class="mb-4 w-12" :src="LogoTesla">
      <div class="divide-y divide-slate-200">
        <transition-group name="list">
          <div
            v-for="store in stores"
            :key="store.name"
            class="grid grid-cols-12 gap-2 py-4"
          >
            <div class="col-span-4 flex space-x-3 rounded-md">
              <div><img class="h-8 w-8" :src="store.avatar"></div>
              <div>
                <div class="font-bold">
                  {{ store.name }}
                </div>
                <div class="text-theme-400">
                  <span class="">{{ store.timeAgo }}</span>
                </div>
              </div>
            </div>
            <div class="text-theme-400 col-span-4 text-xs">
              {{ store.message }}
            </div>

            <div class="col-span-2 text-right">
              <span class="font-bold text-primary-500">Reply &rarr;</span>
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
