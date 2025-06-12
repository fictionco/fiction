<script lang="ts" setup>
import type { IndexItem, MediaObject, MemberAccess, NavListItem } from '@fiction/core'
import type { FictionStripe } from '@fiction/plugin-stripe'
import type { Card } from '@fiction/site/card'
import type { FictionAdmin } from '..'
import ElEngine from '@fiction/cards/CardEngine.vue'
import { getAccessLevel, onResetUi, sortPriority, useService, vue } from '@fiction/core'
import FictionLogo from '@fiction/ui/brand/FictionLogo.vue'
import ElClose from '@fiction/ui/common/ElClose.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import DashBar from './DashBar.vue'
import DashNav from './DashNav.vue'

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

const { card, access = 'subscriber' } = defineProps<{
  card: Card<UserConfig>
  requires?: ('plan' | 'instance')[]
  access?: MemberAccess
}>()

const uc = vue.computed(() => card.userConfig.value)
const loading = vue.ref(true)
const site = vue.computed(() => card.site)
const { fictionUser, fictionStripe, fictionAdmin } = useService<{ fictionStripe?: FictionStripe, fictionAdmin: FictionAdmin }>()

const showMobileNav = vue.ref(false)
onResetUi(() => (showMobileNav.value = false))

const accessLevel = vue.computed(() => fictionUser.activeRelation.value?.accessLevel || 0)
const memberHasAccess = vue.computed(() => accessLevel.value >= getAccessLevel(access))

const primaryNav = vue.computed<NavListItem[]>(() => {
  const site = card.site
  if (!site)
    return []
  const pages = site?.pages.value as Card<UserConfig>[]
  const navCards = pages.filter(v => v.userConfig.value.isNavItem)

  const r = navCards?.map((item) => {
    const currentViewId = site.siteRouter.params.value.viewId
    const isHome = item.slug.value === '_home' || item.isHome.value || item.slug.value === ''
    const slug = isHome ? '' : item.slug.value
    const itemUc = item.userConfig.value as UserConfig
    const isActive = slug === currentViewId || slug === uc.value.parentNavItemSlug || (!currentViewId && (isHome))
    const iconClass = isActive && itemUc.navIconAlt ? itemUc.navIconAlt : itemUc.navIcon
    const icon = { class: iconClass }
    return {
      testId: slug,
      label: itemUc.navTitle || item.title.value || '',
      href: `/${slug}`,
      icon,
      isActive,
      priority: itemUc.priority,
    }
  })

  const resultSorted = sortPriority(r) as NavListItem[]
  const currentViewId = site.siteRouter.params.value.viewId
  resultSorted.push({
    label: 'Settings',
    href: `/settings`,
    icon: { class: 'i-tabler-settings' },
    isActive: currentViewId === 'settings',
  })

  return resultSorted || []
})

// const bottomNav = vue.computed<NavListItem[]>(() => {
//   const site = card.site
//   if (!site)
//     return []
//   const currentViewId = site.siteRouter.params.value.viewId
//   const activeOrganization = fictionUser.activeOrganization.value
//   return [
//     {
//       label: 'Settings',
//       href: `/settings`,
//       icon: { class: 'i-tabler-settings' },
//       isActive: currentViewId === 'settings',
//     },
//   ] satisfies NavListItem[]
// })

const accountMenu: vue.ComputedRef<IndexItem[]> = vue.computed(() => {
  return [
    {
      label: 'Global Settings',
      href: card.link({ path: '/settings/org' }),
      icon: 'i-tabler-building-cog',
    },
    {
      label: 'User Settings',
      href: card.link({ path: '/settings/account' }),
      icon: 'i-tabler-user-cog',
    },
    {
      label: 'Sign Out',
      icon: 'i-tabler-logout',
      onClick: async (): Promise<void> => {
        loading.value = true
        await fictionUser?.logout({ redirect: '/' })
        loading.value = false
      },
    },
  ] satisfies IndexItem[]
})

vue.onMounted(async () => {
  loading.value = true
  try {
    await fictionAdmin.onClientMounted({ card })
  }
  catch (e) {
    console.error('mount error', e)
  }
  finally {
    loading.value = false
  }
})

const icon = { format: 'component', el: FictionLogo } as MediaObject
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
          :super-title="{ text: '401' }"
          title="Signed Out"
          sub-title="Signin to your account to access this page."
          :buttons="[{ label: 'Login', href: card.link('/auth') }]"
        />
      </template>
      <template v-else-if="!memberHasAccess">
        <El404
          title="No Access"
          sub-title="You don't have access to this page."
        />
      </template>
      <template v-else-if="uc.layoutFormat === 'full'">
        <ElEngine tag="div" class="h-full overflow-y-scroll no-scrollbar" :card />
      </template>
      <div v-else class="relative min-h-0 grow overflow-scroll no-scrollbar">
        <div class="page-area h-full">
          <div
            class="work-area relative block min-h-0 w-full overflow-hidden md:flex md:h-full md:overflow-visible"
          >
            <div
              class="md:static md:flex h-dvh w-[60%] md:w-[calc(16rem+3vw)] shrink-0 md:opacity-100 will-change-auto transition-all  duration-300 border-theme-300/50 dark:border-theme-600/50 fixed top-0 z-30 justify-end border-r"
              :class="showMobileNav ? 'left-0 opacity-100 bg-theme-900/60' : '-left-full opacity-0'"
            >
              <DashNav class="md:pl-12 md:pr-4" :icon :nav="primaryNav" :card />
              <ElClose v-if="showMobileNav" class="absolute -right-16 top-4" @click="showMobileNav = false" />
            </div>
            <Transition name="backdrop">
              <div v-if="showMobileNav" class="overlay md:hidden fixed z-20 bg-theme-700/20 inset-0  backdrop-blur-sm" @click="showMobileNav = false" />
            </Transition>
            <div
              v-if="site"
              class="no-scrollbar relative min-h-0 min-w-0 grow flex flex-col h-[100dvh]"
            >
              <DashBar
                v-model:show-mobile-nav="showMobileNav"
                class="border-theme-300/70 dark:border-theme-700 border-b md:hidden"
                :account-menu="accountMenu"
                :customer="fictionStripe?.activeCustomer.value"
                :card
                :site
                :icon
              />
              <div
                class="mx-auto bg-theme-0 dark:bg-theme-950 grow overflow-scroll w-full no-scrollbar"
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
