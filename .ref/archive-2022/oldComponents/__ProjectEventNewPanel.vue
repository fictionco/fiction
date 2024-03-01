<script lang="ts" setup>
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import { emitEvent, resetUi } from '@factor/api'
import { getRoute, requestSiteEndpoint } from '..'
import ElemSlideOver from '../_global/ElemSlideOver.vue'

const router = useRouter()
const sending = ref(false)

const isValid = ref<boolean>(false)
const formError = ref('')

/**
 * Form values
 */
const form = ref<{ eventName?: string }>({ eventName: '' })

function setEventName(v: string) {
  form.value.eventName = v.trim()
}

async function createEvent(): Promise<void> {
  const { eventName } = form.value
  if (!eventName) {
    formError.value = 'event name is required'
    return
  }

  const r = await requestSiteEndpoint('manageCustomEvent', {
    _action: 'create',
    eventName,
  })

  if (r.status === 'success' && r.data) {
    const createdEvent = r.data
    await router.push(
      getRoute('projectEventEdit', { eventId: createdEvent.eventId }),
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
  <ElemSlideOver name="editEvent">
    <div
      class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
    >
      <svg
        class="h-6 w-6 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
    </div>

    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Create New Goal or Event
      </h2>
      <p class="text-slate-500 mt-2">
        Create custom events or goals for site behavior you'd like to measure
        and track
      </p>
    </div>

    <ElemForm
      v-model:valid="isValid"
      :data="form"
      spellcheck="false"
      @submit="send()"
    >
      <ElemInput
        :model-value="form.eventName"
        input="text"
        label="Event Name"
        description="Recommend you use a noun + past tense verb"
        placeholder="User Registered"
        required
        @update:model-value="setEventName($event)"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <div class="">
        <ElemInput
          input="submit"
          :disabled="!isValid"
          :loading="sending"
        >
          Create &rarr;
        </ElemInput>
      </div>
    </ElemForm>
  </ElemSlideOver>
</template>
