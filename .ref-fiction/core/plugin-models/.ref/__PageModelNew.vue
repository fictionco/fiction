<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { emitEvent, resetUi, vue } from '@factor/api'
import ElPanel from '@kaption/core/ui/ElPanel.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import { useKaption } from '@kaption/core/utils'
import EventWrap from './PageWrap.vue'

const { factorRouter, kaptionEvents } = useKaption()

const sending = vue.ref(false)

const isValid = vue.ref<boolean>(false)
const formError = vue.ref('')

/**
 * Form values
 */
const form = vue.ref<{ event?: string }>({ event: '' })

function setEvent(v: string): void {
  form.value.event = v.trim()
}

async function createEvent(): Promise<void> {
  const { event } = form.value
  if (!event) {
    formError.value = 'event name is required'
    return
  }

  const r = await kaptionEvents.requests.ManageCustomEvent.projectRequest({
    _action: 'create',
    customEvent: {
      event,
    },
  })

  if (r.status === 'success' && r.data) {
    const createdEvent = r.data[0]
    await factorRouter.push(
      factorRouter.link('eventEdit', { eventId: createdEvent.eventId }).value,
    )
    resetUi()
  }
}

async function send(): Promise<void> {
  sending.value = true
  await createEvent()
  sending.value = false
}
</script>

<template>
  <EventWrap>
    <ElPanel title="Create New Event">
      <div class="max-w-prose px-4 lg:px-8">
        <ElForm
          v-model:valid="isValid"
          :data="form"
          spellcheck="false"
          @submit="send()"
        >
          <ElInput
            class="mt-8 mb-4"
            :model-value="form.event"
            input="InputText"
            label="Event Name"
            description="Example: userClicked, customerPurchased"
            placeholder="exampleClicked"
            required
            @update:model-value="setEvent($event)"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <div class="mt-4 mb-8">
            <ElButton
              input="submit"
              :loading="sending"
              btn="slate"
            >
              Continue &rarr;
            </ElButton>
          </div>
        </ElForm>
      </div>
    </ElPanel>
  </EventWrap>
</template>
