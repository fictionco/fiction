<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import SettingsTool from '@fiction/admin/settings/SettingsTool.vue'
import type { EmailSendConfig } from '../schema.js'
import type { FictionSend } from '../index.js'
import { getTools } from './tools.js'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})
const service = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)

const sendConfig = vue.ref<EmailSendConfig>({})

async function load() {
  loading.value = true

  const emailId = service.fictionRouter.query.value.emailId as string | undefined

  try {
    if (!emailId)
      return

    const endpoint = service.fictionSend.requests.ManageSend
    const orgId = service.fictionUser.activeOrgId.value
    if (!orgId)
      throw new Error('No orgId')

    const r = await endpoint.projectRequest({ _action: 'get', where: { emailId } })

    if (!r.data)
      throw new Error('No send campaign found')

    sendConfig.value = r.data?.[0]

    console.warn('Loaded send', sendConfig.value)
  }
  catch (error) {
    console.error('Error loading send', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => load())

const tools = getTools({ fictionSend: service.fictionSend })
</script>

<template>
  <SettingsTool base-path="/send-view" :tools :card :loading />
</template>
