<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil'
import type { Card } from '../card'
import type { Site } from '../site'
import type { FramePostMessageList } from '../utils/frame'
import { fastHash, toLabel, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XText from '@fiction/ui/common/XText.vue'
import EffectDraggableSort from '@fiction/ui/effect/EffectDraggableSort.vue'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
})

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility<FramePostMessageList> }>() // Reference to the child component

type DeviceModeKeys = 'desktop' | 'mobile' | 'tablet' | 'landscape'
const activeDeviceModeKey = vue.ref<DeviceMode>('desktop')
const deviceModes: (NavListItem & { wrapClass: string, value: DeviceModeKeys })[] = [
  { value: 'desktop', icon: { class: 'i-tabler-device-desktop' }, wrapClass: 'w-full' },
  { value: 'mobile', icon: { class: 'i-tabler-device-mobile' }, wrapClass: 'w-[60%] max-w-sm' },
  { value: 'tablet', icon: { class: 'i-tabler-device-ipad' }, wrapClass: 'w-[85%] max-w-xl' },
  { value: 'landscape', icon: { class: 'i-tabler-device-ipad-horizontal' }, wrapClass: 'w-[90%] max-w-2xl' },
]

const activeDeviceMode = vue.computed(() => deviceModes.find(mode => mode.value === activeDeviceModeKey.value) || deviceModes[0])

type DeviceMode = typeof deviceModes[number]['value']

const deviceModeConfig = vue.computed(() => deviceModes.find(mode => mode.value === activeDeviceModeKey.value))

// Watch for changes in frameRef and assign frameUtility
vue.watch(
  frameRef,
  (newValue) => {
    if (newValue && props.site)
      props.site.frame.setUtil(newValue.frameUtility)
  },
  { immediate: true },
)

// Page grid view state
// const showPageGrid = vue.computed({
//   get: () => !props.site?.editor.value.selectedPageId,
//   set: (value) => {
//     if (props.site)
//       props.site.editor.value.selectedPageId = value ? '' : props.site?.activePageId.value
//   },
// })

const maxGridPages = 16 // Limit to prevent performance issues

// Computed array of all site pages, limited to maxGridPages
// Filter out system pages that start with __ and prioritize home page
const sitePages = vue.computed(() => {
  if (!props.site)
    return []

  // Filter pages and sort to put home page first
  const filteredPages = props.site.pages.value
    .filter(page => !page.slug.value?.startsWith('__') && !page.isSystem.value)
    .sort((a, b) => {
      return a.isHome.value ? -1 : b.isHome.value ? 1 : 0
    })
    .slice(0, maxGridPages)

  return filteredPages
})

// Method to select and navigate to a page
async function selectPage(cardId: string) {
  if (!props.site || !cardId)
    return

  // Close grid view
  props.site.editingPageId.value = cardId
  activeDeviceModeKey.value = 'desktop'
}

// Method to check if page is current active page
function isActivePage(cardId: string) {
  return props.site?.activePageId.value === cardId
}

// Helper method to get appropriate badge for special pages
function getPageBadge(page: Card) {
  if (page.isHome.value)
    return { label: 'Home', class: 'bg-emerald-500' }
  if (page.slug.value === '_post')
    return { label: 'Post', class: 'bg-blue-500' }
  if (page.slug.value === '_archive')
    return { label: 'Archive', class: 'bg-purple-500' }
  return null
}

const currentPage = vue.computed(() => props.site?.currentPage.value)
const currentPageStandard = vue.computed(() => currentPage.value?.userConfig.value.standard)
const isHome = vue.computed(() => currentPage.value?.isHome.value)

