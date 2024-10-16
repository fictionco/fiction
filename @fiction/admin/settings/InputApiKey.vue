<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { type Organization, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import InputPassword from '@fiction/ui/inputs/InputPassword.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'

const { modelValue } = defineProps<{ modelValue?: Organization, card: Card }>()

const _emit = defineEmits<{
  (event: 'update:modelValue', payload: Organization): void
}>()

const { fictionUser } = useService()

const showApiSecret = vue.ref(false)
const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

async function generateApiSecret(): Promise<void> {
  const orgId = fictionUser.activeOrganization.value?.orgId
  if (!orgId)
    return
  const r = await fictionUser.requests.ManageOrganization.projectRequest({ _action: 'generateApiSecret', where: { orgId } })

  if (r.status === 'success')
    showApiSecret.value = true

  fictionUser.activeOrganization.value = r.data
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
  else {
    sending.value = false
  }
}

vue.onMounted(async () => {
  await fictionUser.userInitialized()
})
</script>

<template>
  <div class="py-6 space-y-6">
    <template v-if="fictionUser.activeOrganization.value?.apiSecret">
      <InputText
        v-if="showApiSecret"
        ui-size="xl"
        :value="fictionUser.activeOrganization.value?.apiSecret"
        readonly
      />
      <InputPassword
        v-else
        ui-size="xl"
        :value="fictionUser.activeOrganization.value?.apiSecret"
        readonly
      />
      <div class="my-4 space-x-3">
        <XButton
          theme="primary"
          size="md"
          @click.prevent="showApiSecret = !showApiSecret"
        >
          <span v-if="!showApiSecret">Show Key</span>
          <span v-else>Hide Key</span>
        </XButton>
        <XButton
          theme="default"
          :loading="sending"
          size="md"
          @click="generateKey(true)"
        >
          Reset Key
        </XButton>
      </div>
    </template>
    <div v-else class="my-4">
      <XButton
        theme="primary"
        :loading="sending"
        @click="generateKey()"
      >
        Generate Key
      </XButton>
    </div>
  </div>
</template>
