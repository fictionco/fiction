<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import type { ViewMode, ViewModeKey } from './PagePostEdit.vue'
import { toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import XText from '@fiction/ui/common/XText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import ProseEditor from '@fiction/ui/prose/editor/ProseEditor.vue'
import ProseEditorToolbar from '@fiction/ui/prose/editor/ProseEditorToolbar.vue'
import ElOptionWrap from './ElOptionWrap.vue'
import { postEditController } from './tools'

defineOptions({ name: 'PostEditor' })

const { post, card, viewModes, activeKey } = defineProps<{
  post?: Post
  card: Card
  viewModes: ViewMode[]
  activeKey: ViewModeKey
}>()

const emit = defineEmits<{
  (event: 'update:post', payload: Post): void
  (event: 'update:activeKey', payload: ViewModeKey): void
  (event: 'navigate', payload: { dir?: 'next' | 'prev' | 'schedule' | 'unschedule', key?: ViewModeKey }): void
}>()

const proseEditorEl = vue.ref<InstanceType<typeof ProseEditor>>()

function handleUpdate(args: { key: 'title' | 'subTitle' | 'content', value: string, caller: string }) {
  if (!post)
    return

  const { key, value, caller } = args

  post.update({ [key]: value }, { caller })

  emit('update:post', post)
}

const activeViewModeIndex = vue.computed(() => viewModes.findIndex(v => v.value === activeKey))
const activeViewMode = vue.computed(() => {
  return viewModes.find(v => v.value === activeKey)
})

const classes = vue.computed(() => {
  return {
    panel: 'bg-theme-0 dark:bg-theme-800 rounded-md border border-theme-200 shadow-lg dark:border-theme-500/50',
  }
})

vue.onMounted(() => {
  vue.watch(() => activeKey, (v) => {
    if (v === 'compose') {
      postEditController.hideToolDrawers.value = false
    }
    else {
      postEditController.hideToolDrawers.value = true
    }
  }, { immediate: true })
})

const transit = vue.ref('next')
vue.watch(
  () => activeViewModeIndex.value,
  (v, old) => {
    transit.value = v < old ? 'slide-prev' : 'slide-next'
  },
)
</script>

<template>
  <div v-if="post" class="h-full">
    <div class="p-4 space-y-4 flex flex-col h-full">
      <div
        class=" flex  space-x-2 "
        :class="activeKey === 'compose' ? 'justify-between' : 'justify-center'"
      >
        <div class="flex items-center gap-2 justify-center">
          <XButton
            v-for="(mode, i) in viewModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :class="activeKey === mode.value ? '' : 'opacity-80'"
            :theme="activeKey === mode.value ? 'primary' : 'default'"
            :icon="mode.icon"
            size="xs"

            @click.stop="emit('update:activeKey', mode.value)"
          >
            {{ toLabel(mode.value) }}
          </XButton>
        </div>

        <div class="flex items-center gap-2">
          <ElTooltip
            v-if="activeKey === 'compose'"
            direction="bottom"
            content="Toggle Context Drawer"
          >
            <XButton
              rounding="full"
              :icon="postEditController.hideToolDrawers.value ? 'i-tabler-arrow-bar-to-left' : 'i-tabler-focus'"
              size="sm"
              respond="icon:xl"
              design="outline"
              :theme="postEditController.hideToolDrawers.value ? 'default' : 'default'"
              @click.prevent="postEditController.hideToolDrawers.value = !postEditController.hideToolDrawers.value"
            >
              {{ postEditController.hideToolDrawers.value ? 'Show Settings' : 'Focus Mode' }}
            </XButton>
          </ElTooltip>
        </div>
      </div>
      <transition :name="transit" mode="out-in">
        <div v-if="activeKey === 'compose'" class="flex-grow flex flex-col gap-4 h-full min-h-0">
          <div class="flex gap-4 items-stretch">
            <div :class="classes.panel" class="px-4 py-2 flex items-center justify-between grow w-full gap-6">
              <XText
                :model-value="post.title.value"
                tag="h1"
                class="text-balance my-0 text-2xl font-semibold x-font-title"
                :is-editable="true"
                placeholder="Enter Title"
                data-test-id="post-editor-title"
                :disable-formatting="true"
                @update:model-value="handleUpdate({ key: 'title', value: $event as string, caller: 'proseEditor:title' })"
              />
              <XText
                :model-value="post.subTitle.value"
                tag="h3"
                class="dark:text-theme-300 text-xl"
                :is-editable="true"
                placeholder="Enter Subtitle"
                data-test-id="post-editor-sub-title"
                :disable-formatting="true"
                @update:model-value="handleUpdate({ key: 'subTitle', value: $event as string, caller: 'proseEditor:subTitle' })"
              />
            </div>
            <div class="h-auto w-[80px] shrink-0" :class="classes.panel">
              <XMedia
                data-test-id="featured-post-media"
                :media="post.media.value"
                class="h-full w-full dark:bg-theme-900 shadow-inner rounded-md overflow-hidden "
                image-mode="contain"
              />
            </div>
          </div>
          <div
            class="h-full  @container  overflow-hidden flex flex-col"
            :class="classes.panel"
          >
            <div class="flex gap-4 md:gap-6 items-center justify-between px-4 py-2 border-b border-theme-200 dark:border-theme-600">
              <div class="w-full">
                <ProseEditorToolbar v-if="proseEditorEl?.editor" :editor="proseEditorEl?.editor" />
              </div>
            </div>
            <div class="relative max-h-[100%] overflow-scroll w-full aspect-[3/4] min-h-0 dark:bg-theme-950/80 no-scrollbar">
              <div class="pt-12 md:pt-16 pb-[50vh] px-12 max-w-[900px] mx-auto focus:outline-none space-y-6">
                <ProseEditor
                  ref="proseEditorEl"
                  :model-value="post.content.value"
                  :is-content-completion-disabled="post.userConfig.value?.isContentCompletionDisabled"
                  :supplemental="{ title: post.title.value, subTitle: post.subTitle.value }"
                  @update:model-value="handleUpdate({ key: 'content', value: $event as string, caller: 'proseEditor:content' })"
                />

                <div v-if="$slots.footer" class="not-prose">
                  <slot name="footer" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <div :key="activeKey">
            <ElOptionWrap

              :card
              :post
              :value="activeKey"
              :title="activeViewMode?.title"
              :options="activeViewMode?.options"
            >
              <template #footer>
                <div class="mt-6 justify-between flex gap-6">
                  <XButton
                    :disabled="activeViewModeIndex === 0"
                    theme="default"
                    design="outline"
                    icon="i-tabler-arrow-left"
                    @click="emit('navigate', { dir: 'prev' })"
                  >
                    Previous
                  </XButton>
                  <XButton
                    v-if="activeViewModeIndex < viewModes.length - 1"
                    theme="primary"
                    design="outline"
                    icon-after="i-tabler-arrow-right"
                    @click="emit('navigate', { dir: 'next' })"
                  >
                    Next
                  </XButton>
                  <XButton
                    v-else-if="post.status.value === 'draft'"
                    theme="primary"
                    design="solid"
                    icon="i-tabler-calendar"
                    icon-after="i-tabler-arrow-right"
                    @click.stop="emit('navigate', { dir: 'schedule' })"
                  >
                    Schedule
                  </XButton>
                  <XButton
                    v-else-if="post.status.value === 'scheduled'"
                    theme="orange"
                    design="outline"
                    icon="i-tabler-calendar-off"
                    icon-after="i-tabler-arrow-back-up"
                    @click.stop="emit('navigate', { dir: 'unschedule' })"
                  >
                    Unschedule
                  </XButton>
                </div>
              </template>
            </ElOptionWrap>
          </div>
        </template>
      </transition>
    </div>
  </div>
</template>

<style lang="less">
.slide-next-enter-from,
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(15vw);
}
.slide-next-enter-to,
.slide-next-leave-from,
.slide-prev-enter-to,
.slide-prev-leave-from {
  transform: translateX(0);
}
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: 0.3s cubic-bezier(0.25,1,0.33,1);
  transition-property: opacity, transform;
}

.slide-next-leave-to,
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-15vw);
}
</style>
