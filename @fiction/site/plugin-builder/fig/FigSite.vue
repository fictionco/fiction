<script lang='ts' setup>
import type { vue } from '@fiction/core'
import type { Site } from '../../../site'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import FigSite from './img/figSite.svg'
import FigSiteMobile from './img/figSiteMobile.svg'

defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    default: undefined,
  },
})
</script>

<template>
  <div :style="{ perspective: '500px' }" class="relative h-full w-full flex justify-end">
    <div class="fig aspect-video w-[80%] relative inline-block  rounded-md scale-50 overflow-hidden">
      <ElBrowserFrameDevice
        v-if="site?.frame.currentSiteFrameUrl.value"
        frame-id="preview-desktop"
        device-mode="desktop"
        :url="site?.frame.currentSiteFrameUrl.value"
        class="  rounded-md"
      />
      <img v-else :src="FigSite" class="ds inline-block">
    </div>
    <div class="fig-mobile absolute right-[5%] bottom-[-2%] aspect-[9/16] w-[20%] ds rounded-md scale-50 hidden lg:block">
      <ElBrowserFrameDevice
        v-if="site?.frame.currentSiteFrameUrl.value"
        frame-id="preview-mobile"
        device-mode="mobile"
        :url="site.frame.currentSiteFrameUrl.value"
        class="absolute inset-0 w-full h-full rounded-md"
      />
      <img v-else :src="FigSiteMobile" class="ds inline-block">
    </div>
  </div>
</template>

<style lang="less" scoped>
.fig{
  transform: scale(.8);
}
.fig-mobile{
  transform:  scale(.8) rotate3d(0, -6, 1, 15deg);
}
.ds{
  filter: drop-shadow(1px 2px 4px rgba(20, 20, 20, 0.1));
}
</style>
