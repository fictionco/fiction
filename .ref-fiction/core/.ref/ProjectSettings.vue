<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import { emitEvent, useKaption, vue } from '../../utils'
import InputOrigins from '../ui/InputOrigins.vue'
import ElButton from '../ui/ElButton.vue'
import ElPanel from '../ui/ElPanel.vue'
import AdminPage from '../AdminPage.vue'
import type { Project } from '../types'

const { factorRouter, factorUser, factorAdmin } = useKaption()

const activeProject = factorAdmin.activeProject
const form = vue.computed<Partial<Project>>({
  get: () => {
    const p = activeProject.value
    const origins = p?.origins && p?.origins.length > 0 ? p?.origins : ['']
    return { ...p, origins }
  },
  set: (v) => {
    activeProject.value = {
      ...activeProject.value,
      ...v,
    } as Project
  },
})

const origins = vue.computed({
  get: () => {
    return form.value.origins
  },
  set: (v) => {
    form.value = { ...form.value, origins: v }
  },
})

const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

async function updateProject(): Promise<void> {
  if (!form.value?.projectId)
    throw new Error('no project id')

  await factorAdmin.requests.ManageProject.request({
    _action: 'update',
    projectId: form.value.projectId,
    project: form.value,
  })
}

async function send(): Promise<void> {
  sending.value = true
  await updateProject()
  sent.value = true
  sending.value = false
}

async function maybeDeleteProject(): Promise<void> {
  const confirmed = confirm(
    'Are you sure? Deleting this project will delete its data permanently.',
  )

  const projectId = factorAdmin.activeProject.value?.projectId

  if (!projectId)
    throw new Error('no project id')

  if (confirmed) {
    sending.value = 'delete'
    await factorAdmin.requests.ManageProject.request({
      _action: 'delete',
      projectId,
    })

    await factorRouter.goto('orgSettings')
    sent.value = true
    sending.value = false
  }
}
</script>

<template>
  <AdminPage>
    <template #actions>
      <ElButton
        btn="slate"
        :loading="sending"
        @click="send()"
      >
        Save Changes
      </ElButton>
    </template>

    <ElPanel title="Project Details">
      <div class="max-w-prose px-4 lg:px-8">
        <ElInput
          v-model="form.projectName"
          class="my-8"
          input="InputText"
          label="Project Name"
          description="Optional - defaults to the domain name"
          placeholder="Example Inc."
        />

        <ElInput class="my-8" label="Project Site(s)">
          <InputOrigins v-model="origins" />
        </ElInput>

        <ElInput
          v-model="form.timezone"
          class="my-8"
          input="InputTimezone"
          label="Property Timezone"
          description="For analytics dates and times"
          @keyup.enter.stop="emitEvent('submit')"
        />
        <ElInput
          class="my-8"
          label="Manage Organization and Team"
          description="To manage users and permissions visit the organization management page."
        >
          <ElButton
            class="my-2"
            :to="
              factorRouter.link('orgSettings', {
                organizationId:
                  factorAdmin.activeOrganization.value?.organizationId,
              }).value
            "
            btn="default"
          >
            View Organization ({{
              factorAdmin.activeOrganization.value?.organizationName
            }}) &rarr;
          </ElButton>
        </ElInput>
      </div>
    </ElPanel>

    <ElPanel title="Danger Zone">
      <div class="max-w-prose px-4 lg:px-8">
        <ElInput
          class="my-8"
          label="Delete Project"
          description="Permanently delete this project and its data."
        >
          <div class="rounded-md pt-4">
            <ElButton
              :loading="sending === 'delete'"
              btn="red"
              @click="maybeDeleteProject()"
            >
              Permanently Delete Project
            </ElButton>
          </div>
        </ElInput>
      </div>
    </ElPanel>
  </AdminPage>
</template>
