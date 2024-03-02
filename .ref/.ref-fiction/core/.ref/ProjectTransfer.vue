<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { resetUi, useKaption, vue, vueRouter } from '../../utils'
import ElButton from '../ui/ElButton.vue'
import ElSlideover from '../ui/ElSlideOver.vue'

import type { Organization, Project } from '..'

const { kaptionDashboard, factorAdmin, factorRouter } = useKaption()
const route = vueRouter.useRoute()

const sending = vue.ref(false)

const organizationId = vue.computed<string>({
  get: () => route.query.organizationId as string,
  set: async (v) => {
    await factorRouter.replace({ query: { ...route.query, organizationId: v } })
  },
})

const project = vue.computed<Project | undefined>(() => {
  return factorAdmin.getProjectById(route.query.projectId as string)
})

const orgList = vue.computed(() => {
  const list = factorAdmin.activeOrganizations.value
    .filter((org: Organization) =>
      factorAdmin.priv.userCan({
        capability: 'administrate',
        memberAccess: org.relation?.memberAccess,
      }),
    )
    .map((org: Organization) => {
      return { name: org.organizationName, value: org.organizationId }
    })

  return list
})

async function submit(): Promise<void> {
  if (!project.value?.projectId)
    throw new Error('projectId is missing')

  sending.value = true

  const r = await factorAdmin.requests.ManageProject.request({
    organizationId: organizationId.value,
    projectId: project.value?.projectId,
    _action: 'transfer',
  })
  sending.value = false

  if (r.status === 'success') {
    await factorRouter.replace({ query: {} }, { id: 'submit' })
    resetUi({ scope: 'all', cause: 'submitProjectTransfer' })
  }
}
</script>

<template>
  <ElSlideover name="transferSite">
    <div
      class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100"
    >
      <svg
        class="h-6 w-6 text-primary-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    </div>

    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Transfer Project
      </h2>
      <p class="text-theme-500">
        Transfer a project to a different organization
      </p>
    </div>

    <ElForm @submit="submit()">
      <ElInput
        :model-value="project?.projectName"
        input="InputText"
        label="Site To Transfer"
        description="The website to transfer"
        disabled
      />

      <ElInput
        v-model="organizationId"
        input="InputSelectCustom"
        label="New Owner Organization"
        description="The organization that will manage this site"
        default-value="Select Organization"
        :list="orgList"
        required
      />

      <ElButton
        type="submit"
        btn="primary"
        :loading="sending"
      >
        Transfer Project
      </ElButton>
    </ElForm>
  </ElSlideover>
</template>
