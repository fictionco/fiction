<script lang="ts" setup>
import { onResetUi, resetUi, vue, waitFor } from '@fiction/core'
import { popupUtil } from './anim/popupUtil'
import ElClose from './common/ElClose.vue'

defineOptions({ name: 'ElModal' })

const {
  vis = false,
  modalClass,
  styleClass,
  fullScreen = false,
  hasClose = false,
  title = '',
  transitionMode = 'modal',
} = defineProps<{
  vis?: boolean
  modalClass?: string
  styleClass?: string
  fullScreen?: boolean
  hasClose?: boolean
  title?: string
  transitionMode?: 'modal' | 'slideUp'
}>()

const emit = defineEmits(['update:vis', 'close', 'escape'])
function close(args: { reason: 'escape' | 'reset' }): void {
  const { reason } = args
  emit('update:vis', false)
  emit('close', true)
  if (reason === 'escape')
    emit('escape', true)
}

const cls = modalClass ? [modalClass] : ['max-w-screen-md p-24']
const defaultStyleClass = styleClass ? [styleClass] : ['bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-0', 'shadow-xl']

if (fullScreen)
  cls.push('fixed inset-0')
else
  cls.push('rounded-xl my-6 mx-3')

const classes = [
  'relative',
  'text-left',
  'transform',
  'transition-all',
  'w-full',
  ...cls,
  ...defaultStyleClass,
]

const afterVisible = vue.ref(false)
const cleanups = [] as (() => void)[]
vue.onMounted(async () => {
  const unwatch = vue.watch(
    () => vis,
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

  cleanups.push(() => {
    unwatch()
    popupUtil.deactivate()
  })

  await waitFor(50)
  onResetUi((args) => {
    if (args.scope === 'all' && vis)
      close({ reason: 'reset' })
  })
})

vue.onUnmounted(() => {
  cleanups.forEach(c => c())
})

const modalTransition = vue.computed(() => {
  if (transitionMode === 'slideUp') {
    return {
      enterActiveClass: 'ease-[cubic-bezier(0.25,1,0.33,1)] duration-500',
      enterFromClass: 'opacity-0 translate-y-full scale-95',
      enterToClass: 'opacity-100 translate-y-0 scale-100',
      leaveActiveClass: 'ease-[cubic-bezier(0.25,1,0.33,1)] duration-500',
      leaveFromClass: 'opacity-100 translate-y-0 scale-100',
      leaveToClass: 'opacity-0 translate-y-full scale-95',
    }
  }
  return {
    enterActiveClass: 'ease-[cubic-bezier(0.25,1,0.33,1)] duration-500',
    enterFromClass: 'opacity-0 scale-75',
    enterToClass: 'opacity-100 translate-y-0 scale-100',
    leaveActiveClass: 'ease-[cubic-bezier(0.25,1,0.33,1)] duration-500',
    leaveFromClass: 'opacity-100 translate-y-0 scale-100',
    leaveToClass: 'opacity-0 scale-75',
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <teleport to=".x-site">
    <div
      class="z-[35] top-0 absolute"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      :class="!vis ? 'pointer-events-none' : ''"
    >
      <transition
        enter-active-class="ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="vis"
          class="fixed inset-0 bg-theme-800/65 active:bg-theme-800/80 cursor-pointer dark:bg-theme-600/90 backdrop-blur-sm transition-opacity"
          @click="close({ reason: 'escape' })"
        />
      </transition>
      <div
        class=" fixed inset-0  z-40 overflow-y-auto"
        @click="close({ reason: 'escape' })"
      >
        <div
          class="flex min-h-full items-center justify-center text-center rotate-x"
        >
          <transition v-bind="modalTransition">
            <div
              v-if="vis"
              :class="classes"
              class="click-stop"
              @click.stop="resetUi({ scope: 'inputs', cause: `modalClick`, trigger: 'elementClick' })"
            >
              <div
                v-if="hasClose || title"
                class=""
                :class="!title && hasClose ? 'absolute top-0 right-0 z-10' : 'flex justify-between items-center border-b border-theme-200 dark:border-theme-700'"
              >
                <h2 v-if="title" class="text-xl x-font-title p-5">
                  {{ title }}
                </h2>
                <ElClose class="relative" data-test-id="close-modal" @click.stop="close({ reason: 'escape' })" />
              </div>
              <slot />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </teleport>
</template>
