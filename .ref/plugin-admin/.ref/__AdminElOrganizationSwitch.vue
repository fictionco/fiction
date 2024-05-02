<script lang="ts" setup>
import type {
  FactorRouter,
  FactorUser,
  ListItem,
} from '@factor/api'
import {
  onResetUi,
  resetUi,
  useService,
  vue,
} from '@factor/api'
import DropDown from '@factor/ui/DropDown.vue'

const props = defineProps({
  hideExample: { type: Boolean, default: false },
})
const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()
const activeOrganization = factorUser.activeOrganization
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

const orgList = vue.computed(() => {
  const orgs = factorUser.activeOrganizations.value

  let items: ListItem[] = orgs.map((o) => {
    return {
      name: o.orgName,
      value: o.orgId,
      selected: activeOrganization.value?.orgId === o.orgId,
    }
  })

  if (props.hideExample)
    items = items.filter(i => i.value !== 'example')

  items.push({ value: 'divider' }, { name: 'Add Organization', value: 'add' })

  return items
})

async function changeOrg(orgId?: string) {
  if (!orgId)
    return

  if (orgId === 'add')
    await factorRouter.goto('accountNewOrg')
  else
    await factorRouter.goto('orgHome', { orgId, modelId: '' })

  resetUi({ scope: 'all', cause: 'changeOrg' })
}
</script>

<template>
  <DropDown
    :list="orgList"
    :model-value="activeOrganization?.orgId"
    default-text="Select Organization"
    format="block"
    @update:model-value="changeOrg($event as string)"
  />
</template>
