<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './index.js'
import ElEngine from '../../CardEngine.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
</script>

<template>
  <div v-if="card.site">
    <ElEngine
      tag="header"
      :card="card.site.sections.value.header"
      :class="card.userConfig.value.fixedHeader ? 'fixed w-full top-0 z-10' : ''"
      :is-editable="card?.site?.isEditable.value"
    />
    <ElEngine
      tag="main"
      :card
      class="min-h-[40vh] grow will-change-contents"
      :is-editable="card?.site?.isEditable.value"
    />
    <ElEngine
      tag="footer"
      :card="card.site.sections.value.footer"
      :is-editable="card?.site?.isEditable.value"
    />
    <ElEngine
      tag="div"
      class="hidden"
      :card="card.site.sections.value.hidden"
    />
  </div>
</template>
