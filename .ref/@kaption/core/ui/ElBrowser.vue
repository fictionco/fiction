<script lang="ts" setup>
import {
  emitEvent,
  onResetUi,
  resetUi,
  storeItem,
  stored,
  urlPath,
  vue,
} from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { useKaption } from '../utils'
import ElButton from './ElButton.vue'
import type { FrameMessage, FrameUtility } from './elBrowserFrameUtil'
import ElBrowserFrame from './ElBrowserFrame.vue'
import ElZeroState from './ElZeroState.vue'

const props = defineProps({
  pathname: { type: String, default: '' },
  origins: { type: Array as vue.PropType<string[]>, required: true },
})
const emit = defineEmits(['load'])
const { factorRouter } = useKaption()
const origin = vue.computed(() => {
  const q = factorRouter.router.currentRoute.value.query
  return q['f.origin']
    ? decodeURIComponent(q['f.origin'] as string)
    : props.origins?.[0]
})
const pathname = vue.computed(() => {
  const q = factorRouter.router.currentRoute.value.query
  return q['f.pathname'] ? decodeURIComponent(q['f.pathname'] as string) : ''
})

const active = vue.ref(false)

// signal when iframe is loading
const fetching = vue.ref(true)
// the iFrame el
// const frame = ref<HTMLIFrameElement>()

// runs when iframe load event fires
function frameLoaded(util: FrameUtility): void {
  fetching.value = false
  emit('load', util)
}

function standardPath(v: string): string {
  return v === '/' ? '/' : v.replace(/\/$/, '')
}

// ensure the pathname has the correct format
async function updatePath(part: 'pathname' | 'origin', v: string): Promise<void> {
  const q = factorRouter.router.currentRoute.value.query

  const query = { ...q }

  const filterName = `f.${part}`

  if (v) {
    const filterPath = standardPath(v)
    query[filterName] = encodeURIComponent(filterPath)
    // if changing origin change pathname to root
    if (part === 'origin')
      query[`f.pathname`] = encodeURIComponent('/')
  }
  else {
    delete query[filterName]
  }
  await factorRouter.push({ query })

  resetUi({ scope: 'all', cause: 'updatePath' })
}

// keep track for back/forward buttons

if (!stored('frameNav'))
  storeItem('frameNav', { paths: [pathname.value], pointer: 0 })

const activeHistory = vue.computed((): { paths: string[], pointer: number } => {
  return (
    stored<{ paths: string[], pointer: number }>('frameNav') ?? {
      paths: [],
      pointer: 0,
    }
  )
})

const device = vue.computed(() => {
  const q = factorRouter.router.currentRoute.value.query
  return q['f.deviceType']
    ? decodeURIComponent(q['f.deviceType'] as string)
    : ''
})

const heatmapWidth = vue.computed((): string => {
  if (device.value === 'phone')
    return 'w-[27rem]'
  else if (device.value === 'tablet')
    return 'max-w-screen-md'
  else if (device.value === 'laptop')
    return 'max-w-screen-xl'
  else
    return 'w-full'
})

const typedPath = vue.ref()
// set path is the actual rendered path in the iframe
const setPath = vue.ref(pathname.value)
vue.watch(
  () => pathname.value,
  (v) => {
    typedPath.value = v
    if (v !== setPath.value) {
      fetching.value = true
      setPath.value = v
      // ensure computeds update
      setTimeout(() => emitEvent('setFrames'), 50)
    }
  },
  { immediate: true },
)

// the desired url rendered in the iframe
// note this will be changed/proxied and a modified url will be actually used
const frameUrl = vue.computed<string>(() => {
  if (!origin.value || !pathname.value)
    return ''

  const url = urlPath(origin.value, pathname.value)

  return url
})

// pointer for back/forward array. Resets on manual nav (not back/forward)
const navPointer = vue.ref(0)

/**
 * Sets a new path/url for the iFrame
 * @history means that nav history is being used to navigate so dont reset the pointer
 */
async function setNewPath({
  history,
  newPath,
}: {
  history?: boolean
  newPath: string
}): Promise<void> {
  const np = standardPath(newPath)
  if (np !== pathname.value) {
    await updatePath('pathname', newPath)
    if (!history) {
      const navigations = activeHistory.value

      const paths = navigations?.paths ?? []
      const pointer = navigations?.pointer ?? 0
      const newPaths = paths.slice(pointer)

      newPaths.unshift(np)
      storeItem('frameNav', { paths: newPaths, pointer: 0 })
    }
  }
}

