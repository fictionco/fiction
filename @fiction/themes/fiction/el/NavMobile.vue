<script lang="ts" setup>
import { getNavComponentType, onBrowserEvent, onResetUi, shortId, useService, vue } from '@fiction/core'
import type { NavItem } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import type { UserConfig } from './ElHeader.vue'

const props = defineProps({
  vis: { type: Boolean, default: false },
  accountMenu: { type: Array as vue.PropType<NavItem[]>, required: true },
  nav: { type: Array as vue.PropType<NavItem[]>, required: true },
})

const emit = defineEmits(['update:vis'])

const { fictionUser } = useService()

const randomId = shortId()
const afterVisible = vue.ref(false)
const scrolled = vue.ref(false)

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

function close(): void {
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
        el.style.transform = 'translateX(-350px)'
        el.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
        el.style.height = '100vh'
        el.style.overflow = 'hidden'

        setTimeout(() => (afterVisible.value = true), 300)
      }
      else {
        afterVisible.value = false
        el.style.transform = 'none'
        el.style.height = 'auto'
        el.style.overflow = 'auto'
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
</script>

<template>
  <teleport to=".x-site">
    <div v-if="vis" :id="randomId" class="z-0 fixed h-[100dvh] top-0 right-0 w-[320px]" @update:vis="emit('update:vis', $event)" @click.stop>
      <a class="close absolute block right-10 top-10 z-10 cursor-pointer hover:scale-110" :class="!vis ? 'out' : ''" @click="close()">
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]  rounded-full transition-all " />
        <span class="close-wrap overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] absolute">
          <span class="close-line close-line1 h-full w-[2px] dark:bg-theme-0 absolute rounded-[5px] left-[13px] transition-all" />
          <span class="close-line close-line2 h-full w-[2px] dark:bg-theme-0 absolute rounded-[5px] left-[13px] transition-all" />
        </span>
      </a>

      <div class="h-full overflow-y-scroll p-6 flex flex-col justify-center">
        <div class="pb-3 text-sm   space-x-6 items-center justify-between mb-4 hidden">
          <div>
            <p v-if="fictionUser.activeUser.value" class="truncate text-lg font-bold">
              {{ fictionUser.activeUser.value?.fullName || fictionUser.activeUser.value?.email }}
            </p>
            <div class="mt-1 flex text-xs space-x-4">
              <ElButton
                v-for="(item, i) in accountMenu"
                :key="i"
                :to="item.href"
                :href="item.href"
                class="space-x-1"
                size="sm"
                @click="item.onClick ? item.onClick($event) : null"
              >
                <span v-html="item.name" />
              </ElButton>
            </div>
          </div>
          <div v-if="fictionUser.activeUser.value">
            <ElAvatar class="h-9 w-9 rounded-full" :email="fictionUser?.activeUser.value?.email" />
          </div>
        </div>
        <div
          class="flex flex-col gap-6"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="main-menu"
        >
          <component
            :is="getNavComponentType(item)"
            v-for="(item, i) in nav"
            :key="i"
            :to="item.href"
            :href="item.href"
            role="menuitem"
            class="x-action-item font-sans antialiased text-4xl font-medium hover:text-primary-700 dark:hover:text-primary-100"
            :class="item.isActive ? '' : ''"
            @click="item.onClick ? item.onClick($event) : null"
          >
            <span class="relative group">
              <span v-html="item.name" />
              <span class=" origin-left scale-x-0 group-hover:scale-x-100 transition-all border-b-2 border-theme-0 w-full absolute bottom-0 left-0" />
            </span>
          </component>
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
