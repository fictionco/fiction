<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { emitEvent, vue } from '@factor/api'
import InputOrigins from '../ui/InputOrigins.vue'
import { useKaption } from '../../utils'
import ElButton from '../ui/ElButton.vue'
import ElPanel from '../ui/ElPanel.vue'
import AdminPage from '../AdminPage.vue'
import type { Project } from '../types'

const { factorRouter, factorAdmin } = useKaption()

const form = vue.ref<Partial<Project>>({
  origins: [''],
  organizationId: '',
  projectName: '',
})
const isValid = vue.ref<boolean>(false)
const sending = vue.ref(false)

async function createAction(): Promise<void> {
  sending.value = true

  const organizationId = factorAdmin.activeOrganization.value?.organizationId

  const r = await factorAdmin.requests.CreateProject.request({
    project: form.value,
    organizationId,
  })
  sending.value = false

  const { status, projectId } = r

  if (status === 'success' && projectId)
    await factorRouter.push(factorRouter.link('dashboard', { projectId }).value)
}
</script>

<template>
  <AdminPage>
    <template #actions />

    <ElPanel title="Create new Project">
      <div class="max-w-xl px-4 lg:px-8">
        <ElForm
          v-model:valid="isValid"
          :data="form"
          @submit="createAction()"
        >
          <ElInput
            v-model="form.projectName"
            class="my-8"
            input="InputText"
            label="Project Name"
            placeholder="Example Workspace"
            @keyup.enter.stop="emitEvent('submit')"
          />

          <ElInput class="my-8" label="Project Site(s)">
            <InputOrigins v-model="form.origins" />
          </ElInput>

          <div class="my-8">
            <ElButton
              type="submit"
              btn="slate"
              :loading="sending"
            >
              Create &rarr;
            </ElButton>
          </div>
        </ElForm>
      </div>
    </ElPanel>
  </AdminPage>
</template>
