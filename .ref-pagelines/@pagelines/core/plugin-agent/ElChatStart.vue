<script lang="ts" setup>
import type {
  FactorRouter,
} from '@factor/api'
import {
  notify,
  objectId,
  resetUi,
  useService,
  vue,
  waitFor,
} from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import type { PageLinesAgent } from '.'

const { factorRouter, pageLinesAgent } = useService<{
  pageLinesAgent: PageLinesAgent
  factorRouter: FactorRouter
}>()

const formName = vue.ref(``)
const sending = vue.ref(false)

function creationError(data?: unknown) {
  notify.error(
    'There was a problem with this action. Developers have been notified.',
    { data },
  )
  resetUi()
}

async function create() {
  sending.value = true
  try {
    const r = await pageLinesAgent.requests.ManageAgent.projectRequest({
      _action: 'upsert',
      config: {
        agentId: objectId({ prefix: 'cb' }),
        agentName: formName.value,
        status: 'pending',
      },
    })
    await waitFor(1000)
    if (r.status === 'error' && !r.data?.agentId) {
      creationError(r)
    }
    else {
      const path = factorRouter.link('chat', {
        agentId: r.data?.agentId,
        topicId: 'data',
      }).value

      await factorRouter.router.push({ path })
    }
  }
  catch (error) {
    creationError(error)
  }
  await waitFor(1000)
  sending.value = false
}
</script>

<template>
  <ElModal modal-class="max-w-md">
    <div class="p-8">
      <div class="font-brand text-center text-xl font-bold">
        New Chat Agent
      </div>
      <div class="mt-4">
        <ElInput
          v-model="formName"
          class="my-6"
          label="Give it a name"
          sub-label="Used for reference in the future."
          input="InputText"
          placeholder="My Name"
        />
        <div class="mt-4">
          <ElButton
            format="block"
            btn="primary"
            :loading="sending"
            @click="create()"
          >
            Continue &rarr;
          </ElButton>
        </div>
      </div>
    </div>
  </ElModal>
</template>

<style lang="less"></style>
