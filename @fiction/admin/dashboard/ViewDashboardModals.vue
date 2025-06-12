<script lang="ts" setup>
import type { Card, Site } from '@fiction/site'
import { vue } from '@fiction/core'
import UrlShare from '@fiction/ui/blocks/UrlShare.vue'
import ElModal from '@fiction/ui/ElModal.vue'

const { card, primarySite } = defineProps<{
  card: Card
  primarySite?: Site
}>()

const ModalValues = ['share'] as const

type ModalType = (typeof ModalValues)[number]

const activeModal = vue.computed({
  get: () => {
    const viewValue = card.site?.siteRouter.query.value._view as ModalType ?? null

    return ModalValues.includes(viewValue) ? viewValue : null
  },
  set: (value: ModalType) => {
    if (card.site) {
      const query = { ...card.site.siteRouter.query.value, _view: value ?? undefined }
      card.site.siteRouter.replace({ query })
    }
  },
})
</script>

<template>
  <ElModal
    :vis="!!activeModal"
    :has-close="true"
    modal-class="w-full max-w-2xl"
    :title="activeModal === 'share' ? 'Your Website URL' : ''"
    @update:vis="activeModal = null"
  >
    <!-- <template v-if="activeModal === 'welcome'">
      <div class="overflow-hidden rounded-md">
        <iframe
          class="aspect-video w-full"
          src="https://www.youtube.com/embed/XIMLoLxmTDw?si=J-Uuv-tFHH3c0M9l"
          title="Getting Started Tutorial"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        />
      </div>
    </template> -->

    <div v-if="activeModal === 'share'" class="p-8">
      <UrlShare :url="primarySite?.url.value || ''" />
    </div>
  </ElModal>
</template>
