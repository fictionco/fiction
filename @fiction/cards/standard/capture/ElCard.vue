<script lang="ts" setup>
import type { Card, Site } from '@fiction/site'
import type { QueryVarHook } from '@fiction/site/utils/site'
import type { UserConfig } from './config'
import { localRef, onResetUi, resetUi, vue } from '@fiction/core'
import { setupRouteWatcher } from '@fiction/site/utils/site'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElClose from '@fiction/ui/common/ElClose.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import CardText from '../CardText.vue'
import ConfirmModal from '../el/CardActionAreaConfirmModal.vue'
import EffectScrollModal from './EffectScrollModal.vue'
import EmailForm from './EmailForm.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})
const loading = vue.ref(true)

const subscribed = localRef({ key: `capture-subscribed`, def: '', lifecycle: 'local' })
const dismissedLoad = localRef({ key: `capture-dismissed-load`, def: false, lifecycle: 'session' })
const dismissedScroll = localRef({ key: `capture-dismissed-scroll`, def: false, lifecycle: 'session' })

// Single modal state to ensure only one can be shown
const modalState = vue.ref<'subscribeModal' | 'loadModal' | 'scrollModal' | 'confirm' | ''>('')

vue.onMounted(async () => {
  loading.value = false

  vue.watch(() => card.site, (v) => {
    if (v) {
      const queryVarHooks: QueryVarHook[] = [{
        key: '_subscribe',
        callback: async (args: { site: Site, value: string }) => {
          modalState.value = 'subscribeModal'
          return {}
        },
      }]
      setupRouteWatcher({ site: v, queryVarHooks })
    }
  }, { immediate: true })

  vue.watch(() => uc.value._editorPreview, (v) => {
    if (!card.site?.isEditable.value) {
      return
    }
    if (v === 'modal') {
      modalState.value = 'subscribeModal'
    }
    else if (v === 'load') {
      modalState.value = 'loadModal'
    }
  }, { immediate: true })

  // show on load
  vue.watch(() => uc.value.presentationMode, (v) => {
    if (subscribed.value || card.site?.isEditable.value) {
      return
    }

    if (v === 'onScroll' && !dismissedScroll.value) {
      modalState.value = 'scrollModal'
    }
    else if (v === 'onLoad' && !dismissedLoad.value) {
      modalState.value = 'loadModal'
    }
  }, { immediate: true })

  vue.watch(() => modalState.value, (newState, oldState) => {
    if (typeof document === 'undefined')
      return

    if (newState === 'loadModal') {
      document.body.style.overflow = 'hidden'
    }
    else if (oldState === 'loadModal') {
      document.body.style.overflow = ''
    }
  })
})

onResetUi(() => {
  const _editorPreview = card.userConfig.value._editorPreview
  if (_editorPreview) {
    card.userConfig.value = { ...card.userConfig.value, _editorPreview: undefined }
    card?.syncCard({ caller: 'cardCaptureV1Preview' })
  }
})

const attrs = vue.useAttrs()

function handleSubscribe(value: string) {
  subscribed.value = value
  modalState.value = 'confirm'
}

function resetForm() {
  subscribed.value = ''
  dismissedLoad.value = false
  dismissedScroll.value = false
}

type DismissMode = 'scroll' | 'load' | 'modal' | 'confirm'

const modalMap: Record<DismissMode, string> = {
  scroll: 'scrollModal',
  load: 'loadModal',
  modal: 'subscribeModal',
  confirm: 'confirm',
}

function handleDismiss(mode: DismissMode) {
  // Handle dismissal state if needed
  if (mode === 'scroll')
    dismissedScroll.value = true
  if (mode === 'load')
    dismissedLoad.value = true

  // Clear modal state if it matches the mapped value
  if (modalState.value === modalMap[mode]) {
    modalState.value = ''
    resetUi({ cause: 'cardCaptureV1', scope: 'all', trigger: 'manualReset' })
  }
}
</script>

<template>
  <div :data-value="JSON.stringify({ subscribed })" :data-wrap-mode="uc.presentationMode">
    <ConfirmModal
      :card="card"
      :vis="modalState === 'confirm'"
      :confirm-text="{
        title: uc.action?.subscribe?.success?.title || 'Congratulations!',
        content: uc.action?.subscribe?.success?.content || 'Check your email to confirm.',
      }"
      @update:vis="handleDismiss('confirm')"
    />
    <ElModal
      :vis="modalState === 'subscribeModal'"
      modal-class="max-w-xl p-8"
      :has-close="true"
      @close="handleDismiss('modal')"
      @update:vis="handleDismiss('modal')"
    >
      <EmailForm
        class="p-8 py-12"
        :animate="false"
        :card="card"
        v-bind="attrs"
        :show-dismiss="true"

        @update:subscribed="handleSubscribe"
      />
    </ElModal>

    <!-- Existing template content -->
    <template v-if="modalState === 'loadModal'">
      <teleport to=".x-site">
        <div :data-mode="uc.presentationMode" class="pointer-events-none z-[45] text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-[100dvh] w-[100dvw] items-center justify-center bg-theme-0 dark:bg-theme-900" @click.stop>
          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full flex-col items-center justify-center">
              <EmailForm
                class="pointer-events-auto p-8 py-12 md:p-16"
                :animate="false"
                :card="card"
                v-bind="attrs"
                :show-dismiss="true"
                @update:subscribed="handleSubscribe"
                @update:dismissed="handleDismiss('load')"
              />
              <XButton
                data-test-id="dismiss"
                size="xs"
                design="ghost"
                theme="default"
                class=" pointer-events-auto cursor-pointer"
                icon="i-tabler-x"
                @click.prevent="handleDismiss('load')"
              >
                Maybe Later
              </XButton>
            </div>
          </div>
        </div>
      </teleport>
    </template>

    <EffectScrollModal v-if="modalState === 'scrollModal'">
      <div :data-mode="uc.presentationMode">
        <div class="absolute right-3 top-3 pointer-events-auto z-10">
          <ElClose
            data-test-id="dismiss"
            color-mode="auto"
            @click.prevent="handleDismiss('scroll')"
          />
        </div>
        <EmailForm
          class="p-8 py-12 md:p-16"
          :card="card"
          v-bind="attrs"
          :show-dismiss="true"
          :subscribed="subscribed"
          @update:subscribed="handleSubscribe"
          @update:dismissed="handleDismiss('scroll')"
        />
      </div>
    </EffectScrollModal>

    <template v-if="uc.presentationMode === 'inline'">
      <div v-if="!subscribed" v-bind="attrs" :class="card.classes.value.contentWidth" :data-mode="uc.presentationMode">
        <EmailForm
          :animate="true"
          :card="card"
          :subscribed="subscribed"
          @update:subscribed="handleSubscribe"
        />
      </div>

      <div v-else class="p-6 text-center text-primary-800 dark:text-primary-0 bg-primary-50 dark:bg-primary-900/30 max-w-md mx-auto rounded-xl space-y-4">
        <div class="space-y-2">
          <CardText
            tag="h2"
            class="font-normal x-font-title text-xl"
            :card="card"
            path="action.subscribe.success.title"
            fallback="Success!"
          />
          <CardText
            tag="p"
            class=" dark:text-primary-300 text-primary-500"
            :card="card"
            path="action.subscribe.success.content"
            fallback="Please confirm via email."
          />
        </div>

        <XButton class="opacity-90 hover:opacity-100" size="xxs" theme="primary" design="outline" @click="resetForm()">
          Reset Form
        </XButton>
      </div>
    </template>
  </div>
</template>
