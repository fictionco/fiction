<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElSlideover from '@factor/ui/ElSlideOver.vue'
import type { FactorRouter } from '@factor/api'
import { resetUi, useService, vue, vueRouter } from '@factor/api'
import type { FactorDashboard } from '..'

const { factorRouter, factorDashboard } = useService<{
  factorRouter: FactorRouter
  factorDashboard: FactorDashboard
}>()

const router = vueRouter.useRouter()
const sending = vue.ref(false)

const isValid = vue.ref<boolean>(false)
const formError = vue.ref('')

/**
 * Form values
 */
const form = vue.ref<{ dashboardName?: string }>({ dashboardName: '' })

async function createDashboard(): Promise<void> {
  const { dashboardName } = form.value
  if (!dashboardName) {
    formError.value = 'dashboard name is required'
    return
  }

  const r = await factorDashboard.requests.ManageCustomDashboard.projectRequest(
    {
      _action: 'create',
      dashboardName,
    },
  )

  if (r.status === 'success' && r.data) {
    const createdDashboard = r.data
    const dashboardId = createdDashboard.dashboardId
    await router.push(factorRouter.to('dashboardSingle', { dashboardId }))
    resetUi({ scope: 'all', cause: 'createDashboard' })
  }
}

async function send(): Promise<void> {
  sending.value = true
  await createDashboard()
  sending.value = false
}
</script>

<template>
  <ElSlideover name="newDashboard">
    <div
      class="bg-theme-100 flex h-12 w-12 items-center justify-center rounded-full"
    >
      <div class="i-carbon-dashboard text-theme-500 text-2xl" />
    </div>

    <div class="py-3">
      <h2 class="text-xl font-bold">
        Create a Custom Dashboard
      </h2>
      <p class="text-theme-500 mt-2">
        Customize the layout.
      </p>
    </div>

    <ElForm
      v-model:valid="isValid"
      :data="form"
      spellcheck="false"
      :notify="formError"
      @submit="send()"
    >
      <ElInput
        v-model="form.dashboardName"
        class="my-8"
        input="InputText"
        label="Give it a name..."
        placeholder=""
        required
      />

      <ElInput input="InputSubmit" :loading="sending">
        Create Dashboard &rarr;
      </ElInput>
    </ElForm>
  </ElSlideover>
</template>
