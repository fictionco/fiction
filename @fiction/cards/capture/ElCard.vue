<script lang="ts" setup>
import { localRef, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import EmailForm from './EmailForm.vue'
import EffectScrollModal from './EffectScrollModal.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService()

const uc = vue.computed(() => props.card.userConfig.value || {})
const loading = vue.ref(true)

const subscribed = localRef({ key: `capture-subscribed`, def: '', lifecycle: 'local' })
const dismissedLoad = localRef({ key: `capture-dismissed-load`, def: false, lifecycle: 'session' })
const dismissedScroll = localRef({ key: `capture-dismissed-scroll`, def: false, lifecycle: 'session' })

vue.onMounted(async () => {
  await Promise.all([
    service.fictionUser.userInitialized(),

  ])
  loading.value = false
})

const attrs = vue.useAttrs()

const showCard = vue.computed(() => {
  return !loading.value && !subscribed.value
})

vue.watchEffect(() => {
  const mode = uc.value.presentationMode

  if (mode === 'onLoad' || mode === 'onScroll')
    props.card.isNotInline.value = true
})

vue.watchEffect(() => {
  if (typeof document === 'undefined')
    return

  if (uc.value.presentationMode === 'onLoad') {
    const h = showCard.value && !dismissedLoad.value
    if (h)
      document.body.style.overflow = 'hidden'
    else
      document.body.style.overflow = 'auto'
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div :data-value="JSON.stringify({ subscribed })" :data-wrap-mode="uc.presentationMode">
    <template v-if="uc.presentationMode !== 'inline'">
      <teleport v-if="uc.presentationMode === 'onLoad'" to=".x-site">
        <div v-if="showCard && !dismissedLoad" :data-mode="uc.presentationMode" class=" pointer-events-none z-[45] text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-[100dvh] w-[100dvw] items-center justify-center bg-theme-0 dark:bg-theme-900">
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full flex-col items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative w-full overflow-hidden rounded-lg px-4 md:px-8 py-10 text-left transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-12">
                <EmailForm
                  class="pointer-events-auto"
                  :animate="false"
                  :card="card"
                  v-bind="attrs"
                  :show-dismiss="true"
                  @update:subscribed="subscribed = $event"
                  @update:dismissed="dismissedLoad = $event"
                />
              </div>
            </div>
          </div>
        </div>
      </teleport>
      <EffectScrollModal v-if="uc.presentationMode === 'onScroll' && showCard && !dismissedScroll">
        <div class="px-4 md:px-8 py-10" :data-mode="uc.presentationMode">
          <EmailForm
            :card="card"
            v-bind="attrs"
            :show-dismiss="true"
            :subscribed
            @update:subscribed="subscribed = $event"
            @update:dismissed="dismissedScroll = $event"
          />
        </div>
      </EffectScrollModal>
    </template>
    <div v-else-if="!subscribed" v-bind="attrs" :class="card.classes.value.contentWidth" :data-mode="uc.presentationMode">
      <EmailForm :animate="true" :card="card" :subscribed @update:subscribed="subscribed = $event" />
    </div>
    <div v-else class="p-4 text-center bg-theme-50 dark:bg-theme-700/60 dark:text-theme-500 max-w-sm mx-auto rounded-full">
      <CardText tag="h2" class="font-normal x-font-title text-balance" :card path="thanksText" fallback="Thanks for subscribing! Please confirm via email." />
    </div>
  </div>
</template>
