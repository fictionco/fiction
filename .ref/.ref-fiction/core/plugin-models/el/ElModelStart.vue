<script lang="ts" setup>
import { notify, objectId, resetUi, vue, waitFor } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import { useFictionApp } from '../../util'

const { factorRouter, fictionModel } = useFictionApp()

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
    const r = await fictionModel.requests.ManageModel.projectRequest({
      _action: 'upsert',
      modelConfig: {
        modelId: objectId({ prefix: 'mo' }),
        modelName: formName.value,
        status: 'pending',
      },
    })
    await waitFor(1000)
    if (r.status === 'error' && !r.data?.modelId) {
      creationError(r)
    }
    else {
      const path = factorRouter.link('modelTrain', {
        modelId: r.data?.modelId,
        topic: 'create',
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
      <div class="text-center text-lg font-bold">
        New Model
      </div>
      <div class="mt-4">
        <ElInput
          v-model="formName"
          class="my-6"
          label="Give it a name"
          sub-label="Used to reference this model in the future."
          input="InputText"
          placeholder="Model X"
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
