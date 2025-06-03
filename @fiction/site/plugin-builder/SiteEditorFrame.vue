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
import { requestManagePage } from '../utils/region'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
})

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility<FramePostMessageList> }>()

type DeviceModeKeys = 'desktop' | 'mobile' | 'tablet' | 'landscape'
const activeDeviceModeKey = vue.ref<DeviceModeKeys>('desktop')
const deviceModes: (NavListItem & { wrapClass: string, value: DeviceModeKeys })[] = [
  { value: 'desktop', icon: { class: 'i-tabler-device-desktop' }, wrapClass: 'w-full' },
  { value: 'mobile', icon: { class: 'i-tabler-device-mobile' }, wrapClass: 'w-[60%] max-w-sm' },
  { value: 'tablet', icon: { class: 'i-tabler-device-ipad' }, wrapClass: 'w-[85%] max-w-xl' },
  { value: 'landscape', icon: { class: 'i-tabler-device-ipad-horizontal' }, wrapClass: 'w-[90%] max-w-2xl' },
]

const activeDeviceMode = vue.computed(() =>
  deviceModes.find(mode => mode.value === activeDeviceModeKey.value) || deviceModes[0],
)

const deviceModeConfig = vue.computed(() =>
  deviceModes.find(mode => mode.value === activeDeviceModeKey.value),
)

vue.watch(
  frameRef,
  (newValue) => {
    if (newValue && props.site)
      props.site.frame.setUtil(newValue.frameUtility)
  },
  { immediate: true },
)

const maxGridPages = 16

const sitePages = vue.computed(() => {
  if (!props.site)
    return []

  return props.site.pages.value
    .filter(page => !page.slug.value?.startsWith('__') && !page.isSystem.value)
    .sort((a, b) => a.isHome.value ? -1 : b.isHome.value ? 1 : 0)
    .slice(0, maxGridPages)
})

async function selectPage(args: { cardId: string, withSettings?: boolean }) {
  const { cardId, withSettings } = args
  if (!props.site || !cardId)
    return

  props.site.editingPageId.value = cardId
  activeDeviceModeKey.value = 'desktop'

  if (withSettings)
    props.site.editorActivateTool({ toolId: 'pageEdit' })
}

const currentPage = vue.computed(() => props.site?.currentPage.value)
const isHome = vue.computed(() => currentPage.value?.isHome.value)

function handlePageOrderUpdate(ids: string[]) {
  if (!props.site || !ids.length)
    return

  const orderedPages = ids
    .map(id => props.site!.pages.value.find(page => page.cardId === id))
    .filter(Boolean)

  if (props.site.userConfig && orderedPages.length) {
    const navConfig = props.site.nav.value || {}
    const existingPrimaryNav = (navConfig.primary || []).filter(item =>
      !item.cardId || !ids.includes(item.cardId),
    )

    const updatedPageNavItems = orderedPages.map(page => ({
      label: page?.title.value || toLabel(page?.slug.value || ''),
      href: page?.slug.value === '_home' ? '/' : `/${page?.slug.value}`,
      cardId: page?.cardId,
      target: '_self' as const,
      variant: 'default' as const,
    }))

    props.site.userConfig.value = {
      ...props.site.userConfig.value,
      navigation: {
        ...navConfig,
        primary: [...updatedPageNavItems, ...existingPrimaryNav],
      },
    }

    props.site.syncChange({ caller: 'updatePageOrder' })

    props.site.fictionSites.fictionEnv.events.emit('notify', {
      type: 'success',
      message: 'Page order updated',
    })
  }
}

async function deletePage(page: Card) {
  const confirmed = confirm('Are you sure?')
  if (confirmed && props.site) {
    await requestManagePage({
      site: props.site,
      _action: 'delete',
      regionCard: page.toConfig(),
    })
  }
}

// Add stable hash management
const stableHashes = vue.ref<Record<string, string>>({})

// Update hashes only when not editing (prevents background reloads)
vue.watch(
  () => [props.site?.editingPageId.value, sitePages.value],
  ([editingPageId]) => {
    if (!editingPageId) {
      // Only update hashes when showing all pages
      const newHashes: Record<string, string> = {}
      sitePages.value?.forEach((page) => {
        newHashes[page.cardId] = fastHash(page.toConfig())
      })
      stableHashes.value = newHashes
    }
  },
  { immediate: true, deep: true },
)

function getStablePageHash(page: Card): string {
  return stableHashes.value[page.cardId] || ''
}
</script>

