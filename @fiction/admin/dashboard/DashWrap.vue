<script lang="ts" setup>
import type { IndexItem, MediaObject, MemberAccess, NavItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElEngine from '@fiction/cards/CardEngine.vue'
import { getAccessLevel, onResetUi, sortPriority, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import DashBar from './DashBar.vue'
import DashDarkModeToggle from './DashDarkModeToggle.vue'
import DashNav from './DashNav.vue'
import PreLaunch from './PreLaunch.vue'

export type UserConfig = {
  layoutFormat?: 'container' | 'full'
  homeIcon?: MediaObject
  isNavItem?: boolean
  priority?: number
  navTitle?: string
  navIcon?: string
  navIconAlt?: string
  authRedirect?: string
  parentNavItemSlug?: string
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
  const navCards = pages.filter(v => v.userConfig.value.isNavItem)

  const r = navCards?.map((item) => {
    const currentViewId = site.siteRouter.params.value.viewId
    const slug = item.slug.value === '_home' ? '' : item.slug.value
    const itemUc = item.userConfig.value as UserConfig
    const isActive = slug === currentViewId || slug === uc.value.parentNavItemSlug || (!currentViewId && (!slug || slug === '_home'))
    const icon = isActive && itemUc.navIconAlt ? itemUc.navIconAlt : itemUc.navIcon
    return {
      name: itemUc.navTitle || item.title.value || '',
      href: `/${slug}`,
      icon,
      isActive,
      priority: itemUc.priority,
    }
  })

  const resultSorted = sortPriority(r)

  return resultSorted || []
})

const bottomNav = vue.computed<NavItem[]>(() => {
  const site = props.card.site
  if (!site)
    return []
  const currentViewId = site.siteRouter.params.value.viewId

  return [
    {
      name: 'Settings',
      href: `/settings`,
      icon: 'i-tabler-adjustments',
      isActive: currentViewId === 'settings',
    },
  ]
})

const accountMenu: vue.ComputedRef<IndexItem[]> = vue.computed(() => {
  return [
    {
      name: 'Account Settings',
      href: props.card.link({ path: '/settings/account' }),
      icon: 'i-tabler-settings',
    },
    {
      name: 'Dark/Light Mode',
      icon: props.card.site?.isLightMode ? 'i-tabler-sun' : 'i-tabler-moon-stars',
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
  const user = await fictionUser.userInitialized({ caller: 'DashWrap' })

  if (!user && uc.value.authRedirect)
    props.card.site?.siteRouter.push(props.card.link(uc.value.authRedirect), { caller: 'DashWrap' })

  loading.value = false
})

function toggleSidebar() {
  showMobileNav.value = !showMobileNav.value
}
</script>

<template>
  <div id="admin-page" class="app-wrap relative flex h-dvh flex-col font-sans" :data-route="card.site?.siteRouter.current.value.fullPath">
    <transition
      enter-active-class="ease-out duration-200"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
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
        <ElEngine tag="div" class="h-full" :card />
      </template>
      <div v-else class="relative min-h-0 grow overflow-scroll">
        <div class="page-area h-full">
          <div
            class="work-area relative block min-h-0 w-full overflow-hidden md:flex md:h-full md:overflow-visible"
          >
            <div
              class="md:opacity-100 will-change-auto transition-all  duration-300 bg-theme-0 dark:bg-theme-900 border-theme-300/70 dark:border-theme-700 fixed top-0 z-30 justify-end border-r  md:static md:flex h-dvh w-52 lg:w-64"
              :class="showMobileNav ? 'left-0 opacity-100' : '-left-full opacity-0'"
            >
              <DashNav :icon="card.userConfig.value.homeIcon" :nav="primaryNav" :nav-bottom="bottomNav" :card />
              <div class="i-tabler-x text-3xl absolute -right-12 top-4 text-theme-400 hover:text-theme-500 active:text-theme-600 block md:hidden" @click="toggleSidebar()" />
            </div>
            <Transition name="backdrop">
              <div v-if="showMobileNav" class="overlay md:hidden fixed z-20 bg-theme-700/20 inset-0  backdrop-blur-sm" @click="toggleSidebar()" />
            </Transition>
            <div
              v-if="site"
              class="no-scrollbar relative min-h-0 min-w-0 grow overflow-scroll"
            >
              <DashBar class="border-theme-300/70 dark:border-theme-700 border-b" :account-menu="accountMenu" :card="card" :site="site" @nav="toggleSidebar()" />
              <div
                class="mx-auto pt-4 md:pt-8 md:pb-36 min-h-full bg-theme-50/50 dark:bg-theme-950"
              >
                <div
                  v-if="loading"
                  class="text-theme-300 mx-auto flex h-[40vh] w-48 flex-col justify-center rounded-xl p-6 text-center"
                >
                  <div class="flex justify-center">
                    <ElSpinner class="size-12" />
                  </div>
                </div>
                <template v-else>
                  <transition
                    enter-active-class="ease-out duration-300"
                    enter-from-class="opacity-0 translate-y-10"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="ease-in duration-300"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-10"
                    mode="out-in"
                  >
                    <ElEngine :key="card.cardId" tag="div" class="h-full" :card />
                  </transition>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <PreLaunch :card />
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
