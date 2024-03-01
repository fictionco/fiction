<script lang="ts" setup>
import type { EndpointResponse } from '@factor/api'
import { log, vue } from '@factor/api'
import ElButton from '@kaption/core/ui/ElButton.vue'
import type { KaptionConnection } from '../connection'
import type { IntegrationRow } from './tables'
import type { OAuthPayload } from '.'

const props = defineProps({
  connection: {
    type: Object as vue.PropType<KaptionConnection>,
    required: true,
  },
  modelValue: {
    type: Object as vue.PropType<Partial<OAuthPayload>>,
    default: undefined,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: Partial<OAuthPayload>): void
}>()

const hovered = vue.ref(false)

function handleResponse(response:
  | EndpointResponse<Error, 'error'>
  | EndpointResponse<IntegrationRow, 'success'>) {
  log.info('handleResponse', 'modal', { data: response })
  if (response.status === 'success' && response.data) {
    emit(
      'update:modelValue',
      response.data.oAuthPayload as Partial<OAuthPayload>,
    )
  }
}

async function disconnect() {
  const result = await props.connection.oAuthDisconnect()
  if (result.status === 'success')
    emit('update:modelValue', result.data?.oAuthPayload || {})
}
</script>

<template>
  <div class="">
    <div
      class="inline-block"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
    >
      <ElButton
        v-if="hovered && modelValue?.status === 'active'"
        btn="amber"
        @click="disconnect()"
      >
        Disconnect
      </ElButton>
      <ElButton
        v-else-if="modelValue?.status === 'active'"
        btn="green"
        @click="
          connection.oAuthConnect({ onFinished: (r) => handleResponse(r) })
        "
      >
        Connected
      </ElButton>
      <ElButton
        v-else
        btn="slate"
        @click="
          connection.oAuthConnect({ onFinished: (r) => handleResponse(r) })
        "
      >
        Authorize &rarr;
      </ElButton>
    </div>
  </div>
</template>
