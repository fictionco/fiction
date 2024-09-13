<script lang="ts" setup>
import type { Card, Site } from '@fiction/site'
import type { UserConfig } from '.'
import { vue, waitFor } from '@fiction/core'
import { type QueryVarHook, setupRouteWatcher } from '@fiction/site/utils/site'
import ElModal from '@fiction/ui/ElModal.vue'
import { MediaEmbedder } from './mediaEmbedder.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const vis = vue.ref(false)
const embedHtml = vue.ref('')

vue.onMounted(async () => {
  await waitFor(500)
  vue.watch(() => props.card.site, (v) => {
    if (v) {
      const queryVarHooks: QueryVarHook[] = [{
        key: '_pop',
        callback: async (args: { site: Site, value: string }) => {
          const { value } = args

          // value is a full url to media, like youtube, video, anything else
          // create the embed code and load it within the modal

          embedHtml.value = MediaEmbedder.getEmbedCode(value)

          vis.value = true
          return {}
        },
      }]
      setupRouteWatcher({ site: v, queryVarHooks })
    }
  }, { immediate: true })
})
</script>

<template>
  <ElModal v-model:vis="vis" modal-class="lg:max-w-[80dvw] h-[80dvh] flex justify-center items-center overflow-hidden">
    <div class="h-full w-full" v-html="embedHtml" />
  </ElModal>
</template>