// Function to handle page order updates
function handlePageOrderUpdate(ids: string[]) {
  if (!props.site || !ids.length)
    return

  // Update the order in site navigation structure
  const orderedPages = ids.map(id =>
    props.site!.pages.value.find(page => page.cardId === id),
  ).filter(Boolean)

  // Apply the ordering to navigation
  if (props.site.userConfig && orderedPages.length) {
    // Get current navigation from site config or initialize if not exists
    const navConfig = props.site.userConfig.value.navigation || {}

    // Preserve existing items that aren't pages (like external links or sections)
    // and filter out pages that will be reordered
    const existingPrimaryNav = (navConfig.primary || []).filter(item =>
      !item.cardId || !ids.includes(item.cardId),
    )

    // Create updated nav items based on the new order
    const updatedPageNavItems = orderedPages.map(page => ({
      label: page?.title.value || toLabel(page?.slug.value || ''),
      href: page?.slug.value === '_home' ? '/' : `/${page?.slug.value}`,
      cardId: page?.cardId,
      // Add any other necessary navigation properties
      icon: undefined,
      iconAfter: undefined,
      target: '_self' as const,
      variant: 'default' as const,
    }))

    // Combine existing items with new ordered page items
    const updatedPrimaryNav = [...updatedPageNavItems, ...existingPrimaryNav]

    // Update the navigation in site config
    props.site.userConfig.value = {
      ...props.site.userConfig.value,
      navigation: {
        ...navConfig,
        primary: updatedPrimaryNav,
      },
    }

    // Sync changes
    props.site.syncChange({ caller: 'updatePageOrder' })

    // Show success notification
    props.site.fictionSites.fictionEnv.events.emit('notify', {
      type: 'success',
      message: 'Page order updated',
      more: 'Navigation updated with the new page order',
    })
  }
}
</script>

