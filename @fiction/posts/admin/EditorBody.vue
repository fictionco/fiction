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
              <div class=" pt-6 md:pt-10 pb-[50vh] px-6 md:px-12 max-w-[800px] mx-auto focus:outline-none space-y-12">
                <div class="p-2 sticky top-0 bg-theme-50 dark:bg-theme-950 z-10 -mx-4">
                  <ProseEditorToolbar v-if="proseEditorEl?.editor" :editor="proseEditorEl?.editor" />
                </div>

                <div class="flex gap-12 items-center">
                  <div class="space-y-4 grow font-serif">
                    <XText
                      :model-value="post.title.value"
                      tag="h1"
                      class="text-balance my-0 text-xl @[400px]/editor:text-4xl !leading-[1.2] font-medium"
                      :is-editable="true"
                      placeholder="Enter Title"
                      data-test-id="post-editor-title"
                      :disable-formatting="true"
                      @update:model-value="handleUpdate({ key: 'title', value: $event as string, caller: 'proseEditor:title' })"
                    />
                    <XText
                      :model-value="post.subTitle.value"
                      tag="h3"
                      class="dark:text-theme-300 text-lg @[400px]/editor:text-2xl !leading-[1.2] font-normal"
                      :is-editable="true"
                      placeholder="Enter Subtitle"
                      data-test-id="post-editor-subTitle"
                      :disable-formatting="true"
                      @update:model-value="handleUpdate({ key: 'subTitle', value: $event as string, caller: 'proseEditor:subTitle' })"
                    />
                  </div>
                  <div class="">
                    <InputMedia
                      v-model="post.media.value"
                      ui-size="sm"
                      data-test-id="featured-post-media"
                      class="w-32"
                      aspect-class="aspect-[1/1]"
                      :full-width="true"
                    />
                  </div>
                </div>

                <div class="flex items-center gap-4 ">
                  <div class="border-b border-dashed border-theme-700 grow " />
                </div>

                <ProseEditor
                  ref="proseEditorEl"
                  class="font-serif"
                  :model-value="post.content.value"
                  :is-content-completion-disabled="post.userConfig.value?.contentCompletion?.enabled"
                  :supplemental="{ title: post.title.value, subTitle: post.subTitle.value }"
                  @update:model-value="handleUpdate({ key: 'content', value: $event as string, caller: 'proseEditor:content' })"
                />
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
