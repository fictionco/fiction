<script lang="ts" setup>
import { onResetUi, resetUi, vue } from '@factor/api'
import { FrameUtility } from '../../ui/elBrowserFrameUtil'
import ThemeEntry from '../themes/ThemeEntry.vue'
import type { PostMessageForm } from '../form'
import { Form } from '../form'
import { useKaption } from '../../utils/inject'

const { factorMedia, factorRouter, kaptionForms } = useKaption()
const service = { factorMedia }

const form = vue.shallowRef(new Form({ userConfig: {}, service, isDev: true }))

const ignoreChange = vue.ref(false)

const util = new FrameUtility<PostMessageForm>({
  relation: 'child',
  onMessage: (e) => {
    if (e.messageType === 'setForm') {
      ignoreChange.value = true

      form.value = new Form({ ...e.data, service, isDev: true })
    }
    else if (e.messageType === 'resetUi') {
      resetUi({ scope: 'iframe', cause: 'iframeThemeEntry' })
    }
  },
})

onResetUi((args) => {
  const { scope } = args
  if (scope === 'iframe')
    return
  util.sendMessage({ message: { messageType: 'resetUi', data: {} } })
})

vue.watch(
  () => form.value.toConfig(),
  (v) => {
    if (!ignoreChange.value)
      util.sendMessage({ message: { messageType: 'setForm', data: v } })
    else
      ignoreChange.value = false
  },
)

vue.onMounted(async () => {
  const formId = factorRouter.params.value.formId as string | undefined

  if (formId) {
    const r = await kaptionForms.loadForm(formId)

    if (r)
      form.value = r
  }
})
</script>

<template>
  <ThemeEntry :form="form" />
</template>
