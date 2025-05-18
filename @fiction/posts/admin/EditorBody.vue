<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import type { EditorLocation } from './EditorWrap.vue'
import { vue } from '@fiction/core'
import XText from '@fiction/ui/common/XText.vue'
import InputMedia from '@fiction/ui/inputs/InputMedia.vue'
import ProseEditor from '@fiction/ui/prose/editor/ProseEditor.vue'
import ProseEditorToolbar from '@fiction/ui/prose/editor/ProseEditorToolbar.vue'

defineOptions({ name: 'PostEditor' })

const { post, location = 'compose' } = defineProps<{
  post?: Post
  card: Card
  location?: 'compose'
}>()

const emit = defineEmits<{
  (event: 'update:post', payload: Post): void
  (event: 'update:location', payload: EditorLocation): void
}>()

const proseEditorEl = vue.ref<InstanceType<typeof ProseEditor>>()

function handleUpdate(args: { key: 'title' | 'subTitle' | 'content', value: string, caller: string }) {
  if (!post)
    return

  const { key, value, caller } = args

  post.update({ [key]: value.trim() }, { caller })

  emit('update:post', post)
}

const hasMedia = vue.computed(() => {
  const v = post?.media.value
  return !!(v?.url || v?.html)
})
</script>

<template>
  <div v-if="post" class="h-full">
    <div class="space-y-4 flex flex-col h-full">
      <transition name="next" mode="out-in">
        <div v-if="location === 'compose'" class="flex-grow flex flex-col gap-4 h-full min-h-0">
          <div
            class="h-full @container/editor overflow-hidden flex flex-col"
          >
            <div class="relative max-h-[100%] grow overflow-scroll w-full min-h-0 dark:bg-theme-950/80 no-scrollbar">
              <div class=" pt-6 md:pt-10 pb-[50vh] px-6 md:px-12 max-w-[800px] mx-auto focus:outline-none space-y-8">
                <div class="p-2 sticky top-0 bg-theme-50 dark:bg-theme-950 z-10 -mx-4">
                  <ProseEditorToolbar v-if="proseEditorEl?.editor" :editor="proseEditorEl?.editor" />
                </div>

                <div class="space-y-6">
                  <XText
                    :model-value="post.title.value"
                    tag="h1"
                    class="text-balance my-0 text-xl @[350px]/editor:3xl @[700px]/editor:text-5xl !leading-[1.2]  font-semibold x-font-title"
                    :is-editable="true"
                    placeholder="Enter Title"
                    data-test-id="post-editor-title"
                    :disable-formatting="true"
                    @update:model-value="handleUpdate({ key: 'title', value: $event as string, caller: 'proseEditor:title' })"
                  />
                  <XText
                    :model-value="post.subTitle.value"
                    tag="h3"
                    class="dark:text-theme-300 text-lg @[350px]/editor:xl @[700px]/editor:text-3xl !leading-[1.2]"
                    :is-editable="true"
                    placeholder="Enter Subtitle"
                    data-test-id="post-editor-subTitle"
                    :disable-formatting="true"
                    @update:model-value="handleUpdate({ key: 'subTitle', value: $event as string, caller: 'proseEditor:subTitle' })"
                  />
                </div>

                <div class="flex items-center gap-4 ">
                  <div class="border-b border-dashed border-theme-700 grow " />
                  <div class="text-theme-700 text-sm font-mono i-tabler-slashes" />
                  <div class="border-b border-dashed border-theme-700 grow " />
                </div>

                <div class="flex flex-col gap-4">
                  <InputMedia
                    v-model="post.media.value"
                    ui-size="sm"
                    :aspect-class="!hasMedia ? 'aspect-[5/1]' : ''"
                    data-test-id="featured-post-media"
                    :full-width="true"
                  />
                </div>

                <ProseEditor
                  ref="proseEditorEl"
                  class="font-serif"
                  :model-value="post.content.value"
                  :is-content-completion-disabled="post.userConfig.value?.contentCompletion?.enabled"
                  :supplemental="{ title: post.title.value, subTitle: post.subTitle.value }"
                  @update:model-value="handleUpdate({ key: 'content', value: $event as string, caller: 'proseEditor:content' })"
                />

                <div class="flex items-center gap-4 ">
                  <div class="border-b border-dashed border-theme-700 grow " />
                  <div class="text-theme-700 text-sm font-mono i-tabler-slashes" />
                  <div class="border-b border-dashed border-theme-700 grow " />
                </div>
              </div>
            </div>
          </div>
        </div>
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
