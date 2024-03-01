<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import type { ListItem, vue } from '@factor/api'

export interface SectionProps {
  title?: string
  subTitle?: string
  items: ListItem[]
}

defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})
</script>

<template>
  <div class=" ">
    <div class="content-standard mx-auto px-6 lg:px-8">
      <div class="mb-16 flex items-end gap-36">
        <div
          class="ui-font-title w-[20em] text-4xl font-bold tracking-tighter sm:text-7xl"
          v-html="settings.title"
        />
        <div
          class="text-lg lg:text-3xl lg:leading-snug"
          v-html="settings.subTitle"
        />
      </div>
      <div class="grid grid-cols-3 gap-20">
        <div v-for="(item, i) in settings.items" :key="i">
          <div class="text-3xl font-bold">
            {{ item.name }}
          </div>
          <div class="mt-4 text-lg">
            {{ item.desc }}
          </div>
        </div>
      </div>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <ElButton
          btn="primary"
          href="/about"
          size="xl"
        >
          Learn More
        </ElButton>
      </div>
    </div>
  </div>
</template>
