<script lang="ts" setup>
import ElAvatar from '@factor/ui/ElAvatar.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { vue } from '@factor/api'

defineProps({
  settings: {
    type: Object as vue.PropType<{
      heroBg: string
    }>,
    required: true,
  },
})
</script>

<template>
  <div
    class="image-area relative h-[80vh] min-h-[500px] w-full lg:min-h-[600px]"
  >
    <img
      :src="settings.heroBg"
      class="transition-hover absolute inset-0 h-full w-full object-cover group-hover:scale-110"
    >
    <div class="low-grad pointer-events-none absolute inset-0" />
    <div class="top-grad pointer-events-none absolute inset-0" />
    <div
      class="absolute bottom-[5%] left-[2%] z-30 max-w-[900px] p-4 leading-normal text-white md:p-12"
    >
      <div class="mb-6 flex items-center space-x-4">
        <ElAvatar
          email="arpowers@gmail.com"
          class="inline-block h-14 w-14 rounded-full bg-transparent ring-2 ring-white"
        />
      </div>
      <div class="x-font-title mb-4 text-4xl font-bold uppercase lg:text-6xl">
        Andrew Powers
      </div>
      <div class="max-w-screen-sm text-lg md:text-4xl">
        Software engineer, designer, and entrepreneur.
      </div>
      <div class="mt-12 space-x-4">
        <ElButton
          btn="naked"
          class="x-font-title cursor-pointer border-white hover:bg-white/20"
          size="xl"
          href="/about"
        >
          About
        </ElButton>
        <ElButton
          btn="naked"
          class="x-font-title cursor-pointer border-white hover:bg-white/20"
          size="xl"
          href="https://www.linkedin.com/in/arpowers"
        >
          LinkedIn &rarr;
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.low-grad {
  background: radial-gradient(
    ellipse at 0% 100%,
    rgba(0, 0, 0, 0.85) 0,
    transparent 70%
  );
}
.top-grad {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.85) 0%,
    transparent 50%
  );
  height: 160px;
}
</style>
