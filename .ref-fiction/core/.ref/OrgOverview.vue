<script lang="ts" setup>
import ElPanel from '@factor/ui/ElPanel.vue'
import { useService } from '../../inject'
import BaseWrap from '../BaseWrap.vue'
import type { FactorAdmin } from '..'
import ProjectList from './OrgProjectList.vue'

const { factorAdmin } = useService<{ factorAdmin: FactorAdmin }>()

const activeOrganization = factorAdmin.activeOrganization
</script>

<template>
  <BaseWrap>
    <ElPanel
      v-if="activeOrganization"
      :title="`${activeOrganization?.organizationName} Projects`"
      class="mb-8"
    >
      <ProjectList :organization="activeOrganization" />
    </ElPanel>
    <div v-else class="p-6">
      No active organization
    </div>
  </BaseWrap>
</template>
