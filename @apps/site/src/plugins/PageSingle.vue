<template>
  <div class="extend-container">
    <div class="mt-12 mb-24">
      <div class="text-center">
        <h1 class="text-center text-3xl tracking-tight font-bold sm:text-5xl">
          Plugins
        </h1>
        <h3 class="text-color-500 text-2xl mt-4">
          Simple ways to add new features to your app or site
        </h3>
      </div>
    </div>

    <div class="m-auto max-w-screen-xl mb-24">
      <div class="theme-grid grid grid-cols-12 gap-4 lg:gap-8">
        <div
          v-for="(item, index) in plugins"
          :key="index"
          class="grid-item-theme col-span-4 cursor-pointer"
          @click="goToPermalink(item.permalink)"
        >
          <div
            class="theme-wrap bg-cover bg-top aspect-h-12 aspect-w-8 rounded-md shadow-lg ring-1 ring-opacity-10 ring-black relative overflow-hidden"
            :style="{ backgroundImage: `url(${item.screenshots?.[0]})` }"
          >
            <div class="overlay" />
            <div
              class="entry-content absolute top-0 bottom-0 w-full z-10 flex justify-end flex-col"
            >
              <div
                class="text bg-white bg-opacity-100 border-t border-black border-opacity-10 w-full p-4 flex justify-between items-center font-bold"
                @click.stop
              >
                <div class="flex space-x-3">
                  <div v-if="item.icon" class="w-6 mt-0.5">
                    <img
                      :src="item.icon"
                      :alt="`${item.name} Logo`"
                      class="logo rounded-md"
                    />
                  </div>
                  <div>
                    <h3 class="title font-bold">{{ item.name }}</h3>
                    <div v-if="item.authorName" class="text-xs text-color-400">
                      <div class="author">by {{ item.authorName }}</div>
                    </div>
                  </div>
                </div>
                <div class="action text-sm">
                  <router-link
                    btn="primary"
                    :to="`/showcase/${encodeURIComponent(
                      item.permalink || '',
                    )}`"
                    class="text-primary-500"
                  >
                    View &rarr;
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { map as plugins } from "./map"
import { useRouter } from "vue-router"
const router = useRouter()

const goToPermalink = async (permalink?: string): Promise<void> => {
  if (!permalink) return

  const path = `/showcase/${encodeURIComponent(permalink || "")}`

  await router.push({ path })
}
</script>
<style lang="less"></style>
