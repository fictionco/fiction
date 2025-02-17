<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import { toLabel, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import XText from '@fiction/ui/common/XText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import ProseEditor from '@fiction/ui/prose/editor/ProseEditor.vue'
import ProseEditorToolbar from '@fiction/ui/prose/editor/ProseEditorToolbar.vue'

defineOptions({ name: 'ElPostEditor' })

const { post } = defineProps<{
  post?: Post
  card: Card
}>()

const emit = defineEmits<{
  (event: 'update:post', payload: Post): void
}>()

const proseEditorEl = vue.ref<InstanceType<typeof ProseEditor>>()

function handleUpdate(args: { key: 'title' | 'subTitle' | 'content', value: string, caller: string }) {
  if (!post)
    return

  const { key, value, caller } = args

  post.update({ [key]: value }, { caller })

  emit('update:post', post)
}

const deviceModes = [
  { name: 'compose', icon: 'i-tabler-edit' },
  { name: 'audience', icon: 'i-tabler-users' },
  { name: 'email', icon: 'i-tabler-mail' },
  { name: 'web', icon: 'i-tabler-world' },
] as const

const activeDeviceMode = vue.ref('compose')

const classes = vue.computed(() => {
  return {
    panel: 'bg-theme-0 dark:bg-theme-800 rounded-md border border-theme-200 shadow-lg dark:border-theme-500/50',
  }
})
</script>

<template>
  <div v-if="post" class="h-full">
    <div class="p-4 space-y-4 flex flex-col h-full">
      <div
        class=" flex justify-between space-x-2 "
      >
        <div class="flex items-center gap-2 justify-center">
          <XButton
            v-for="(mode, i) in deviceModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :class="activeDeviceMode === mode.name ? '' : 'opacity-80'"
            :theme="activeDeviceMode === mode.name ? 'green' : 'default'"
            :icon="mode.icon"
            size="xs"

            @click.stop="activeDeviceMode = mode.name"
          >
            {{ toLabel(mode.name) }}
          </XButton>
        </div>

        <div class="flex items-center gap-2">
          <ElTooltip
            direction="bottom"
            content="Undo the last change"
          >
            <XButton
              rounding="full"
              icon="i-tabler-arrow-back"
              size="xs"
              respond="icon:xl"
            >
              Undo
            </XButton>
          </ElTooltip>
          <ElTooltip
            direction="bottom"
            content="Redo the last undo"
          >
            <XButton
              rounding="full"
              icon="i-tabler-arrow-forward"
              size="xs"
              respond="icon:xl"
            >
              Redo
            </XButton>
          </ElTooltip>
        </div>
      </div>
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
          <div class="py-12 md:py-16 px-12 max-w-[76ch] mx-auto focus:outline-none space-y-6">
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
  </div>
</template>