<template>
  <div
    v-if="site"
    class="space-y-4 p-4 lg:p-6 @container bg-theme-800 overflow-scroll"
  >
    <div v-if="!site.editingPageId.value" class="flex gap-2 items-baseline">
      <div class="font-semibold">
        All Pages
      </div>
      <div class="font-mono text-sm text-theme-500 dark:text-theme-400">
        Drag to reorder • Click to Edit
      </div>
    </div>

    <div v-else class="flex justify-between space-x-2">
      <div class="flex items-center gap-3">
        <XButton
          size="sm"
          rounding="md"
          design="ghost"
          icon="i-tabler-settings"
          data-test-id="page-settings-button"
          @click.stop="site.editorActivateTool({ toolId: 'pageEdit' })"
        >
          Page Settings
        </XButton>

        <div v-if="currentPage" class="flex items-center gap-2">
          <XText
            :model-value="currentPage?.title.value || 'Untitled'"
            title="Current Page Title"
            class="font-mono text-sm font-semibold whitespace-nowrap"
            :is-editable="true"
            @update:model-value="currentPage.title.value = $event"
          />

          <div class="font-mono font-medium text-sm text-theme-500 dark:text-theme-400 flex items-center gap-0.5">
            <div class="i-tabler-slash text-lg" />
            <div v-if="isHome">
              (Home Page)
            </div>
            <XText
              v-else
              :model-value="currentPage.slug.value"
              title="Page Slug"
              class="whitespace-nowrap"
              :is-editable="true"
              @update:model-value="currentPage.slug.value = $event"
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <ElTooltip direction="bottom" content="Undo">
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

        <ElTooltip direction="bottom" content="Redo">
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
            respond="icon:xl"
          >
            {{ toLabel(activeDeviceMode?.value) }}
          </XButton>
        </XDropDown>
      </div>
    </div>

    <EffectDraggableSort
      v-show="!site.editingPageId.value"
      item-selector=".draggable-page"
      :allow-horizontal="true"
      data-test-id="draggable-page-container"
      class="@container grid gap-4 lg:gap-10 grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 mb-4"
      @update:sorted="handlePageOrderUpdate"
    >
      <div
        v-for="page in sitePages"
        :key="getStablePageHash(page)"
        :data-drag-id="page.cardId"
        :data-test-id="`page-frame-${page.slug.value}`"
        class="draggable-page h-80 lg:h-[400px] ring-1 ring-theme-200 dark:ring-theme-600/60 hover:ring-theme-400 dark:hover:ring-theme-500 relative group transition-all duration-300 bg-white dark:bg-theme-800 rounded-lg shadow-md overflow-hidden cursor-pointer "
        @click="selectPage({ cardId: page.cardId })"
      >
        <div class="relative size-full overflow-hidden bg-theme-100 dark:bg-theme-900 z-0">
          <iframe
            :src="site.frame.framePageUrl({ pageCardId: page.cardId, siteMode: 'standard' })"
            class="transform scale-[0.2] origin-top-left"
            style="width: 500%; height: 500%"
            frameborder="0"
          />
          <div class="absolute inset-0 bg-transparent z-10" />
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-3 bg-white/90 dark:bg-theme-800/90 backdrop-blur-sm z-10">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2">
              <XIcon
                class="size-4 text-theme-400 cursor-grab"
                :media="{ class: 'i-tabler-grip-vertical' }"
              />
              <h3 class="font-medium text-sm truncate flex-1">
                {{ page.title.value || 'Untitled' }}
              </h3>
              <XButton
                v-if="page.isHome.value"
                theme="primary"
                design="link"
                size="sm"
                icon="i-tabler-home"
                :data-test-id="`page-home-button-${page.slug.value}`"
              />
              <span class="text-xs text-theme-500 dark:text-theme-400">
                {{ page.isHome.value ? '/' : `/${page.slug.value}` }}
              </span>
            </div>
            <div class="flex items-center gap-2 ml-auto" @click.stop>
              <XDropDown
                mode="click"
                :items="[
                  { label: 'Edit Settings', icon: { class: 'i-tabler-pencil' }, onClick: () => selectPage({ cardId: page.cardId, withSettings: true }) },
                  { label: 'Delete', icon: { class: 'i-tabler-trash' }, onClick: () => deletePage(page) },
                ]"
                dropdown-alignment="end"
                placement="top"
              >
                <XButton
                  theme="default"
                  size="sm"
                  rounding="md"
                  design="ghost"
                  icon="i-tabler-dots"
                />
              </XDropDown>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="sitePages.length < maxGridPages"
        class="h-80 lg:h-[400px] cursor-pointer flex items-center justify-center border-2 border-dashed border-theme-300 dark:border-theme-600/70 bg-theme-700/40 rounded-lg hover:border-theme-500 transition-all hover:dark:border-primary-600"
        data-test-id="add-new-page-button"
        @click.stop="site.editorActivateTool({ toolId: 'pageAdd' })"
      >
        <div class="text-center px-4 py-2">
          <XIcon class="size-12 mx-auto mb-2 text-theme-400  dark:text-theme-600" :media="{ class: 'i-tabler-plus' }" />
          <p class="text-sm font-medium text-theme-700 dark:text-theme-300">
            Add New Page
          </p>
        </div>
      </div>
    </EffectDraggableSort>

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
        @message="site?.frame.processFrameMessage({ msg: $event as FramePostMessageList, scope: 'parent' })"
      />
    </div>
  </div>
</template>
