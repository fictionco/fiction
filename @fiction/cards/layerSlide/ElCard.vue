<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig >>, required: true },
})

const vis = vue.ref(false)

vue.onMounted(async () => {
  const x = props.card.request('instagram', { test: true })
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="flex items-center justify-between">
      <EffectFitText :lines="2" content="test" class="w-[40%]">
        I Create Unique Designs
      </EffectFitText>
    </div>
  </div>
</template>
