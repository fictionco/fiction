<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Widget } from './widget'
import WidgetWrap from './WidgetWrap.vue'

const props = defineProps({
  widget: { type: Object as vue.PropType<Widget>, required: true },
})
</script>

<template>
  <WidgetWrap :widget>
    <div class="overflow-hidden rounded-b-md">
      <iframe
        width="100%"
        class="aspect-video"
        src="https://www.youtube.com/embed/9xwazD5SyVg?si=xwlkPBPXvhiMyL1w"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
  </WidgetWrap>
</template>