<template>
  <div v-if="site" class="space-y-4 p-4 xl:p-6 @container bg-theme-800">
    <div v-if="!site.editingPageId.value" class="flex gap-2 items-baseline">
      <div class="font-semibold">
        All Pages
      </div>
      <div class="font-mono text-sm text-theme-500 dark:text-theme-400 flex items-center gap-1">
        Drag to reorder • Click to Edit
      </div>
    </div>
    <div
      v-else-if="site"
      class="flex justify-between space-x-2"
    >
      <div class="flex items-center gap-3">
        <XButton
          size="sm"
          rounding="md"
          design="ghost"
          icon="i-tabler-files"
          @click.stop="site.editingPageId.value = ''"
        >
          Edit / Add Pages
        </XButton>
        <XButton
          size="sm"
          rounding="md"
          design="ghost"
          icon="i-tabler-pencil"
          @click.stop="site.editorActivateTool({ toolId: 'pageEdit' })"
        >
          Edit Page: {{ currentPageStandard?.title || currentPage?.title.value || toLabel(currentPage?.slug.value) || 'Untitled' }}
        </XButton>
        <div class="flex items-center gap-2">
          <div class="font-mono text-sm text-theme-500 dark:text-theme-400 flex items-center gap-1">
            <XText
              :model-value="site.currentPath.value"
              title="Current Path"
              :is-editable="false"
              class="whitespace-nowrap "
            />
            <div v-if="isHome" class="text-xs ">
              (Home Page)
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <ElTooltip
          direction="bottom"
          content="Undo the last change"
        >
          <XButton
            rounding="md"
            icon="i-tabler-arrow-back"
            size="sm"
            design="ghost"
            :disabled="!site.history?.canUndo.value"
            respond="icon:xl"
            @click="site.history?.undo()"
          >
            Undo
          </XButton>
        </ElTooltip>
        <ElTooltip
          direction="bottom"
          content="Redo the last undo"
        >
          <XButton
            rounding="md"
            icon="i-tabler-arrow-forward"
            size="sm"
            design="ghost"
            :disabled="!site.history?.canRedo.value"
            respond="icon:xl"
            @click="site.history?.redo()"
          >
            Redo
          </XButton>
        </ElTooltip>

        <XDropDown
          v-model="activeDeviceModeKey"
          mode="click"
          :items="deviceModes"
          dropdown-alignment="end"
        >
          <XButton
            rounding="md"
            :icon="activeDeviceMode?.icon"
            size="sm"
            design="ghost"
            icon-after="i-tabler-chevron-down"
          >
            {{ toLabel(activeDeviceMode?.value) }}
          </XButton>
        </XDropDown>
      </div>
    </div>

    <!-- Page grid view with drag and drop -->

    <EffectDraggableSort
      v-show="site && !site.editingPageId.value"
      item-selector=".draggable-page"
      :disabled="false"
      :allow-horizontal="true"
      class="@container draggable-page-container grid gap-4 lg:gap-6 grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 mb-4 relative"
      @update:sorted="handlePageOrderUpdate"
    >
      <div
        v-for="page in sitePages"
        :key="fastHash(page.toConfig())"
        :data-drag-id="page.cardId"
        class="z-20 draggable-page h-80 lg:h-[400px] relative group transition-all duration-300 ease-out bg-white dark:bg-theme-800 rounded-lg shadow-md overflow-hidden cursor-pointer ring-1 ring-theme-200 dark:ring-theme-600/60 hover:ring-theme-400 dark:hover:ring-theme-500"
        :class="{ 'ring-2 ring-theme-500 dark:ring-theme-400': isActivePage(page.cardId) }"
        @click="selectPage(page.cardId)"
      >
        <!-- Page preview iframe -->
        <div class="relative size-full overflow-hidden bg-theme-100 dark:bg-theme-900">
          <iframe
            :src="site.frame.framePageUrl({ slug: !page.isHome.value ? page.slug.value : '', siteMode: 'standard' })"
            class="transform scale-[0.25] origin-top-left"
            style="width: 400%; height: 400%"
            frameborder="0"
            loading="lazy"
          />

          <!-- Overlay to avoid iframe interactions -->
          <div class="absolute inset-0 bg-transparent z-10" />
        </div>

        <!-- Page info overlay -->
        <div class="absolute bottom-0 left-0 right-0 px-2 py-3 bg-white/90 dark:bg-theme-800/90 backdrop-blur-sm z-10">
          <div class="flex items-center gap-1">
            <XIcon class="size-[1.2em] -ml-0.5 text-theme-400 dark:text-theme-500 rounded backdrop-blur-sm cursor-grab" :media="{ class: 'i-tabler-grip-vertical' }" />
            <div class="gap-1 flex items-center flex-wrap">
              <h3 class="font-medium text-sm truncate grow text-left">
                {{ page.title.value || toLabel(page.slug.value) }}
              </h3>
              <!-- Badge for special pages -->
              <XButton
                v-if="getPageBadge(page)"
                theme="primary"
                design="outline"
                size="xs"
              >
                {{ getPageBadge(page)?.label }}
              </XButton>
            </div>
            <span class="text-xs text-theme-500 dark:text-theme-400 grow text-right">
              {{ page.isHome.value ? '/' : `/${page.slug.value}` }}
            </span>
          </div>
        </div>
      </div>

      <!-- Add new page button -->
      <div
        v-if="sitePages.length < maxGridPages"
        class="h-80 lg:h-[400px] cursor-pointer flex items-center justify-center border-2 border-dashed border-theme-300 dark:border-theme-700 rounded-lg hover:border-theme-500 dark:hover:border-theme-500 transition-all"
        @click.stop="site.editorActivateTool({ toolId: 'pageAdd' });"
      >
        <div class="text-center px-4 py-2">
          <XIcon class="size-12 mx-auto mb-2 text-theme-400 dark:text-theme-600" :media="{ class: 'i-tabler-plus' }" />
          <p class="text-sm font-medium text-theme-700 dark:text-theme-300">
            Add New Page
          </p>
        </div>
      </div>
    </EffectDraggableSort>

    <!-- Main editor view -->
    <div
      v-if="site"
      class="min-h-0 relative mx-auto pb-10 flex flex-col transition-all duration-300"
      :class="[
        deviceModeConfig?.wrapClass,
        !site.editingPageId.value ? 'opacity-0 h-0 overflow-hidden' : 'h-full',
      ]"
    >
      <ElBrowserFrameDevice
        ref="frameRef"
        :device-mode="activeDeviceModeKey"
        class="rounded-md shadow-lg border border-theme-200 dark:border-theme-600"
        :url="site.frame.frameUrl.value"
        frame-id="site-builder-iframe"
        :display-url="site.url.value"
        :browser-bar="false"
        @update:url="site?.frame.updateFrameUrl($event)"
        @message="site?.frame.processFrameMessage({ scope: 'parent', msg: $event as FramePostMessageList })"
      />
    </div>
  </div>
</template>
