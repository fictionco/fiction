<script lang="ts" setup>
import ElPanel from '@factor/ui/ElPanel.vue'
import { useKaption, vue } from '../../utils'
import type { Organization } from '../types'
import AdminPage from '../AdminPage.vue'
import OrgWrapActions from '../OrgWrapActions.vue'

const { factorRouter, factorAdmin } = useKaption()

const activeOrganizations = factorAdmin.activeOrganizations
const activeProject = factorAdmin.activeProject
const allProjects = vue.computed(() => {
  return activeOrganizations.value.flatMap((o) => {
    return o.projects || []
  })
})

function getOrg(organizationId: string): Organization | undefined {
  return activeOrganizations.value.find(
    o => o.organizationId === organizationId,
  )
}
</script>

<template>
  <AdminPage>
    <template #actions>
      <OrgWrapActions />
    </template>
    <ElPanel
      title="All Projects"
      class="mb-8"
      :raw="true"
    >
      <div role="list" class="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        <RouterLink
          v-for="(project, i) in allProjects"
          :key="i"
          class="col-span-1 aspect-[3/1] rounded-md border border-slate-300 bg-white p-5 shadow ring-1 ring-transparent transition-all"
          :to="
            factorRouter.link('dashboard', { projectId: project.projectId })
              .value
          "
          :class="
            activeProject?.projectId === project.projectId
              ? ''
              : 'bg-white hover:shadow-md'
          "
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-bold">
                {{ project.projectName }}
              </h3>
              <div class="text-theme-500">
                {{ getOrg(project.organizationId)?.organizationName }}
              </div>
            </div>

            <div class="pt-0.5">
              <span
                v-if="activeProject?.projectId === project.projectId"
                class="inline-flex items-center rounded-full bg-primary-500 px-2.5 py-0.5 text-xs font-bold uppercase text-white"
              >
                Active
              </span>
            </div>
          </div>
        </RouterLink>
      </div>
    </ElPanel>
  </AdminPage>
</template>
