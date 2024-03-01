<script lang="ts">
import { emitEvent, onEvent, storeItem, stored, urlPath } from '@factor/api'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { FrameMessage } from '@kaption/types'
import ElemButton from '../@apps/dashboard/src/el/ElemButton.vue'
import ElemProgressBar from '../@apps/dashboard/src/el/ElemProgressBar.vue'
import ElemIframe from '../@apps/dashboard/src/el/ElemIframe.vue'
import { activeProjectDomain } from '../@apps/dashboard/src/tools/site'

export default {
  components: {
    ElemButton,
    ElemIframe,
    ElemProgressBar,
  },
  props: {},
  emits: ['load'],
  setup(props, { emit }) {
    const router = useRouter()
    // signal when iframe is loading
    const fetching = ref(true)
    // the iFrame el
    const frame = ref<HTMLIFrameElement>()

    // runs when iframe load event fires
    const frameLoaded = ({
      src,
    }: {
      src: string
      frameEl: HTMLFrameElement
    }) => {
      fetching.value = false
      emit('load', { src })
    }

    const standardPath = (v: string): string => {
      return v === '/' ? '/' : v.replace(/\/$/, '')
    }

    // ensure the pathname has the correct format
    const updatePath = (v: string) => {
      const q = router.currentRoute.value.query

      const query = { ...q }

      if (!v) {
        delete query['f.pathname']
      }
      else {
        const filterPath = standardPath(v)
        query['f.pathname'] = filterPath
      }
      router.push({ query })
    }

    const pathname = computed(() => {
      const q = router.currentRoute.value.query
      return q['f.pathname']
        ? decodeURIComponent(q['f.pathname'] as string)
        : ''
    })

    // keep track for back/forward buttons

    if (!stored('frameNav'))
      storeItem('frameNav', { paths: [pathname.value], pointer: 0 })

    const activeHistory = computed((): { paths: string[], pointer: number } => {
      return (
        stored<{ paths: string[], pointer: number }>('frameNav') ?? {
          paths: [],
          pointer: 0,
        }
      )
    })

    const device = computed(() => {
      const q = router.currentRoute.value.query
      return q['f.deviceType']
        ? decodeURIComponent(q['f.deviceType'] as string)
        : ''
    })

    const screenWidth = computed((): string => {
      if (device.value === 'phone')
        return 'w-108'
      else if (device.value === 'tablet')
        return 'max-w-screen-md'
      else if (device.value === 'laptop')
        return 'max-w-screen-xl'
      else
        return 'w-full'
    })

    const typedPath = ref()
    // set path is the actual rendered path in the iframe
    const setPath = ref(pathname.value)
    watch(
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
    const frameUrl = computed<string>(() => {
      if (!pathname.value || !activeProjectDomain.value)
        return ''

      return urlPath(activeProjectDomain.value, pathname.value)
    })

    // pointer for back/forward array. Resets on manual nav (not back/forward)
    const navPointer = ref(0)

    /**
     * Sets a new path/url for the iFrame
     * @history means that nav history is being used to navigate so dont reset the pointer
     */
    const setNewPath = ({
      history,
      newPath,
    }: {
      history?: boolean
      newPath: string
    }) => {
      const np = standardPath(newPath)
      if (np !== pathname.value) {
        updatePath(newPath)
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

    onEvent('setFramePath', args => setNewPath(args))

    // navigate iframe like browser
    const navigateFrame = (dir: 'forward' | 'backward'): void => {
      const navs = activeHistory.value
      if (!navs)
        return

      let newPointer = navs.pointer
      if (dir === 'forward' && navs.pointer > 0)
        newPointer = navs.pointer - 1
      else if (navs.pointer < navs.paths.length - 1)
        newPointer = navs.pointer + 1

      setNewPath({
        history: true,
        newPath: navs.paths[newPointer],
      })

      storeItem('frameNav', { paths: navs.paths, pointer: newPointer })
    }

    const handlePostMessage = (msg: FrameMessage): void => {
      const { messageType, data } = msg
      if (messageType === 'navigate' && data) {
        const url = new URL(data as string)

        setNewPath({ newPath: url.pathname })
      }
    }

    return {
      screenWidth,
      handlePostMessage,
      frameLoaded,
      setNewPath,
      frame,
      fetching,
      activeProjectDomain,
      frameUrl,
      navPointer,
      activeHistory,
      navigateFrame,
      emitEvent,
      updatePath,
      typedPath,
      pathname,
    }
  },
}
</script>

<template>
  <div class="flex-grow overflow-hidden">
    <div class="flex items-center justify-between pt-2 pb-6 px-4">
      <div class="w-full items-center justify-center lg:flex lg:space-x-3">
        <div
          class="hidden lg:flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 cursor-pointer"
          :class="
            navPointer === activeHistory.paths.length
              ? 'cursor-not-allowed opacity-50'
              : ''
          "
          @click="navigateFrame('backward')"
        >
          <svg
            class="h-4 w-4 text-gray-500"
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
          class="hidden lg:flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 cursor-pointer"
          :class="
            activeHistory.pointer === 0 ? 'cursor-not-allowed opacity-50' : ''
          "
          @click="navigateFrame('forward')"
        >
          <svg
            class="h-4 w-4 text-gray-500"
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
        <div class="flex flex-grow rounded-md shadow-sm lg:ml-4">
          <span
            class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-gray-50 text-slate-500 sm:text-sm select-none"
            :title="frameUrl"
          >
            https://{{ activeProjectDomain }}
          </span>
          <input
            v-model="typedPath"
            type="text"
            class="flex-1 block w-full focus:ring-primary-500 focus:border-primary-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-slate-200"
            @keyup.enter="setNewPath({ newPath: typedPath })"
          >
        </div>
      </div>
      <div class="hidden lg:block flex-shrink-0 ml-4">
        <ElemButton btn="primary" @click="setNewPath({ newPath: typedPath })">
          Go &rarr;
        </ElemButton>
      </div>
      <slot name="browserBar" />
    </div>

    <div class="">
      <div
        class="relative flex embed-responsive aspect-ratio-screen bg-white m-auto shadow-xl"
        :class="screenWidth"
      >
        <div
          id="frameArea"
          class="resize-iframe flex-grow-0 h-full absolute top-0 bottom-0 w-full"
        >
          <div v-if="!frameUrl">
            <slot name="zeroState" />
          </div>
          <div
            v-else-if="fetching"
            class="absolute w-full pt-32 flex justify-center"
          >
            <ElemProgressBar
              :text="`Loading Your Website (${pathname})`"
              class="h-36"
            />
          </div>

          <div
            id="frameContainer"
            class="relative h-full w-full transition-all"
            :class="fetching ? 'opacity-40' : ''"
          >
            <ElemIframe
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
