<script lang="ts" setup>
import { getNavComponentType, onBrowserEvent, onResetUi, shortId, useService, vue } from '@fiction/core'
import type { NavItem } from '@fiction/core'
import { animateItemEnter, useElementVisible } from './anim'
import ElAvatar from './ElAvatar.vue'
import ElButton from './ElButton.vue'

const props = defineProps({
  vis: { type: Boolean, default: false },
  accountMenu: { type: Array as vue.PropType<NavItem[]>, default: () => [] },
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

// TODO
function getIcon(icon: string): string {
  return ``
}
</script>

<template>
  <teleport to=".x-site">
    <div v-if="vis" class="z-0 fixed h-[100dvh] top-0 right-0 w-full bg-theme-900 text-theme-0" @update:vis="emit('update:vis', $event)" @click.stop>
      <svg class="h-full text-theme-800 absolute inset-0" viewBox="0 0 8000 8000">
        <defs><pattern id="bg_pattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <line
            x1="0"
            y1="0"
            x2="10"
            y2="10"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
          <line
            x1="90"
            y1="90"
            x2="100"
            y2="100"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
          <line
            x1="10"
            y1="90"
            x2="0"
            y2="100"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
          <line
            x1="90"
            y1="10"
            x2="100"
            y2="0"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
          <line
            x1="40"
            y1="40"
            x2="60"
            y2="60"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
          <line
            x1="60"
            y1="40"
            x2="40"
            y2="60"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
        </pattern>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#bg_pattern)"
          opacity="1"
        />
      </svg>
      <div :id="randomId" class="w-[275px] h-full float-right">
        <a class="close absolute block right-10 top-10 z-10 cursor-pointer hover:scale-110" :class="!vis ? 'out' : ''" @click="close()">
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px]  rounded-full transition-all " />
          <span class="close-wrap overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[28px] absolute">
            <span class="close-line close-line1 h-full w-[2px] bg-theme-0 absolute rounded-[5px] left-[13px] transition-all" />
            <span class="close-line close-line2 h-full w-[2px] bg-theme-0 absolute rounded-[5px] left-[13px] transition-all" />
          </span>
        </a>

        <div class="h-full overflow-y-scroll p-6 flex flex-col justify-center">
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
              class="x-action-item font-sans antialiased text-3xl font-light hover:text-theme-100"
              :class="item.isActive ? '' : ''"
              @click="item.onClick ? item.onClick($event) : null"
            >
              <span class="relative group inline-flex gap-x-2 items-center">
                <span v-if="item.icon" :class="getIcon(item.icon)" />
                <span v-html="item.name" />
                <span class=" origin-left scale-x-0 group-hover:scale-x-100 transition-all border-b-2 border-theme-0 w-full absolute bottom-0 left-0" />
              </span>
            </component>
          </div>
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
