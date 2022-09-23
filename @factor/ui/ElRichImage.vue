<template>
  <div v-if="media?.url" :class="cls">
    <div class="absolute inset-0">
      <img
        class="z-0 h-full w-full"
        :class="fit == 'cover' ? 'object-cover' : 'object-scale-down'"
        :src="media?.url || ''"
        :style="{
          filter: filters?.map((_) => _.value).join(' '),

          objectPosition,
        }"
      />
    </div>
    <ElOverlay :overlay="media.overlay"></ElOverlay>
  </div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import ElOverlay from "./ElOverlay.vue"
import { ImageFilterConfig, MediaDisplayObject } from "./utils"

const props = defineProps({
  media: {
    type: Object as vue.PropType<MediaDisplayObject>,
    default: undefined,
  },
  fit: {
    type: String as vue.PropType<"cover" | "contain">,
    default: "cover",
  },
  objectPosition: {
    type: String as vue.PropType<"center" | "left" | "right">,
    default: "center",
  },
})

const attrs = vue.useAttrs()

const cls = vue.computed(() => {
  return attrs.class && (attrs.class as string).includes("absolute")
    ? ""
    : "relative"
})

const filters = vue.computed<ImageFilterConfig[]>(() => {
  return props.media?.filters || []
})
</script>
