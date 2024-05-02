<script lang="ts" setup>
import type { MemberAccess } from '@factor/api'
import { getAccessLevel, getColorScheme, onResetUi, useService, vue } from '@factor/api'
import El404 from '@factor/ui/El404.vue'
import type { FactorAdmin } from '..'
import ANav from './ANav.vue'
import ABar from './ABar.vue'
import ElLoadingLogo from './ElLoadingLogo.vue'

const props = defineProps({
  requires: { type: Array as vue.PropType<('plan' | 'instance')[]>, default: undefined },
  access: { type: String as vue.PropType<MemberAccess>, default: 'view' },
  format: { type: String as vue.PropType<'container' | 'full'>, default: 'container' },
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})

const { factorUser, factorRouter, factorAdmin } = useService<{ factorAdmin: FactorAdmin }>()

const showMobileNav = vue.ref(false)
const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

const accessLevel = vue.computed(() => factorUser.activeRelation.value?.accessLevel || 0)
const memberHasAccess = vue.computed(() => accessLevel.value >= getAccessLevel(props.access))
const theme = vue.computed(() => getColorScheme('slateInverted'))
const primary = vue.computed(() => getColorScheme('blueInverted'))
</script>

<template>
  <div id="admin-page" class="app-wrap relative flex h-screen flex-col font-sans" :data-route="factorRouter.current.value.fullPath">
    <template v-if="!loading && !factorUser.activeUser.value">
      <El404
        heading="Login Required"
        sub-heading="Log in to access this page."
        :actions="[{ name: 'Login', href: factorRouter.link('auth', { viewId: 'login' }).value }]"
      />
    </template>
    <template v-else-if="!memberHasAccess">
      <El404
        heading="No Access"
        sub-heading="You don't have access to this page."
      />
    </template>
    <template v-else-if="factorAdmin.currentView.value?.userConfig?.layoutFormat === 'full'">
      <slot />
    </template>
    <div v-else class="text-theme-800 relative min-h-0 grow overflow-scroll">
      <div class="page-area h-full">
        <div
          class="work-area bg-theme-50 relative block min-h-0 w-full overflow-hidden md:flex md:h-full md:overflow-visible"
        >
          <div
            class="border-theme-300 bg-theme-0 fixed left-0 top-0 z-30 h-full justify-end border-r md:static md:flex"
            :class="showMobileNav ? 'left-0' : 'left-full'"
          >
            <div class="flex w-60 flex-col">
              <div class="flex h-full min-w-0 grow flex-col justify-between">
                <div class="px-3 py-2">
                  <ANav />
                </div>
                <div
                  class="p-6 items-center justify-center space-x-4   md:min-w-[150px] flex mb-4 "
                >
                  <RouterLink
                    :to="factorRouter.link('adminNaked').value"
                    class="text-theme-300 hover:text-primary-500 mr-2 px-4 active:opacity-80 transition-all"
                  >
                    <component :is="factorAdmin.settings.ui?.AuthLogo" class="h-6" />
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-theme-50 no-scrollbar relative min-h-0 min-w-0 grow overflow-scroll"
          >
            <ABar />
            <div
              class=" mx-auto   p-4 md:p-8 md:pb-36"
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
                <slot />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.editor-sidebar textarea {
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.5;
}

.app-wrap.dark {
  --theme-0: v-bind("theme[0]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-950: v-bind("theme[950]");
  --theme-1000: v-bind("theme[1000]");
  --primary-0: v-bind("primary[0]");
  --primary-50: v-bind("primary[50]");
  --primary-100: v-bind("primary[100]");
  --primary-200: v-bind("primary[200]");
  --primary-300: v-bind("primary[300]");
  --primary-400: v-bind("primary[400]");
  --primary-500: v-bind("primary[500]");
  --primary-600: v-bind("primary[600]");
  --primary-700: v-bind("primary[700]");
  --primary-800: v-bind("primary[800]");
  --primary-900: v-bind("primary[900]");
  --primary-1000: v-bind("primary[1000]");
}
</style>
