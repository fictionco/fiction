<script lang="ts" setup>
import { onResetUi, resetUi, vue } from '@fiction/core'

const props = defineProps({
  vis: { type: Boolean, default: false },
  title: { type: String, default: '' },
  sub: { type: String, default: '' },
  modalClass: { type: String, default: undefined },
  styleClass: { type: String, default: undefined },
  fullScreen: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis', 'close', 'escape'])
function close(args: { reason: 'escape' | 'reset' }): void {
  const { reason } = args
  emit('update:vis', false)
  emit('close', true)
  if (reason === 'escape')
    emit('escape', true)
}
onResetUi(({ scope }) => {
  if (scope !== 'inputs' && props.vis)
    close({ reason: 'reset' })
})

const cls = props.modalClass ? [props.modalClass] : ['p-12', 'sm:max-w-sm']
const styleClass = props.styleClass ? [props.styleClass] : ['bg-white text-theme-900 dark:bg-theme-900 dark:text-theme-0', 'shadow-xl']

if (props.fullScreen)
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
  ...styleClass,
]

const afterVisible = vue.ref(false)
vue.onMounted(() => {
  const el = document.querySelector('.x-site-content') as HTMLElement | null

  vue.watch(
    () => props.vis,
    (vis) => {
      if (!el)
        return

      if (vis) {
        el.style.transform = 'scale(.95)'
        el.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
        el.style.overflow = 'hidden'
        el.style.height = '100dvh'

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
          class="fixed inset-0 bg-theme-800/65 active:bg-theme-800/80 cursor-pointer dark:bg-slate-500/40 backdrop-blur-sm transition-opacity"
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
          <transition
            enter-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500"
            enter-from-class="opacity-0 scale-75"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-500"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 scale-75"
          >
            <div
              v-if="vis"
              :class="classes"
              class="click-stop"
              @click.stop="resetUi({ scope: 'inputs', cause: `modalClick` })"
            >
              <slot />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </teleport>
</template>
