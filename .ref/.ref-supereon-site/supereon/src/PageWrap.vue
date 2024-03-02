<script lang="ts" setup>
import type { vue } from '@factor/api'
import SiteFooter from './SiteFooter.vue'
import SiteHeader from './SiteHeader.vue'
import ShootingStar from './ShootingStar.vue'

defineProps({
  hideHeader: { type: Boolean, default: false },
  mode: { type: String as vue.PropType<'bar' | 'splash'>, default: 'splash' },
})
</script>

<template>
  <div class="overflow-hidden">
    <div
      v-if="!hideHeader && mode === 'splash'"
      class="from-theme-950 to-theme-950 absolute top-0 h-[500px] w-full overflow-hidden bg-gradient-to-br py-40 text-white"
    >
      <ShootingStar class="absolute inset-0" />
    </div>
    <SiteHeader
      v-if="!hideHeader"
      class="text-theme-0"
      :class="mode === 'bar' ? 'bg-theme-950' : ''"
    />
    <slot />
    <SiteFooter />
  </div>
</template>
