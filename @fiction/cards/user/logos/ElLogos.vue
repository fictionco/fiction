<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { LogoConfig, UserConfig } from './config'
import { vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

function getInlineLogoCols() {
  const items = uc.value.items || []
  const noItems = items.length
  if (noItems === 1)
    return 'md:grid-cols-1'
  else if (noItems === 2)
    return 'md:grid-cols-2'
  if (noItems === 3)
    return 'md:grid-cols-3'
  if (noItems === 4)
    return 'md:grid-cols-4'
  else
    return 'grid-cols-5'
}

function getLogoStyle(item: LogoConfig) {
  if (!item.theme) {
    return {
      logo: '',
    }
  }

  const style = getColorThemeStyles(item.theme || 'primary')

  return {
    logo: style?.text,
    background: style?.bg,
  }
}
</script>

<template>
  <div>
    <div class="content-standard p-4 text-center md:p-0 ">
      <div
        class="items-center"
        :class="uc.layout === 'stacked' ? 'block' : 'md:inline-flex flex-col md:flex-row md:space-x-14 items-center'"
      >
        <div
          class="x-font-title text-theme-400 dark:text-theme-600 text-balance mb-8 md:mb-0"
          :class="
            uc.layout === 'stacked'
              ? 'text-xl md:mb-16'
              : 'text-sm text-center md:max-w-40 md:text-right'
          "
        >
          {{ uc.label }}
        </div>
        <div
          class="items-center gap-y-8 md:gap-y-10 text-center gap-x-6 md:gap-x-10"
          :class=" uc.layout === 'stacked'
            ? `flex justify-center flex-wrap`
            : `md:space-y-0 flex justify-center flex-wrap md:grid grid-cols-1 ${getInlineLogoCols()}`
          "
        >
          <a
            v-for="(logo, i) in uc.items"
            :key="i"
            :href="logo.href"
            class="group/logo logo-link inline-flex items-center justify-center h-[80px] w-full max-w-[200px] relative rounded-xl"
            :class="[
              uc.layout === 'stacked' ? `w-[17%]` : '',
              logo.href ? 'cursor-pointer' : '',
              getLogoStyle(logo).background,
            ]"

            target="_blank"
          >
            <XMedia
              :media="logo.media"
              class="aspect-[2/1] min-h-0 h-full"
              :class="[
                getLogoStyle(logo).logo,
                logo.href ? 'cursor-pointer group-hover/logo:scale-110 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.33,1)]' : '',
              ]"
            />
            <div
              class="z-[-1] font-sans absolute opacity-0 group-hover/logo:opacity-100 top-[100%] group-hover/logo:top-[110%] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.33,1)] text-xs text-theme-400 dark:text-theme-500"
            >
              {{ logo.label }}
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.logo-link > * {
  max-width: 92%;
}
</style>
