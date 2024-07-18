<script lang="ts" setup>
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { getNavComponentType, onResetUi, shortId, vue } from '@fiction/core/index.js'
import type { NavItem } from '@fiction/core'
import { animateItemEnter, useElementVisible } from './anim'

const props = defineProps({
  vis: { type: Boolean, default: false },
  accountMenu: { type: Array as vue.PropType<NavItem[]>, default: () => [] },
  nav: { type: Object as vue.PropType<Record<string, NavItem[]>>, required: true },
})

const emit = defineEmits(['update:vis'])

const randomId = shortId()
const afterVisible = vue.ref(false)
const scrolled = vue.ref(false)
const activeSubNav = vue.ref<string>()

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

function close(): void {
  activeSubNav.value = ''
  emit('update:vis', false)
}

onResetUi(() => close())

vue.onMounted(() => {
  const el = document.querySelector('.x-site-content') as HTMLElement | null

  vue.watch(
    () => props.vis,
    (vis) => {
      if (!el)
        return

      if (vis) {
        el.style.transform = 'translateX(-300px) '
        el.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
        el.style.height = '100dvh'
        el.style.overflow = 'hidden'

        setTimeout(() => (afterVisible.value = true), 300)
      }
      else {
        afterVisible.value = false
        el.style.transform = 'none'
        el.style.height = 'auto'
        el.style.overflow = ''
      }
    },
    { immediate: true },

  )
})

vue.onMounted(() => {
  useElementVisible({
    selector: `#${randomId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${randomId} .x-action-item`, themeId: 'rise', config: { } })
    },
  })
})

// TODO
function getIcon(icon: string): string {
  return ``
}

function handleItemClick(args: { item: NavItem, event: MouseEvent }): void {
  const { item, event } = args

  if (item.items) {
    event?.preventDefault()

    if (activeSubNav.value === item.name) {
      activeSubNav.value = ''
    }
    else {
      activeSubNav.value = item.name
    }
  }

  else if (item.onClick) {
    item.onClick(args)
  }
}
</script>

<template>
  <teleport to=".x-site">
    <div v-if="vis" class="dark z-0 fixed h-[100dvh] top-0 right-0 w-full bg-gradient-to-br from-theme-800 to-theme-950 text-theme-0" @update:vis="emit('update:vis', $event)" @click.stop>
      <div :id="randomId" class="w-[275px] h-full float-right">
        <a class="close absolute block right-10 top-10 z-20 cursor-pointer hover:scale-110" :class="!vis ? 'out' : ''" @click="close()">
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]  rounded-full transition-all " />
          <span class="close-wrap overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] absolute">
            <span class="close-line close-line1 h-full w-[2px] bg-theme-0 absolute rounded-[5px] left-[13px] transition-all" />
            <span class="close-line close-line2 h-full w-[2px] bg-theme-0 absolute rounded-[5px] left-[13px] transition-all" />
          </span>
        </a>

        <div class="h-full py-20 flex flex-col justify-start gap-6 relative z-10 overflow-y-scroll">
          <div v-for="(n, i) in nav" :key="i" class="  p-6 flex flex-col justify-center">
            <div
              class="flex flex-col gap-6"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <template v-for="(item, i) in n" :key="i">
                <component
                  :is="getNavComponentType(item)"
                  :to="item.href"
                  :href="item.href"
                  role="menuitem"
                  class="x-action-item font-sans text-3xl font-medium "
                  :class="item.isActive ? 'dark:text-primary-400 text-primary-500' : ' hover:text-theme-100'"
                  @click="handleItemClick({ item, event: $event })"
                >
                  <span class="relative group inline-flex gap-x-2 items-center">
                    <span v-if="item.icon" :class="getIcon(item.icon)" />
                    <span v-html="item.name" />
                    <span v-if="item.items" class="i-tabler-chevron-down opacity-50 transition-all" :class="item.name === activeSubNav ? 'rotate-180' : ''" />
                    <span v-else class="origin-left scale-x-0 group-hover:scale-x-100 transition-all border-b-2 dark:border-theme-600 w-full absolute bottom-0 left-0" />
                  </span>
                </component>
                <div v-if="item.items && item.name === activeSubNav" class="space-y-6">
                  <div v-for="(subItem, ii) in item.items" :key="ii" class="flex flex-col gap-2 pl-4">
                    <component
                      :is="getNavComponentType(subItem)"
                      :to="subItem.href"
                      :href="subItem.href"
                      role="menuitem"
                      class="x-action-item font-sans text-xl font-medium text-theme-500 dark:text-theme-400"
                      :class="item.isActive ? 'dark:text-primary-400 text-primary-500' : ' hover:text-theme-100'"
                      @click="subItem.onClick ? subItem.onClick($event) : null"
                    >
                      <span class="relative group inline-flex gap-x-2 items-center">
                        <span v-if="subItem.icon" :class="getIcon(subItem.icon)" />
                        <span v-html="subItem.name" />
                        <span class=" origin-left scale-x-0 group-hover:scale-x-100 transition-all border-b-2 border-theme-0 w-full absolute bottom-0 left-0" />
                      </span>
                    </component>
                    <div v-if="subItem.items" class="space-y-1">
                      <div v-for="(subSubItem, iii) in subItem.items" :key="iii" class="pl-4">
                        <component
                          :is="getNavComponentType(subSubItem)"
                          :to="subSubItem.href"
                          :href="subSubItem.href"
                          role="menuitem"
                          class="x-action-item font-sans text-base font-medium  hover:text-theme-100"
                          :class="item.isActive ? 'dark:text-primary-400 text-primary-500' : ' hover:text-theme-100'"
                          @click="subSubItem.onClick ? subSubItem.onClick($event) : null"
                        >
                          <span class="relative group inline-flex gap-x-2 items-center">
                            <span v-if="subSubItem.icon" :class="getIcon(subSubItem.icon)" />
                            <span v-html="subSubItem.name" />
                            <span class=" origin-left scale-x-0 group-hover:scale-x-100 transition-all border-b-2 border-theme-0 w-full absolute bottom-0 left-0" />
                          </span>
                        </component>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <slot name="foot" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="less">
  .close{

.close-line{
  animation-duration: .4s;
  animation-timing-function: cubic-bezier(.52,.01,.16,1);
  animation-fill-mode: forwards;
}

.close-line1{
  transform: translateY(30px) translateX(-30px) rotate(45deg);
  animation-name: crossRight;
  animation-delay: .15s;
}
.close-line2{
  transform: translateY(-30px) translateX(-30px) rotate(-45deg);
  animation-name: crossLeft;
  animation-delay: .45s;
}

}
@keyframes crossRight {
  100% {
    transform: translateY(0) translateX(0) rotate(45deg);
  }
}

@keyframes crossLeft {
  100% {
    transform:translateY(0) translateX(0) rotate(-45deg);
  }
}
</style>
