<script lang="ts" setup>
import { onResetUi, resetUi, vue } from '@factor/api'
import type { RenderImage } from '../plugin-models/model'
import ElImage from './ElImage.vue'

const props = defineProps({
  images: {
    type: Array as vue.PropType<RenderImage[]>,
    default: () => [],
  },
  selected: { type: Number, default: -1 },
})
const emit = defineEmits<{
  (event: 'update:selected', payload: number): void
  (event: 'close', payload: boolean): void
}>()

const vis = vue.computed(() => props.selected > -1)

function close(): void {
  emit('update:selected', -1)
  emit('close', true)
}
onResetUi(({ scope }) => {
  if (scope !== 'inputs')
    close()
})

function nav(direction: 'next' | 'prev'): void {
  const { selected, images } = props
  const len = images.length
  const next = direction === 'next' ? selected + 1 : selected - 1
  const nextIndex = next < 0 ? len - 1 : next >= len ? 0 : next
  emit('update:selected', nextIndex)
}

const classes = [
  'relative',
  'rounded-xl',
  'shadow-xl',
  'text-left',
  'transform',
  'transition-all',
  'my-6',
  'overflow-hidden',
]
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <teleport to="body">
    <div
      class="relative z-30"
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
          class="fixed inset-0 bg-slate-800/75 backdrop-blur-md transition-opacity"
        />
      </transition>
      <div class="fixed inset-0 z-40 overflow-y-auto" @click.stop="close()">
        <transition name="fade">
          <div v-if="vis">
            <div
              class="next absolute right-8 top-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-black/60 text-center text-white hover:bg-black/80"
              @click.stop="nav('next')"
            >
              <div class="i-carbon-arrow-right text-4xl" />
            </div>
            <div
              class="next absolute left-8 top-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-black/60 text-center text-white hover:bg-black/80"
              @click.stop="nav('prev')"
            >
              <div class="i-carbon-arrow-left text-4xl" />
            </div>
          </div>
        </transition>
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <transition
            enter-active-class="ease-out duration-400"
            enter-from-class="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-75"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-75"
          >
            <div
              v-if="vis"
              key="modal"
              :class="classes"
              @click.stop="resetUi({ scope: 'inputs', cause: `modalClick` })"
            >
              <ElImage
                class="4xl:col-span-4 col-span-6"
                :image="props.images[props.selected]"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </teleport>
</template>
