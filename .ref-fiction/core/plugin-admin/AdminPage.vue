<script lang="ts" setup>
import type {
  FactorApp,
  FactorRouter,
  MemberAccess,
  MenuGroup,
} from '@factor/api'
import {
  getAccessLevel,
  onResetUi,
  useService,
  vue,
} from '@factor/api'
import ElNavMenu from '@factor/ui/ElNavMenu.vue'
import type { FactorUser } from '@factor/api/plugin-user'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElPage from '@factor/ui/AdminPage.vue'
import type { FictionPayment } from '../plugin-payment'
import type { FactorAdmin } from '../plugin-admin'
import ElLoadingLogo from '../ui/ElLoadingLogo.vue'
import type { FictionInstance } from '../plugin-instance'
import ElServerButton from '../plugin-instance/ElServerButton.vue'
import type { FictionOnboard } from '../plugin-onboard'
import ElFixedPricing from '../plugin-payment/ElFixedPricing.vue'
import AdminElDrawer from './AdminElDrawer.vue'

const props = defineProps({
  requires: {
    type: Array as vue.PropType<('plan' | 'instance')[]>,
    default: undefined,
  },
  access: {
    type: String as vue.PropType<MemberAccess>,
    default: 'view',
  },
  format: {
    type: String as vue.PropType<'container' | 'full'>,
    default: 'container',
  },
})

const { fictionPayment, factorUser, factorRouter } = useService<{
  factorAdmin: FactorAdmin
  fictionPayment: FictionPayment
  factorUser: FactorUser
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
  fictionOnboard: FictionOnboard
  factorApp: FactorApp
}>()

const customerIsPaid = vue.computed(() => {
  const quantity = fictionPayment.activeCustomer.value?.totalQuantity
  return quantity && quantity > 0
})

const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

const accessLevel = vue.computed(() => {
  return factorUser.activeRelation.value?.accessLevel || 0
})

const memberHasAccess = vue.computed(() => {
  const acc = accessLevel.value
  return acc >= getAccessLevel(props.access)
})

function getMainMenu() {
  if (!factorRouter)
    throw new Error('no router')

  const appMenu = [
    factorRouter.getRouteMenuItem('webui'),
    factorRouter.getRouteMenuItem('fileBrowser'),
  ]

  const serverMenu = [
    factorRouter.getRouteMenuItem('renderCreate', {
      replace: { modelId: '' },
    }),
    factorRouter?.getRouteMenuItem('modelIndex'),
    factorRouter?.getRouteMenuItem('collectionIndex'),
  ]

  return vue.computed(() => {
    const orgName = factorUser?.activeOrganization?.value?.organizationName
    const menu: MenuGroup[] = [
      {
        groupName: orgName || 'Home',
        menu: [
          factorRouter.getRouteMenuItem('home', {
            replace: { modelId: '' },
          }),
        ],
      },
      { groupName: 'Dreambooth', menu: serverMenu },
      { groupName: 'Server Kit', menu: appMenu },
      {
        groupName: 'Setup',
        menu: [
          factorRouter.getRouteMenuItem('orgSettings'),
          factorRouter.getRouteMenuItem('team'),
        ],
      },
    ]

    return menu
  })
}
</script>

<template>
  <ElPage :format="format">
    <template v-if="!memberHasAccess">
      <ElPanel>
        <ElZeroBanner
          title="No Access"
          description="You don't have access to this page. Contact the adminstrator of this organization to gain access."
        />
      </ElPanel>
    </template>
    <template v-else>
      <slot />
    </template>

    <template #menu>
      <div class="space-y-6 p-4">
        <div
          class="flex items-center justify-center space-x-4 md:min-w-[150px]"
        >
          <RouterLink to="/" class="mr-2 active:opacity-80 md:mr-8">
            Logo
          </RouterLink>
        </div>
        <div class="grow text-center">
          <ElServerButton />
        </div>
        <ElNavMenu :menu="getMainMenu().value" class="text-sm" />
      </div>
    </template>

    <template v-if="$slots.editor && memberHasAccess" #editor>
      <slot name="editor" />
    </template>

    <template #loader>
      <ElLoadingLogo class="w-24" />
    </template>

    <template #aside>
      <div class="p-4">
        <AdminElDrawer />
      </div>
    </template>

    <ElFixedPricing v-if="!customerIsPaid" />
  </ElPage>
</template>
