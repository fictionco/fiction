<script lang="ts" setup>
import HighlightCode from '@factor/plugin-highlight-code/HighlightCode.vue'
import { vue } from '@factor/api'
import ElButton from '../ui/ElButton.vue'
import ElPanel from '../ui/ElPanel.vue'
import { useKaption } from '../utils'
import AdminPage from '../plugin-admin/AdminPage.vue'
import PendingBanner from './PendingBanner.vue'

const { factorRouter, factorAdmin, kaptionTracking, factorNotify, kaptionTag }
  = useKaption()

const sending = vue.ref(false)
const isCopied = vue.ref('Copy Tag to Clipboard')
const trackingCode = vue.computed((): string => {
  const projectId = factorAdmin.activeProject.value?.projectId
  const parts = [
    '<!-- kaption.co -->',
    `<script src="${kaptionTag.url(projectId ?? '').value}" async><`
    + `/script>`,
  ]
  return parts.join('\n')
})

async function copyTrackingCode(): Promise<void> {
  await vue.nextTick()

  const trackingCodeToCopy: HTMLInputElement | null = document.querySelector(
    '#copy-tracking-code',
  )

  if (!trackingCodeToCopy)
    return

  trackingCodeToCopy.setAttribute('type', 'text')
  trackingCodeToCopy.select()

  document.execCommand('copy')

  trackingCodeToCopy.setAttribute('type', 'hidden')

  isCopied.value = 'Copied!'

  factorNotify.notifySuccess('copied to clipboard')

  setTimeout(() => {
    isCopied.value = 'Copy'
  }, 3000)
}

async function verifyInstall(): Promise<void> {
  sending.value = true

  await kaptionTracking.requests.ManageTracking.projectRequest({
    _action: 'refresh',
  })
  sending.value = false
}

const trackingStatus = vue.computed(
  () => factorAdmin.activeProject.value?.trackingStatus ?? 'unknown',
)
</script>

<template>
  <AdminPage>
    <ElPanel title="Tracking Code">
      <div class="px-4 pt-8 lg:px-8">
        <PendingBanner
          v-if="trackingStatus === 'pending'"
          class="mb-8"
        />
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">
            Event Tracking Code
          </h2>
          <div class="inline-flex items-center space-x-3 text-sm">
            <span class="text-theme-300">Tracking Status:</span>
            <span
              class="rounded-full px-4 py-1 font-bold capitalize tracking-tight"
              :class="
                trackingStatus !== 'active'
                  ? 'text-amber-600 bg-amber-100'
                  : 'text-green-500 bg-green-50'
              "
            >
              {{ trackingStatus }}
            </span>
          </div>
        </div>
        <p class="text-theme-500 mb-2">
          Add this code to your tag manager or website &lt;head&gt;.
        </p>

        <div class="code-area">
          <div class="my-6">
            <HighlightCode>
              <pre
                class="whitespace-pre rounded-md font-mono text-sm ring-1 ring-black/20"
              ><code class="language-html !bg-theme-50 rounded-md !p-8 !shadow-inner  focus:outline-primary-500" contenteditable="true">{{ trackingCode }}</code></pre>
            </HighlightCode>

            <div class="col-span-4 space-x-4" />

            <input
              id="copy-tracking-code"
              ref="copyInput"
              type="hidden"
              :value="trackingCode"
            >
          </div>
          <div
            class="mt-4 mb-8 flex flex-col justify-between space-y-4 md:flex-row"
          >
            <div
              class="flex items-center justify-between space-x-4 md:justify-start"
            >
              <ElButton btn="slate" @click="copyTrackingCode()">
                {{ isCopied }}
              </ElButton>

              <ElButton
                btn="default"
                :loading="sending"
                @click="verifyInstall()"
              >
                Verify Install
              </ElButton>
            </div>
            <div
              class="flex items-center justify-between space-x-4 md:justify-start"
            >
              <div class="text-theme-500 text-sm">
                Need help?
              </div>
              <div class="">
                <ElButton :to="factorRouter.to('team')">
                  Invite Developer &rarr;
                </ElButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElPanel>
  </AdminPage>
</template>
