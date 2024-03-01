<script lang="ts">
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import ElemSlideOver from '@kaption/shared/ElemSlideOver.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Experiment } from '@kaption/types'
import ElemButton from '../el/ElemButton.vue'
import { getRoute } from '../tools/routes'
import { requestManageExperiment } from './request'

export default {
  components: {
    ElemButton,
    ElemInput,
    ElemSlideOver,
    ElemForm,
  },

  setup() {
    const router = useRouter()
    const newExperiment = ref<Partial<Experiment>>({ experimentName: '' })
    const sending = ref(false)
    const isValid = ref<boolean>(false)

    const createExperiment = async () => {
      sending.value = true
      const { experimentName } = newExperiment.value
      const { data: created } = await requestManageExperiment({
        experimentName,
        _action: 'create',
      })
      sending.value = false

      if (!created || !created.experimentId)
        return

      const { experimentId } = created

      router.push({
        path: getRoute('experimentSingle', { experimentId }),
      })
    }

    return {
      isValid,
      sending,
      getRoute,
      newExperiment,
      createExperiment,
    }
  },
}
</script>

<template>
  <ElemSlideOver name="newExperiment">
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
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    </div>
    <div class="py-3">
      <h2 class="text-xl font-semibold">
        New Experiment
      </h2>
      <p class="text-slate-500">
        Get started by adding basic details.
      </p>
    </div>
    <ElemForm @submit="createExperiment()">
      <ElemInput
        v-model="newExperiment.experimentName"
        input="text"
        label="Experiment Name"
        description="Used in analytics data and tracking"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElemButton
        btn="primary"
        input="submit"
        :loading="sending"
      >
        Create New Experiment &rarr;
      </ElemButton>
    </ElemForm>
  </ElemSlideOver>
</template>
