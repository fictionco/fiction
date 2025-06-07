<script lang="ts" setup>
import type { PostObject } from '@fiction/core'
import type { FictionContact } from '@fiction/plugins/plugin-contact'
import type { Card, Site } from '@fiction/site'

import type { QueryVarHook } from '@fiction/site/utils/site'
import type { UserConfig } from './config'
import { localRef, useService, vue } from '@fiction/core'
import { setupRouteWatcher } from '@fiction/site/utils/site'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElEmail from '@fiction/ui/inputs/InputEmail.vue'
import ConfirmModal from '../../el/CardActionAreaConfirmModal.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})
const service = useService<{ fictionContact: FictionContact }>()
const loading = vue.ref(true)
const email = vue.ref('')

const dismissedLoad = localRef({ key: `capture-dismissed-load`, def: false, lifecycle: 'session' })

const modalState = vue.ref<'subscribeModal' | 'loadModal' | 'confirm' | ''>('')
const site = vue.computed(() => card.site)
const orgId = vue.computed(() => card.site?.settings.orgId)

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
})

type DismissMode = 'load' | 'modal' | 'confirm'

function handleDismiss(mode: DismissMode) {
  if (mode === 'load')
    dismissedLoad.value = true

  modalState.value = ''
}

async function requestSubscription() {
  loading.value = true

  try {
    if (!email.value)
      throw new Error('Email is required')

    if (!orgId.value)
      throw new Error('Organization is required')

    const r = await service.fictionContact.requestSubscription({
      email: email.value,
      targetOrgId: orgId.value,
    })

    if (r?.status === 'error')
      throw new Error(r.message || 'An error occurred')

    if (r?.status === 'success') {
      modalState.value = 'confirm'
    }
  }
  catch (e) {
    service.fictionEnv.events.emit('notify', { type: 'error', message: (e as Error).message })
  }
  finally {
    loading.value = false
  }
}

const details = vue.computed<PostObject>(() => {
  const org = site.value?.org.value
  const config = uc.value
  const name = org?.name
  return {
    title: config?.title || name,
    subTitle: config?.subTitle || org?.profile?.summary || `Stay updated with the latest from ${name || 'this publication'}.`,
    media: org?.avatar,
    theme: 'primary',
  }
})
</script>

<template>
  <div>
    <ConfirmModal
      :card="card"
      :vis="modalState === 'confirm'"
      :confirm-text="{
        title: 'Success!',
        content: 'Check your email to confirm.',
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
      <div class="relative p-8 py-12">
        <div class="space-y-6 max-w-lg mx-auto">
          <div class="flex flex-col items-center mx-auto max-w-md text-center">
            <div v-if="details.media" class="mb-3 text-center">
              <ElAvatar :org="site?.org.value" class="size-14" :media="details.media" />
            </div>
            <XText v-model="details.title" class="x-font-title text-xl md:text-2xl font-semibold x-font-title" />
            <XText v-model="details.subTitle" class="text-sm md:text-base text-theme-500 dark:text-theme-300 md:text-pretty" />
          </div>
          <ElForm
            class="flex flex-col gap-5 sm:flex-row sm:flex-wrap"
            @submit="requestSubscription()"
          >
            <ElEmail
              v-model="email"
              data-test-id="email"
              ui-size="lg"
              :input-class="[
                'w-full',
                'sm:basis-80',
                'min-w-72',
                'max-w-xl',
                'grow',
                'sm:flex-1',
              ].join(' ')"
              placeholder="Type your email..."
            />
            <XButton
              data-test-id="submit"
              type="submit"
              rounding="md"
              theme="primary"
              :loading="loading"
              size="lg"
              hover="pop"
              class="shrink-0 w-full sm:w-auto"
            >
              Subscribe
            </XButton>
          </ElForm>
        </div>
      </div>
    </ElModal>
  </div>
</template>
