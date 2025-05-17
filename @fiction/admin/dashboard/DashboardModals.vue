<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'

const { card } = defineProps<{
  card: Card
}>()

type ModalValues = 'welcome' | 'share'

const activeModal = vue.computed({
  get: () => {
    return card.site?.siteRouter.query.value._modal as ModalValues | null
  },
  set(value: ModalValues | null) {
    if (card.site) {
      card.site.siteRouter.replace({
        query: { ...card.site.siteRouter.query.value, _modal: value },
      })
    }
  },
})
</script>

<template>
  <ElModal :vis="!!activeModal" @update:vis="activeModal = null">
    <div class="overflow-hidden rounded-b-md pt-3">
      <iframe
        width="100%"
        class="aspect-video"
        src="https://www.youtube.com/embed/9xwazD5SyVg?si=xwlkPBPXvhiMyL1w"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
    </div>
  </ElModal>
</template>
