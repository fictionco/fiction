<script lang="ts" setup>
import type { NavListItem, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui/index.js'
import type { Post } from '../post.js'
import { toLabel, useService, vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import XText from '@fiction/ui/common/XText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import ProseEditor from '@fiction/ui/prose/editor/ProseEditor.vue'
import ProseEditorToolbar from '@fiction/ui/prose/editor/ProseEditorToolbar.vue'
import { t } from '../schema'
import { TablePostSchema as schema } from '../schema.js'
import ElOptionWrap from './ElOptionWrap.vue'
import InputAudienceFilter from './InputAudienceFilter.vue'
import { postEditController } from './tools'

defineOptions({ name: 'PostEditor' })

const { post, card } = defineProps<{
  post?: Post
  card: Card
}>()

const emit = defineEmits<{
  (event: 'update:post', payload: Post): void
}>()

const service = useService()

const proseEditorEl = vue.ref<InstanceType<typeof ProseEditor>>()

function handleUpdate(args: { key: 'title' | 'subTitle' | 'content', value: string, caller: string }) {
  if (!post)
    return

  const { key, value, caller } = args

  post.update({ [key]: value }, { caller })

  emit('update:post', post)
}

type ViewModeKey = 'compose' | 'audience' | 'email' | 'web' | 'review'

const viewModes = vue.computed(() => {
  const emailConfig = post?.emailConfig.value
  const activeOrganizationId = service.fictionUser.activeOrgId.value
  const out: (PostObject & { value: ViewModeKey, options?: InputOption[] })[] = [
    { value: 'compose', title: 'Edit Post', icon: { class: 'i-tabler-edit' } },
    {
      value: 'audience',
      title: 'Select Audience',
      icon: { class: 'i-tabler-users' },
      options: [
        createOption({
          schema,
          key: 'group.postContent',
          input: 'group',
          icon: { class: 'i-tabler-users' },
          options: [

            createOption({
              schema,
              key: 'emailConfig.audience.mode',
              label: 'Select Audiences',
              input: 'InputRadioButton',
              list: [
                { label: 'All Subscribers', value: 'all' },
                { label: 'Specific Contacts', value: 'filter' },
              ],
            }),
            createOption({
              schema,
              key: 'emailConfig.audience.filters',
              label: 'Specific Filters',
              input: InputAudienceFilter,
              isHidden: emailConfig?.audience?.mode !== 'filter',
            }),
          ],
        }),
      ],
    },
    {
      value: 'email',
      title: 'Email Details',
      icon: { class: 'i-tabler-mail' },
      options: [
        createOption({
          key: 'group.inbox',
          input: 'group',
          icon: { class: 'i-tabler-inbox' },
          options: [
            createOption({
              schema,
              key: 'emailStatus',
              label: 'Newsletter Email',
              input: 'InputRadioButton',
              list: [
                { label: 'Email on Publish', value: 'toSend' },
                { label: `Publish to Web Only`, value: 'none' },
              ],
            }),
            createOption({
              schema,
              key: 'emailConfig.subject',
              label: 'Subject Line',
              description: 'The main inbox subject line.',
              input: 'InputText',
              placeholder: 'Enter Subject',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'emailConfig.preview',
              label: 'Preview Line',
              description: 'The preview line is the first line of the email and is shown in the inbox',
              input: 'InputText',
              placeholder: 'Enter Preview Text',
            }),
          ],
        }),
      ],
    },
    {
      value: 'web',
      title: 'Web and SEO',
      icon: { class: 'i-tabler-world' },
      options: [
        createOption({
          key: 'group.inbox',
          input: 'group',
          icon: { class: 'i-tabler-inbox' },
          options: [
            createOption({
              schema,
              key: 'slug',
              label: 'Slug',
              input: 'InputUsername',
              placeholder: 'my-post',
              isRequired: true,
              props: {
                table: t.posts,
                columns: [
                  { name: 'slug', allowReserved: true },
                  { name: 'orgId', value: activeOrganizationId },
                ],
              },
            }),
            createOption({
              schema,
              key: 'userConfig.site.title',
              label: 'SEO Title',
              description: 'The title that will be displayed in search results.',
              placeholder: 'Enter Title',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'userConfig.site.description',
              label: 'SEO Description',
              description: 'The description that will be displayed in search results.',
              placeholder: 'Enter Description',
              input: 'InputText',
            }),
          ],
        }),
      ],
    },
    { value: 'review', title: 'Review and Publish', icon: { class: 'i-tabler-check' } },
  ] as const

  return out
})

const activeViewModeKey = vue.ref<ViewModeKey>('compose')
const activeViewModeIndex = vue.computed(() => viewModes.value.findIndex(v => v.value === activeViewModeKey.value))
const activeViewMode = vue.computed(() => {
  return viewModes.value.find(v => v.value === activeViewModeKey.value)
})

const classes = vue.computed(() => {
  return {
    panel: 'bg-theme-0 dark:bg-theme-800 rounded-md border border-theme-200 shadow-lg dark:border-theme-500/50',
  }
})

vue.onMounted(() => {
  vue.watch(() => activeViewModeKey.value, (v) => {
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
        :class="activeViewModeKey === 'compose' ? 'justify-between' : 'justify-center'"
      >
        <div class="flex items-center gap-2 justify-center">
          <XButton
            v-for="(mode, i) in viewModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :class="activeViewModeKey === mode.value ? '' : 'opacity-80'"
            :theme="activeViewModeKey === mode.value ? 'green' : 'default'"
            :icon="mode.icon"
            size="xs"

            @click.stop="activeViewModeKey = mode.value"
          >
            {{ toLabel(mode.value) }}
          </XButton>
        </div>

        <div class="flex items-center gap-2">
          <ElTooltip
            v-if="activeViewModeKey === 'compose'"
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
        <div v-if="activeViewModeKey === 'compose'" class="flex-grow flex flex-col gap-4 h-full min-h-0">
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
        <template v-else>
          <ElOptionWrap
            :key="activeViewModeKey"
            :card
            :post
            :value="activeViewModeKey"
            :title="activeViewMode?.title"
            :options="activeViewMode?.options"
          />
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
