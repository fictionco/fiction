<script lang="ts" setup>
import type { vue } from '@factor/api'
import EffectShape from '@factor/ui/EffectShape.vue'
import ElButton from '../../../@factor/ui/ElButton.vue'
import type { FictionApp } from './extend'

defineProps({
  app: { type: Object as vue.PropType<FictionApp>, required: true },
})
</script>

<template>
  <div class="bg-theme-0 overflow-hidden rounded-lg">
    <div class="grid min-w-0 grid-cols-12 gap-8 overflow-hidden">
      <div
        class="col-span-12 flex max-w-xl flex-col items-center justify-center p-8 pr-0 lg:col-span-6"
      >
        <div class="max-w-md">
          <div
            v-if="app.appName"
            class="text-theme-400 mb-2 flex space-x-2 text-xs font-bold uppercase tracking-widest"
          >
            <div>{{ app.appName }}</div>
          </div>
          <p class="text-xl font-extrabold tracking-tight md:text-4xl">
            {{ app.tagline }}
          </p>
          <div
            class="text-theme-500 my-2 flex max-w-md items-center space-x-2 text-base font-medium"
          >
            <span>
              {{ app.description }}
            </span>
          </div>
          <template v-if="$slots.sub">
            <slot name="sub" />
          </template>
          <div class="mt-5 space-x-3">
            <ElButton
              v-for="(item, i) in app.actions({ app })"
              :key="i"
              :href="item.href || item.link?.value"
              :btn="item.btn"
              @click.stop="item.onClick && item.onClick($event)"
            >
              {{ item.name }}
            </ElButton>
          </div>
          <div v-if="app.tags.length > 0" class="mt-4 space-x-2">
            <span
              v-for="tag in app.tags"
              :key="tag"
              className="inline-flex items-center rounded bg-theme-100 px-2 py-0.5 text-[10px] font-medium text-theme-500 tracking-tight"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      <div class="relative col-span-12 lg:col-span-6">
        <div
          class="relative z-10 aspect-[4/3] h-full w-full"
          :class="app.figure ? '' : 'p-8 pl-0 flex flex-col justify-center'"
        >
          <component
            :is="app.figure?.component"
            v-if="app.figure?.component"
            v-bind="app.figure.props"
            class="h-full w-full"
          />
          <img
            v-else
            class="block w-full"
            :src="app.thumb"
          >
        </div>

        <EffectShape />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.angled-shape {
  clip-path: polygon(0 0, 100% 0, 121% 100%, 0 100%, 12% 0, 0 0%);
}
</style>
