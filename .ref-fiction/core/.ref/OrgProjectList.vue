<script lang="ts" setup>
import type { TableCell } from '@factor/ui/ElTable.vue'
import ElTable from '@factor/ui/ElTable.vue'
import { dayjs, displayDomain, toLabel, vue } from '../../utils'
import { useService } from '../../inject'
import type { FactorRouter } from '../../plugin-router'
import type { Organization } from '../types'
import type { FactorAdmin } from '..'

const props = defineProps({
  organization: {
    type: Object as vue.PropType<Organization>,
    required: true,
  },
})

const { factorRouter, factorAdmin } = useService<{
  factorRouter: FactorRouter
  factorAdmin: FactorAdmin
}>()

function rowLink(projectId: string) {
  return factorRouter.link('dashboard', { projectId }).value
}

const formattedData = vue.computed(() => {
  const projects = props.organization.projects ?? []
  const rows
    = projects.map((proj) => {
      return [
        proj.projectId,
        proj.projectName,
        displayDomain(proj.origins?.[0]),
        toLabel(proj.trackingStatus),
        dayjs(proj.updatedAt).format('MMM D, YYYY'),
        {
          type: 'link',
          text: 'settings',
          path: (projectId: string) =>
            factorRouter.link('projectSettings', { projectId }).value || '',
        } as const,
      ]
    }) || []
  const r = [
    ['', 'Name', 'URL', 'Status', 'Updated', ''],
    ...rows,
  ] as TableCell[][]

  return r
})
</script>

<template>
  <ElTable
    :table="formattedData"
    :row-link="rowLink"
    :empty="{
      title: 'No projects found',
      description: 'Create one to get started',
    }"
    :actions="[
      {
        name: 'Create New Project',
        link: factorRouter.link('newProject'),
      },
    ]"
  />
</template>
