<script lang="ts" setup>
import { useService, vue } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import InputText from '@factor/ui/InputText.vue'
import InputPassword from '@factor/ui/InputPassword.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElPanelSettings from './ElPanelSettings.vue'

const { factorUser } = useService()
const showApiSecret = vue.ref(false)

const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)
const activeOrganization = factorUser.activeOrganization

async function generateApiSecret(): Promise<void> {
  const orgId = factorUser.activeOrganization.value?.orgId
  if (!orgId)
    return
  const r = await factorUser.requests.GenerateApiSecret.request({
    orgId,
  })

  if (r.status === 'success')
    showApiSecret.value = true
}

async function generateKey(confirmNew?: boolean): Promise<void> {
  sending.value = true

  const confirmed = confirmNew
    ? confirm('Are you sure? This will immediately invalidate the current key.')
    : true

  if (confirmed) {
    await generateApiSecret()
    sent.value = true
    sending.value = false
  }
}
</script>

<template>
  <ElPanelSettings>
    <div class="max-w-xl px-4 lg:px-8">
      <div class="my-8">
        <h3 class="font-bold">
          Developer API
        </h3>
        <div class="text-theme-500 my-4">
          This is needed for the developer API. Learn more in the
          <a
            class="underline"
            href="#"
            target="_blank"
          >developer documentation</a>
          .
        </div>
      </div>
      <ElInput
        class="my-8"
        :value="activeOrganization?.orgId"
        input="InputText"
        label="Public API key"
        description="Needed for tracking and client-side use cases."
        readonly
      />
      <ElInput
        class="my-8"
        label="Private API Key"
        description="Needed to access the API in protected use cases."
      >
        <template v-if="factorUser.activeOrganization.value?.apiSecret">
          <InputText
            v-if="showApiSecret"
            :value="factorUser.activeOrganization.value?.apiSecret"
            readonly
          />
          <InputPassword
            v-else
            :value="factorUser.activeOrganization.value?.apiSecret"
            readonly
          />
          <div class="my-4 space-x-3">
            <ElButton
              btn="primary"
              size="sm"
              @click.prevent="showApiSecret = !showApiSecret"
            >
              <span v-if="!showApiSecret">Show Key</span>
              <span v-else>Hide Key</span>
            </ElButton>
            <ElButton
              btn="default"
              :loading="sending"
              size="sm"
              @click="generateKey(true)"
            >
              Reset Key
            </ElButton>
          </div>
        </template>
        <div v-else class="my-4">
          <ElButton
            btn="primary"
            :loading="sending"
            @click="generateKey()"
          >
            Generate Key
          </ElButton>
        </div>
      </ElInput>
    </div>
  </ElPanelSettings>
</template>
