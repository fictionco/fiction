<script lang="ts" setup>
import type { IndexItem, MediaDisplayObject, MemberAccess, NavItem } from '@fiction/core'
import { getAccessLevel, onResetUi, sortPriority, useService, vue } from '@fiction/core'
import El404 from '@fiction/ui/El404.vue'
import type { Card } from '@fiction/site/card'
import ElEngine from '@fiction/cards/CardEngine.vue'
import DashNav from './DashNav.vue'
import DashBar from './DashBar.vue'
import ElLoadingLogo from './ElLoadingLogo.vue'
import DashDarkModeToggle from './DashDarkModeToggle.vue'
import PreLaunch from './PreLaunch.vue'

export type UserConfig = {
  layoutFormat?: 'container' | 'full'
  homeIcon?: MediaDisplayObject
  isNavItem?: boolean
  priority?: number
  navIcon?: string
  navIconAlt?: string
  authRedirect?: string
}

const props = defineProps({
  requires: { type: Array as vue.PropType<('plan' | 'instance')[]>, default: undefined },
  access: { type: String as vue.PropType<MemberAccess>, default: 'view' },
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)
const loading = vue.ref(true)
const site = vue.computed(() => props.card.site)
const { fictionUser } = useService()

const showMobileNav = vue.ref(false)
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

const accessLevel = vue.computed(() => fictionUser.activeRelation.value?.accessLevel || 0)
const memberHasAccess = vue.computed(() => accessLevel.value >= getAccessLevel(props.access))

const primaryNav = vue.computed<NavItem[]>(() => {
  const site = props.card.site
  if (!site)
    return []
  const pages = site?.pages.value as Card<UserConfig>[]
  const navItems = pages.filter(v => v.userConfig.value.isNavItem)

  const r = navItems?.map((item) => {
    const slug = item.slug.value === '_home' ? '' : item.slug.value
    const uc = item.userConfig.value as UserConfig
    const isActive = slug === site.siteRouter.params.value.viewId
    const icon = isActive && uc.navIconAlt ? uc.navIconAlt : uc.navIcon
    return {
      name: item.title.value || '',
      href: item.link(`/${slug}`),
      icon,
      isActive,
      priority: uc.priority,
    }
  })

  const resultSorted = sortPriority(r)

  return resultSorted || []
})

const accountMenu: vue.ComputedRef<IndexItem[]> = vue.computed(() => {
  return [
    {
      name: 'Settings',
      href: props.card.link({ path: '/settings' }),
      icon: 'i-tabler-settings',
    },
    {
      name: 'Dark Mode',
      icon: 'i-tabler-moon-stars',
      figure: { el: DashDarkModeToggle },
    },
    {
      name: 'Sign Out',
      icon: 'i-tabler-arrow-big-left',
      onClick: async (): Promise<void> => {
        loading.value = true
        await fictionUser?.logout({ redirect: '/' })
        loading.value = false
      },
    },
  ]
})

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized()

  if (!user && uc.value.authRedirect)
    props.card.site?.siteRouter.push(uc.value.authRedirect, { caller: 'DashWrap' })

  loading.value = false
})

function toggleSidebar() {
  showMobileNav.value = !showMobileNav.value
}
</script>

<template>
  <div id="admin-page" class="app-wrap relative flex h-dvh flex-col font-sans" :data-route="card.site?.siteRouter.current.value.fullPath">
    <template v-if="!loading && !fictionUser.activeUser.value">
      <El404
        super-heading="401"
        heading="Login Required"
        sub-heading="Signin to your account to access this page."
        :actions="[{ name: 'Login', href: card.link('/auth/login') }]"
      />
    </template>
    <template v-else-if="!memberHasAccess">
      <El404
        heading="No Access"
        sub-heading="You don't have access to this page."
      />
    </template>
    <template v-else-if="uc.layoutFormat === 'full'">
      <ElEngine class="h-full" :card="card" />
    </template>
    <div v-else class="relative min-h-0 grow overflow-scroll">
      <div class="page-area h-full">
        <div
          class="work-area relative block min-h-0 w-full overflow-hidden md:flex md:h-full md:overflow-visible"
        >
          <div
            class="md:opacity-100 will-change-auto transition-all  duration-300 bg-theme-0 dark:bg-theme-900 border-theme-200 dark:border-theme-700 fixed top-0 z-30 justify-end border-r  md:static md:flex h-dvh w-60"
            :class="showMobileNav ? 'left-0 opacity-100' : '-left-full opacity-0'"
          >
            <DashNav :icon="card.userConfig.value.homeIcon" :nav="primaryNav" :card="card" />
            <div class="i-tabler-x text-3xl absolute -right-12 top-4 text-theme-400 hover:text-theme-500 active:text-theme-600 block md:hidden" @click="toggleSidebar()" />
          </div>
          <Transition name="backdrop">
            <div v-if="showMobileNav" class="overlay md:hidden fixed z-20 bg-theme-700/20 inset-0  backdrop-blur-sm" @click="toggleSidebar()" />
          </Transition>
          <div
            v-if="site"
            class="no-scrollbar relative min-h-0 min-w-0 grow overflow-scroll"
          >
            <DashBar class="border-theme-200 dark:border-theme-700 border-b" :account-menu="accountMenu" :card="card" :site="site" @nav="toggleSidebar()" />
            <div
              class="mx-auto pt-4 md:pt-8 md:pb-36 min-h-full"
            >
              <div
                v-if="loading"
                class="text-theme-300 mx-auto flex h-[40vh] w-48 flex-col justify-center rounded-xl p-6 text-center"
              >
                <div class="flex justify-center">
                  <ElLoadingLogo class="w-12" />
                </div>
              </div>
              <template v-else>
                <ElEngine class="h-full" :card="card" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PreLaunch :card="card" />
  </div>
</template>

<style lang="less">
.editor-sidebar textarea {
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.5;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>
