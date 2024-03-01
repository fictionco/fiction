<template>
  <div
    class="pointer-events-none absolute inset-0 z-10"
    :style="overlayStyle"
  ></div>
</template>
<script lang="ts" setup>
import { vue } from "@factor/api"
import { getGradientCss, OverlaySetting } from "./utils"

const props = defineProps({
  overlay: {
    type: Object as vue.PropType<OverlaySetting>,
    default: undefined,
  },
})

const overlayStyle = vue.computed(() => {
  const out: vue.StyleValue = {}
  const ov = props?.overlay

  if (ov?.gradient?.stops?.length) {
    out.opacity = (ov.opacity ?? 50) / 100

    if (ov.gradient) {
      out["background-image"] = getGradientCss(ov.gradient)
    }

    if (ov.blendMode) {
      out.mixBlendMode = ov.blendMode as vue.CSSProperties["mixBlendMode"]
    }
  }

  return out
})
</script>
