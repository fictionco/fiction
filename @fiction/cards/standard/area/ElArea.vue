<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import ElEngine from '../../CardEngine.vue'
import CardWrap from '../../CardWrap.vue'

defineProps<{
  card: Card<UserConfig>
}>()

const loaded = vue.ref(false)
vue.onMounted(() => {
  loaded.value = true
})
</script>

<template>
  <CardWrap :card>
    <div
      class="engine-container relative"
      :class="[loaded ? 'loaded' : '']"
      data-test-id="area-container"
      :aria-label="card.title?.value || 'Content Area'"
      role="region"
    >
      <ElEngine
        tag="div"
        :card="card"
        data-test-id="area-engine"
      />
    </div>
  </CardWrap>
</template>
