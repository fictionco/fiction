<script lang="ts" setup>
import type {
  FactorRouter,
  MenuGroup,
  MenuItem,
} from '@factor/api'
import {
  onResetUi,
  toLabel,
  useService,
  vue,
} from '@factor/api'
import type { FactorUser } from '@factor/api/plugin-user'
import ElSpinner from './ElSpinner.vue'
import ElNavMenu from './ElNavMenu.vue'
import AdminBar from './AdminBar.vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
  menu: { type: Object as vue.PropType<MenuGroup[]>, default: undefined },
  nav: { type: Array as vue.PropType<MenuItem[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  format: {
    type: String as vue.PropType<'container' | 'full'>,
    default: 'container',
  },
})
const { factorRouter } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const showMobileEditor = vue.ref(false)
const showMobileNav = vue.ref(false)

onResetUi(() => {
  showMobileEditor.value = false
  showMobileNav.value = false
})

const pageTitle = vue.computed<string>(() => {
  const currentRoute = factorRouter.router.currentRoute.value

  const niceName = currentRoute.meta.niceName as
    | ((opts: { factorRouter: FactorRouter }) => string)
    | undefined

  if (props.title)
    return props.title
  else if (niceName)
    return niceName({ factorRouter })
  else return toLabel(currentRoute.meta.name as string)
})

function toggleMobileEditor(v: boolean) {
  showMobileEditor.value = v
}

const isPinned = vue.ref(false)
vue.onMounted(() => {
  const el = document.querySelector('#stickyWatch')
  const observer = new IntersectionObserver(
    ([e]) => (isPinned.value = e.intersectionRatio < 1),
    { threshold: [1] },
  )
  if (el)
    observer.observe(el)
})
</script>

<template>
  <div class="page-area h-full">
    <div
      class="work-area bg-theme-50 relative block min-h-0 w-full overflow-hidden md:flex md:h-full md:overflow-visible"
    >
      <div
        v-if="menu || $slots.menu"
        class="border-theme-300 bg-theme-0 fixed left-0 top-0 z-30 h-full justify-end border-r md:static lg:flex"
        :class="showMobileNav ? 'left-0' : 'left-full'"
      >
        <div class="flex w-56 flex-col md:w-64">
          <div class="flex h-full min-w-0 grow flex-col justify-between">
            <template v-if="$slots.menu">
              <slot name="menu" />
            </template>
            <ElNavMenu v-else :menu="menu" />
          </div>
          <div v-if="$slots.aside" class="aside-sidebar mb-12 mt-6">
            <slot name="aside" />
          </div>
        </div>
      </div>
      <div v-if="format === 'full'" class="h-full w-full overflow-scroll">
        <div
          v-if="loading"
          class="text-theme-300 mx-auto flex h-[40vh] w-48 flex-col justify-center rounded-xl p-6 text-center"
        >
          <div class="flex justify-center">
            <slot v-if="$slots.loader" name="loader" />
            <ElSpinner v-else class="h-12 w-12" />
          </div>
        </div>
        <template v-else>
          <slot />
        </template>
      </div>
      <div
        v-else
        class="bg-theme-50 no-scrollbar relative min-h-0 min-w-0 grow overflow-scroll"
        :class="showMobileEditor ? 'h-full' : ''"
      >
        <AdminBar :title="pageTitle" />
        <div
          class="3xl:max-w-[1800px] mx-auto max-w-[1100px] p-4 md:p-8 md:pb-36"
        >
          <div
            v-if="loading"
            class="text-theme-300 mx-auto flex h-[40vh] w-48 flex-col justify-center rounded-xl p-6 text-center"
          >
            <div class="flex justify-center">
              <slot v-if="$slots.loader" name="loader" />
              <ElSpinner v-else class="h-12 w-12" />
            </div>
          </div>
          <template v-else>
            <!-- <div
              id="stickyWatch"
              class="bg-theme-50 sticky top-[-1px] z-10 -mx-4 px-4 py-2"
              :class="isPinned ? 'border-b border-theme-300 over-shadow' : ''"
            >
              <div class="flex items-center justify-between">
                <div
                  class="font-brand hidden items-center text-lg font-bold md:flex"
                >
                  <div v-html="pageTitle"></div>
                </div>
                <slot name="nav" />

                <ElButton
                  v-if="$slots.editor"
                  class="md:hidden"
                  @click.stop="toggleMobileEditor(true)"
                >
                  <div>Settings</div>
                  <div class="i-heroicons-chevron-right ml-2 text-base"></div>
                </ElButton>
              </div>
            </div> -->
            <slot />
          </template>
        </div>
      </div>
      <div
        v-if="$slots.editor"
        class="editor-sidebar bg-theme-0 border-theme-300 3xl:max-w-[400px] fixed right-0 top-0 z-20 w-full max-w-[300px] overflow-scroll border-l md:static md:z-auto xl:max-w-[470px]"
        :class="showMobileEditor ? 'left-auto z-40 h-full' : 'left-full'"
      >
        <slot name="editor" />
      </div>
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showMobileEditor"
          class="fixed inset-0 z-20 bg-slate-800/75 backdrop-blur-md transition-opacity"
          @click.stop="toggleMobileEditor(false)"
        />
      </transition>
    </div>
  </div>
</template>

<style lang="less">
.work-area {
  .editor-area {
    position: relative;
    .editor-sidebar {
      --input-bg: theme("colors.theme.50");
    }
  }
}
.over-shadow {
  box-shadow:
    0 3px 6px -5px rgba(50, 50, 93, 0.15),
    0 2px 4px -4px rgba(0, 0, 0, 0.2);
}
</style>
