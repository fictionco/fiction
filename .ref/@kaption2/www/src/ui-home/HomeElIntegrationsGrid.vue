<script lang="ts" setup>
import { ref } from 'vue'
import type { MediaItem } from '../map'
import { integrationsList } from '../map'

function shuffleArray(a: unknown[]): unknown[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i]
    a[i] = a[j]
    a[j] = temp
  }
  return a
}
const all = ref(integrationsList)
const int = ref<MediaItem<string>[]>([])

function setData() {
  int.value = shuffleArray(all.value).slice(0, 8) as MediaItem<string>[]
}

setInterval(() => {
  setData()
}, 3000)

setData()
</script>

<template>
  <section class="relative">
    <div class="relative z-10 mx-auto max-w-2xl px-4">
      <h2
        class="text-center text-3xl font-extrabold tracking-tight sm:text-5xl"
      >
        Kaption Works Anywhere
      </h2>
      <p
        class="mt-8 text-center text-base leading-relaxed text-theme-500 md:text-xl"
      >
        Kaption works out of the box on most popular platforms and it's simple
        to setup. Use integrations to get even more insights.
      </p>
    </div>
    <div class="max-w-screen-3xl lg:-mx-108 m-auto my-6">
      <div
        class="grid grid-cols-2 items-center justify-center sm:grid-cols-3 lg:flex lg:flex-wrap"
      >
        <template v-for="integration in int" :key="integration.name">
          <div
            class="m-4 block rounded-md py-3 transition-all lg:p-6"
            :title="integration?.name"
          >
            <div
              class="mx-auto flex w-32 max-w-full items-center justify-center sm:w-full"
              :class="integration?.class"
              v-html="integration?.icon"
            />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
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
