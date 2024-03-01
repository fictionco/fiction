<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { vue } from '@factor/api'
import ElPanel from '@kaption/core/ui/ElPanel.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { useFictionApp } from '../../util'
import { Model } from '../model'
import EventWrap from './__PageWrap.vue'

const { factorRouter, factorUser, fictionModel } = useFictionApp()
const sending = vue.ref<string | boolean>(false)
const modelState = fictionModel.activeModelState
const activeModel = fictionModel.activeModel

const routeModelId = factorRouter.current.value.params.modelId as
  | string
  | undefined

vue.onMounted(async () => {
  await factorUser.userInitialized()

  if (!routeModelId)
    return

  const model = await fictionModel.load(routeModelId)

  if (model)
    activeModel.value = model
})

async function update(): Promise<void> {
  const model = activeModel.value?.toConfig()

  if (!model)
    return
  if (!routeModelId)
    return

  const r = await fictionModel.requests.ManageModel.projectRequest({
    _action: 'update',
    model,
  })
  if (r.data)
    activeModel.value = new Model(r.data)
}

async function maybeRemove(): Promise<void> {
  const confirmed = confirm('Are you sure?')

  if (confirmed) {
    sending.value = 'delete'

    const r = await fictionModel.requests.ManageModel.projectRequest({
      _action: 'delete',
      model: { modelId: routeModelId },
    })

    sending.value = false
    if (r.status === 'success')
      await factorRouter.goto('modelIndex')
  }
}

async function send(context: string): Promise<void> {
  sending.value = context
  await update()
  sending.value = false
}
</script>

<template>
  <EventWrap>
    <template #actions>
      <ElButton
        btn="slate"
        :loading="sending === 'secondary'"
        @click="send('secondary')"
      >
        Save Changes
      </ElButton>
    </template>
    <ElForm :loading="modelState.status === 'loading'" @submit="send('primary')">
      <ElPanel
        v-if="activeModel"
        :title="`Configure Model:  ${activeModel?.modelName.value}`"
      >
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            class="my-8"
            label="Event Reference Key"
            description="This is the value that is tracked and used in the API"
          >
            <div
              class="mt-2 inline-block rounded-md bg-slate-100 px-6 py-2 font-bold text-slate-800"
            >
              {{ activeModel?.modelName }}
            </div>
          </ElInput>

          <ElInput
            v-model="activeModel.templateConfig.value"
            class="my-8"
            input="InputSelectCustom"
            label="Event Type"
            description="How should this event be tracked and handled"
            :list="[
              {
                value: 'conversion',
                name: `Conversion`,
                desc: `A fully qualified conversion event (purchase, lead, call)`,
              },
              {
                value: 'goal',
                name: `Goal`,
                desc: `A step on the path to a full conversion (view pricing, add to cart)`,
              },
              {
                value: 'standard',
                name: `Standard`,
                desc: `Any behavior or action you want to track but not treat as a conversion`,
              },
            ]"
            required
          />
        </div>
      </ElPanel>

      <ElPanel title="Danger Zone">
        <div class="max-w-prose px-4 lg:px-6">
          <ElInput
            class="my-8"
            s
            label="Remove Event"
            description="Permanently delete this event. Analytics data will be retained."
          >
            <div class="rounded-md pt-4">
              <ElButton
                :loading="sending === 'delete'"
                btn="red"
                @click.prevent="maybeRemove()"
              >
                Remove Event
              </ElButton>
            </div>
          </ElInput>
        </div>
      </ElPanel>
    </ElForm>
  </EventWrap>
</template>
