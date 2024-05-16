<script lang="ts" setup>
import { localRef, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import EmailForm from './EmailForm.vue'
import EffectScrollModal from './EffectScrollModal.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})
const loading = vue.ref(true)
const isSubscribed = vue.ref(false)
const hide = localRef({ key: `hide-capture-${props.card.cardId}`, def: false, lifecycle: props.card.site?.isEditable ? 'disable' : 'local' })

vue.onMounted(async () => {
  await service.fictionUser.userInitialized()
  loading.value = false
})

vue.watchEffect(() => {
  const mode = uc.value.presentationMode

  if (mode === 'onLoad' || mode === 'onScroll')
    props.card.isNotInline.value = true
})
const attrs = vue.useAttrs()

const showCard = vue.computed(() => {
  return !loading.value && !isSubscribed.value && !hide.value
})

vue.watchEffect(() => {
  if (uc.value.presentationMode === 'onLoad') {
    const h = showCard.value
    if (h)
      document.body.style.overflow = 'hidden'
    else
      document.body.style.overflow = 'auto'
  }
})

function setHide(vis: boolean) {
  hide.value = !vis
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <template v-if="uc.presentationMode !== 'inline'">
    <teleport v-if="uc.presentationMode === 'onLoad' && showCard" to=".x-site">
      <div class="z-[10000] text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-theme-0 dark:bg-theme-900">
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full flex-col items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative w-full overflow-hidden rounded-lg px-4 md:px-8 py-10 text-left transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-12">
              <EmailForm :animate="true" :card="card" v-bind="attrs" :show-dismiss="true" @update:vis="setHide($event)" />
            </div>
          </div>
        </div>
      </div>
    </teleport>
    <EffectScrollModal v-if="uc.presentationMode === 'onScroll' && showCard">
      <div class="px-4 md:px-8 py-10">
        <EmailForm :card="card" v-bind="attrs" :show-dismiss="true" @update:vis="setHide($event)" />
      </div>
    </EffectScrollModal>
  </template>
  <div v-else v-bind="attrs" :class="card.classes.value.contentWidth">
    <EmailForm :animate="true" :card="card" />
  </div>
</template>
