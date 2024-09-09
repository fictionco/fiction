<script lang="ts" setup>
import { onResetUi, vue, waitFor } from '@fiction/core'
import type { PostObject } from '@fiction/core'
import AnimClipPath from '../anim/AnimClipPath.vue'
import { PopupUtility } from '../anim/popupUtil'
import ElClose from '../common/ElClose.vue'
import XMedia from './XMedia.vue'

const props = defineProps<{
  items?: PostObject[]
  activeIndex?: number
}>()

const emit = defineEmits<{
  (event: 'update:activeIndex', payload: number): void
}>()
const popupUtil = new PopupUtility()
const isActive = vue.computed(() => props.activeIndex !== undefined && props.activeIndex >= 0)
const ind = vue.computed(() => props.activeIndex ?? -1)
const activeItem = vue.computed(() => isActive.value ? props.items?.[ind.value] : undefined)
const lightboxRef = vue.ref<HTMLElement | null>(null)
const animatedDivRef = vue.ref<HTMLElement | null>(null)
const contentRef = vue.ref<HTMLElement | null>(null)
const mediaRef = vue.ref<HTMLElement | null>(null)
function close() {
  emit('update:activeIndex', -1)
  popupUtil.deactivate()
}

const afterVisible = vue.ref(false)
const cleanups = [] as (() => void)[]
vue.onMounted(async () => {
  const c = vue.watch(
    () => activeItem.value,
    (vis) => {
      if (vis) {
        popupUtil.activate()

        setTimeout(() => (afterVisible.value = true), 300)
      }
      else {
        afterVisible.value = false
        popupUtil.deactivate()
      }
    },
    { immediate: true },

  )

  cleanups.push(c)

  await waitFor(50)
  onResetUi(() => close())
})

vue.onUnmounted(() => {
  cleanups.forEach(c => c())
})

function nextItem() {
  if (props.items && isActive) {
    const nextIndex = ind.value + 1
    const nextIndexClamped = nextIndex + 1 > props.items.length ? 0 : nextIndex
    emit('update:activeIndex', nextIndexClamped)
  }
}

function previousItem() {
  if (props.items && isActive) {
    const previousIndex = ind.value - 1
    const previousIndexClamped = previousIndex < 0 ? props.items.length - 1 : previousIndex
    emit('update:activeIndex', previousIndexClamped)
  }
}
</script>

<template>
  <teleport to=".x-site">
    <transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="ease-in duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <div
        v-if="activeItem"
        ref="lightboxRef"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90"
        @click="close"
      >
        <!-- Next and Previous buttons -->
        <ElClose class="absolute right-2 top-2 z-40" />

        <AnimClipPath animate="expand">
          <div ref="animatedDivRef" class="relative  h-[80vh] w-[90vw] md:w-[80dvw] flex flex-col gap-6 overflow-hidden rounded-xl">
            <div class="grow relative" @click.stop>
              <XMedia ref="mediaRef" class="absolute inset-0" :media="activeItem.media" image-mode="contain" />
              <div v-if="items && items.length > 1" class="absolute inset-y-0 left-0 flex items-center mix-blend-difference">
                <button class=" text-white/70 p-2 md:p-4 rounded-r hover:text-white" @click.stop="previousItem">
                  <div class="i-tabler-chevron-left text-3xl" />
                </button>
              </div>
              <div v-if="items && items.length > 1" class="absolute inset-y-0 right-0 flex items-center mix-blend-difference">
                <button class=" text-white/70 p-2 md:p-4 rounded-l hover:text-white" @click.stop="nextItem">
                  <div class="i-tabler-chevron-right text-3xl" />
                </button>
              </div>
            </div>

            <div ref="contentRef" class=" space-y-2 text-white md:p-8 max-w-screen-sm mx-auto" @click.stop>
              <h3 class="text-xl font-semibold x-font-title">
                {{ activeItem?.title }}
              </h3>
              <p class="text-theme-200  ">
                {{ activeItem?.content }}
              </p>
            </div>
          </div>
        </AnimClipPath>
      </div>
    </transition>
  </teleport>
</template>
