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
import ElAvatar from '@factor/ui/ElAvatar.vue'
import ElNavMenu from '@factor/ui/ElNavMenu.vue'
import type { FactorUser } from '@factor/api/plugin-user'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElMenu from '@factor/ui/ElMenu.vue'
import AdminPage from '@factor/ui/AdminPage.vue'
import type { PageLinesAdmin } from '../plugin-admin'
import ElIcon from '../ui/ElIcon.vue'
import ElLoadingLogo from './ElLoadingLogo.vue'
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

const { factorUser, factorRouter } = useService<{
  pageLinesAdmin: PageLinesAdmin
  factorUser: FactorUser
  factorRouter: FactorRouter
  factorApp: FactorApp
}>()

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

  return vue.computed(() => {
    const menu: MenuGroup[] = [
      {
        menu: [
          factorRouter.getRouteMenuItem('orgHome'),
          factorRouter.getRouteMenuItem('orgSettings'),
          factorRouter.getRouteMenuItem('team'),
        ],
      },
    ]

    return menu
  })
}

const menu = [
  {
    name: 'Email Us',
    value: 'support',
    callback: async (): Promise<void> => {
      window.location.href = 'mailto:hello@pagelines.com'
    },
  },
  {
    name: 'Go to PageLines.com',
    value: 'www',
    callback: () => {
      return factorRouter.push({ path: '/' })
    },
  },
  {
    name: 'Logout',
    value: 'logout',
    callback: async (): Promise<void> => {
      await factorUser.logout()
    },
  },
]
</script>

<template>
  <AdminPage :format="format">
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
      <div class="space-y-2">
        <div
          class="border-theme-200 flex items-center justify-between space-x-4 border-b p-4 shadow-sm md:min-w-[150px]"
        >
          <RouterLink
            :to="factorRouter.link('orgHome').value"
            class="mr-2 active:opacity-80 md:mr-8"
          >
            <ElIcon class="w-8" />
          </RouterLink>
          <ElMenu
            v-slot="{ active }"
            size="md"
            direction="left"
            default-text="Menu"
            :list="menu"
          >
            <div class="group flex cursor-pointer items-center space-x-2">
              <div
                class="flex flex-col items-end justify-center transition-all"
                :class="active ? 'space-y-1' : 'space-y-0.5'"
              >
                <div
                  class="h-1 w-1 rounded-full bg-theme-300 group-hover:bg-theme-400"
                />
                <div
                  class="h-1 w-1 rounded-full bg-theme-300 group-hover:bg-theme-400"
                />
                <div
                  class="h-1 w-1 rounded-full bg-theme-300 group-hover:bg-theme-400"
                />
              </div>
              <ElAvatar
                class="ring-theme-300 ml-3 h-8 w-8 rounded-full ring-2"
                :class="active ? 'opacity-70' : ''"
                :email="factorUser.activeUser.value?.email"
              />
            </div>
          </ElMenu>
        </div>
        <div class="px-6 py-2">
          <ElNavMenu :menu="getMainMenu().value" />
        </div>
      </div>
    </template>

    <template v-if="$slots.nav" #nav>
      <slot name="nav" />
    </template>

    <template v-if="$slots.editor && memberHasAccess" #editor>
      <slot name="editor" />
    </template>

    <template #loader>
      <ElLoadingLogo class="w-12" />
    </template>

    <template #aside>
      <div class="p-4">
        <AdminElDrawer />
      </div>
    </template>
  </AdminPage>
</template>

<style lang="less">
.editor-sidebar textarea {
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.5;
}
</style>
