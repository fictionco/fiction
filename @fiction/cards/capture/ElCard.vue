<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EmailForm from './EmailForm.vue'
import PresentLoad from './PresentLoad.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})
const loading = vue.ref(true)
const isSubscribed = vue.ref(false)

vue.onMounted(async () => {
  await service.fictionUser.userInitialized()
  loading.value = false
})

vue.watchEffect(() => {
  const mode = uc.value.presentationMode

  if (mode === 'onLoad' || mode === 'onScroll')
    props.card.isNotInline.value = true
})
</script>

<template>
  <PresentLoad v-if="uc.presentationMode === 'onLoad'" :card="card" :loading="loading">
    <EmailForm :card="card" />
  </PresentLoad>
  <div v-else>
    <EmailForm :card="card" />
  </div>
</template>