// navigate iframe like browser
async function navigateFrame(dir: 'forward' | 'backward'): Promise<void> {
  const navs = activeHistory.value
  if (!navs)
    return

  let newPointer = navs.pointer
  if (dir === 'forward' && navs.pointer > 0)
    newPointer = navs.pointer - 1
  else if (navs.pointer < navs.paths.length - 1)
    newPointer = navs.pointer + 1

  await setNewPath({
    history: true,
    newPath: navs.paths[newPointer],
  })

  storeItem('frameNav', { paths: navs.paths, pointer: newPointer })
}

async function handlePostMessage(msg: FrameMessage): Promise<void> {
  const { messageType, data } = msg
  if (messageType === 'navigate' && data) {
    const url = new URL(data as string)

    await setNewPath({ newPath: url.pathname })
  }
}

function showOriginSelect() {
  active.value = true
}

onResetUi(() => {
  active.value = false
})
</script>

<template>
  <div class="grow overflow-hidden">
    <div class="flex items-center justify-between px-4 pt-2 pb-6">
      <div class="w-full items-center justify-center lg:flex lg:space-x-3">
        <div
          class="hover:bg-theme-100 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full lg:flex"
          :class="
            navPointer === activeHistory.paths.length
              ? 'cursor-not-allowed opacity-50'
              : ''
          "
          @click="navigateFrame('backward')"
        >
          <svg
            class="text-theme-400 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        <div
          class="hover:bg-theme-100 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full lg:flex"
          :class="
            activeHistory.pointer === 0 ? 'cursor-not-allowed opacity-50' : ''
          "
          @click="navigateFrame('forward')"
        >
          <svg
            class="text-theme-500 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
        <div class="relative flex grow rounded-md shadow-sm lg:ml-4">
          <span
            class="bg-theme-100 text-theme-500 hover:bg-theme-200 inline-flex cursor-pointer select-none items-center rounded-l-md border border-r-0 border-slate-300 px-4 font-semibold sm:text-sm"
            :title="frameUrl"
            @click.stop="showOriginSelect()"
          >
            <span>{{ origin }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
          <input
            v-model="typedPath"
            type="text"
            class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-slate-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            @keyup.enter="setNewPath({ newPath: typedPath })"
          >
          <transition
            enter-active-class="transition ease-out duration-150"
            enter-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="active"
              class="absolute left-0 top-full z-50 mt-2 w-screen max-w-full origin-top-left rounded-md bg-white shadow-real ring-1 ring-black/5 lg:max-w-xs"
            >
              <div
                class="select-none overflow-auto rounded-md shadow focus:outline-none"
              >
                <div class="sel">
                  <nav
                    class="flex flex-col justify-start overflow-x-hidden overflow-y-scroll py-2 md:justify-center"
                  >
                    <a
                      v-for="(item, i) in origins"
                      :key="i"
                      class="group flex cursor-pointer flex-col items-baseline justify-between px-4 py-2 text-base font-normal hover:bg-primary-500 hover:text-white lg:flex-row lg:text-sm"
                      @click="updatePath('origin', item)"
                    >
                      <div class="whitespace-nowrap font-semibold">
                        {{ item }}
                      </div>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="ml-4 hidden shrink-0 lg:block">
        <ElButton btn="primary" @click="setNewPath({ newPath: typedPath })">
          Go &rarr;
        </ElButton>
      </div>
      <slot name="browserBar" />
    </div>

    <div class="">
      <div
        class="embed-responsive relative m-auto flex w-full bg-white shadow-xl"
        :class="heatmapWidth"
        :style="{ 'padding-top': '125%' }"
      >
        <div
          id="frameArea"
          class="resize-iframe absolute inset-y-0 h-full w-full grow-0"
        >
          <div v-if="!frameUrl">
            <ElZeroState
              title="Load Website"
              note="Load your website by typing or filtering by path"
            >
              <template #action>
                <ElButton btn="primary" @click="setNewPath({ newPath: '/' })">
                  Show Homepage &rarr;
                </ElButton>
              </template>
            </ElZeroState>
          </div>
          <div
            v-else-if="fetching"
            class="absolute flex w-full justify-center p-8"
          >
            <div class="bg-theme-800 rounded-full p-3 text-white opacity-80">
              <ElSpinner class="flex h-5 w-5 items-center justify-center" />
            </div>
          </div>

          <div
            v-show="frameUrl"
            id="frameContainer"
            class="relative h-full w-full transition-all"
            :class="[fetching ? 'opacity-80' : '']"
          >
            <ElBrowserFrame
              class="embed-responsive-item"
              :url="frameUrl"
              v-bind="$attrs"
              @load="frameLoaded($event)"
              @message="handlePostMessage($event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.embed-responsive {
  position: relative;
  display: block;
  height: 0;
  padding: 0;
  overflow: hidden;

  .embed-responsive-item,
  iframe,
  embed,
  object,
  video {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    border: 0;
  }
}
</style>
