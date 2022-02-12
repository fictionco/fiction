<template>
  <div class="extend-container px-4">
    <div class="mt-12 mb-24">
      <div class="text-center">
        <h1 class="text-center text-3xl tracking-tight font-bold sm:text-5xl">
          Factor Plugins
        </h1>
        <h3 class="text-color-500 text-lg lg:text-2xl mt-4">
          Simple ways to add new features to your app or site
        </h3>
      </div>
    </div>

    <div class="mx-auto max-w-screen-xl my-20 lg:my-36">
      <div class="theme-grid grid grid-cols-12 gap-4 gap-y-12 lg:gap-8">
        <div
          v-for="(item, index) in plugins"
          :key="index"
          class="grid-item-theme col-span-12 md:col-span-6 lg:col-span-4 cursor-pointer"
        >
          <div
            class="bg-white ring-1 ring-black ring-opacity-10 shadow-lg p-4 lg:p-6 relative mt-6 lg:mt-0"
          >
            <div class="icon w-16 shadow-md absolute -top-8">
              <img class="rounded-lg" :src="item.icon" />
            </div>
            <h3 class="mt-6 font-bold text-xl lg:text-2xl">{{ item.name }}</h3>
            <p class="text-color-500 text-lg mt-3">
              {{ item.description }}
            </p>
            <div class="actions mt-6 space-x-4 flex justify-between">
              <div class="space-x-4 flex">
                <ElButton
                  :href="item.url"
                  target="_blank"
                  size="sm"
                  btn="primary"
                  >Install &rarr;
                </ElButton>

                <ElButton
                  v-if="item.demo"
                  :href="item.demo"
                  target="_blank"
                  size="sm"
                  btn="default"
                  >Demo
                </ElButton>
              </div>

              <div>
                <ElButton
                  v-if="item.repo"
                  :href="item.repo"
                  target="_blank"
                  size="sm"
                  btn="default"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </ElButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ElButton from "@factor/ui/ElButton.vue"
import { map as plugins } from "./map"
</script>
<style lang="less"></style>
