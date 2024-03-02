<script lang="ts" setup>
import DropDown from '@factor/ui/DropDown.vue'
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
      name: o.organizationName,
      value: o.organizationId,
      selected: activeOrganization.value?.organizationId === o.organizationId,
    }
  })

  if (props.hideExample)
    items = items.filter(i => i.value !== 'example')

  items.push({ value: 'divider' }, { name: 'Add Organization', value: 'add' })

  return items
})

async function changeOrg(organizationId?: string) {
  if (!organizationId)
    return

  if (organizationId === 'add')
    await factorRouter.goto('accountNewOrg')
  else
    await factorRouter.goto('orgHome', { organizationId, modelId: '' })

  resetUi({ scope: 'all', cause: 'changeOrg' })
}
</script>

<template>
  <DropDown
    :list="orgList"
    :model-value="activeOrganization?.organizationId"
    default-text="Select Organization"
    format="block"
    @update:model-value="changeOrg($event as string)"
  />
</template>
