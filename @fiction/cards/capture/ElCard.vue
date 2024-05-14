<script lang="ts" setup>
import type { vue } from '@fiction/core'
import { getColorScheme, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useElementVisible } from '@fiction/ui/anim'
import ElEngine from '../CardEngine.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
</script>

<template>
  <div>
    123
  </div>
</template>
