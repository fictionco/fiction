<script lang="ts" setup>
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import { computed, ref } from 'vue'
import type { VariantNew } from '@kaption/types'
import ElemSlideOver from '@kaption/shared/ElemSlideOver.vue'
import { useRoute, useRouter } from 'vue-router'
import { emitEvent } from '@factor/api'
import { getRoute } from '../tools/routes'
import ElemButton from '../el/ElemButton.vue'
import { requestManageVariant } from './request'

const route = useRoute()
const router = useRouter()
const sending = ref(false)
const isValid = ref<boolean>(false)

const experimentId = computed<string>(() => route.params.experimentId as string)

const form = ref<VariantNew>({
  experimentId: experimentId.value,
  variantName: '',
})

async function submit() {
  sending.value = true
  const { variantName } = form.value

  if (!variantName)
    return

  const { data: createdVariant } = await requestManageVariant({
    experimentId: experimentId.value,
    variantName,
    _action: 'create',
  })
  sending.value = false

  emitEvent('resetUi')

  if (!createdVariant)
    return

  await router.push({
    path: getRoute('experimentVariant', createdVariant),
  })
}
</script>

<template>
  <ElemSlideOver name="newVariant">
    <div
      class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
    >
      <svg
        class="h-6 w-6 text-green-500"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1.64865"
          y="4"
          width="5.74324"
          height="10"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.6081 4C10.6081 3.58579 10.9167 3.25 11.2973 3.25H15.8919C16.78 3.25 17.5 4.0335 17.5 5V13C17.5 13.9664 16.7802 14.75 15.892 14.75H11.2973C10.9167 14.75 10.6081 14.4142 10.6081 14C10.6081 13.5858 10.9167 13.25 11.2973 13.25H15.892C16.0188 13.25 16.1216 13.1382 16.1216 13V5C16.1216 4.86193 16.0188 4.75 15.8919 4.75H11.2973C10.9167 4.75 10.6081 4.41421 10.6081 4Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.5 5C0.5 4.0335 1.21997 3.25 2.10811 3.25H6.7027C7.08333 3.25 7.39189 3.58579 7.39189 4C7.39189 4.41421 7.08333 4.75 6.7027 4.75H2.10811C1.98123 4.75 1.87838 4.86193 1.87838 5V13C1.87838 13.1382 1.98123 13.25 2.10799 13.25H6.7027C7.08333 13.25 7.39189 13.5858 7.39189 14C7.39189 14.4142 7.08333 14.75 6.7027 14.75H2.10799C1.21975 14.75 0.5 13.9664 0.5 13V5Z"
          fill="currentColor"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.3108 2V0L9.68918 0V2H8.3108ZM8.3108 8V4H9.68918V8H8.3108ZM8.3108 14V10H9.68918V14H8.3108ZM8.3108 18L8.3108 16H9.68918V18H8.3108Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Create New Variant
      </h2>
      <p class="text-slate-500">
        Display alternate versions of your site and track their results.
      </p>
    </div>

    <ElemForm
      v-model:valid="isValid"
      :data="form"
      @submit="submit()"
    >
      <ElemInput
        v-model="form.variantName"
        input="text"
        label="Variant Name"
        description="Used to track and display analytics results."
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElemButton
        input="submit"
        btn="primary"
        size="md"
        :loading="sending"
      >
        Create &rarr;
      </ElemButton>
    </ElemForm>
  </ElemSlideOver>
</template>
