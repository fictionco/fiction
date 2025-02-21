<script lang="ts" setup>
import type { ColorThemeUser, NavListItem } from '@fiction/core'
import type { Post } from '../post'
import type { PanelNavigate, ViewModeKey } from './PagePostEdit.vue'
import { dayjs, vue } from '@fiction/core'
import { getObjectWordCount } from '@fiction/core/utils/wordCount'
import TransitionSlide from '@fiction/ui/anim/TransitionSlide.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'

defineOptions({ name: 'InputPostReview' })

const props = defineProps<{
  modelValue?: any
  uiSize?: string
  post: Post
  recipientCount?: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: any): void
  (event: 'navigate', payload: PanelNavigate): void
}>()

// Define review content types
type ReviewContent = {
  label: string
  value: string | NavListItem | undefined | number
  badge?: string
  actions: { label: string, key: ViewModeKey }[]
}

type ReviewSection = {
  key: string
  title: string
  icon: string
  theme: ColorThemeUser
  content: ReviewContent[]
}

// Track section open/closed state
const openSections = vue.ref<Record<string, boolean>>({})

// Toggle section visibility
function toggleSection(key: string) {
  openSections.value[key] = !openSections.value[key]
}

// Map audience configuration to display info
function getAudienceInfo(target?: string): NavListItem {
  const audiences: Record<string, NavListItem> = {
    all: {
      label: 'All contacts',
      description: 'Your email will be sent to all active subscribers',
      icon: { iconId: 'users' },
      theme: 'indigo',
    },
    filtered: {
      label: 'Filtered contacts',
      description: 'Your email will be sent to subscribers matching your filter criteria',
      icon: { iconId: 'filter' },
      theme: 'blue',
    },
    nobody: {
      label: 'No email will be sent',
      description: 'This post will only be published to your website',
      icon: { iconId: 'mail-off' },
      theme: 'slate',
    },
  }

  return audiences[target || ''] || {
    label: 'Not configured',
    description: 'Email settings have not been configured',
    icon: { iconId: 'alert-circle' },
    theme: 'amber',
  }
}

// Map visibility settings to display info
function getVisibilityInfo(visibility?: string): NavListItem {
  const visibilities: Record<string, NavListItem> = {
    public: {
      label: 'Public',
      description: 'Everyone can see this post',
      icon: { iconId: 'world' },
      theme: 'green',
    },
    private: {
      label: 'Private',
      description: 'Only logged in users can see this post',
      icon: { iconId: 'lock' },
      theme: 'slate',
    },
    unlisted: {
      label: 'Unlisted',
      description: 'Only people with the direct link can see this post',
      icon: { iconId: 'link' },
      theme: 'cyan',
    },
  }

  return visibilities[visibility || ''] || {
    label: 'Not configured',
    description: 'Visibility settings have not been configured',
    icon: { iconId: 'alert-circle' },
    theme: 'amber',
  }
}

// Configure review sections
const sections = vue.computed<ReviewSection[]>(() => [
  {
    key: 'content',
    title: 'Content Details',
    icon: 'i-tabler-file-text',
    theme: 'emerald',
    content: [
      {
        label: 'Title',
        value: props.post.title.value,
        actions: [{ label: 'Edit', key: 'compose' }],
      },
      {
        label: 'Subtitle',
        value: props.post.subTitle.value || 'No subtitle',
        actions: [{ label: 'Edit', key: 'compose' }],
      },
      {
        label: 'Word count',
        value: getObjectWordCount(props.post.toConfig()),
        actions: [{ label: 'Edit', key: 'compose' }],
      },
      {
        label: 'Authors',
        value: props.post.authors?.value.map(a => a.fullName).join(', ') || 'No authors',
        actions: [{ label: 'Edit', key: 'compose' }],
      },
      {
        label: 'Publication date',
        value: props.post.publishAt.value
          ? dayjs(props.post.publishAt.value).format('MMM D, YYYY [at] h:mm A')
          : 'Not scheduled',
        actions: [{ label: 'Edit', key: 'review' }],
      },
    ],
  },
  {
    key: 'email',
    title: 'Email Details',
    icon: 'mail',
    theme: 'orange',
    content: [
      {
        label: 'Email audience',
        value: getAudienceInfo(props.post.emailConfig?.value?.target),
        badge: props.recipientCount ? `${props.recipientCount} recipients` : undefined,
        actions: [{ label: 'Edit', key: 'audience' }],
      },
      {
        label: 'Subject line',
        value: props.post.emailConfig?.value?.subject || props.post.title.value,
        actions: [{ label: 'Edit', key: 'email' }],
      },
      {
        label: 'Preview text',
        value: props.post.emailConfig?.value?.preview || props.post.subTitle.value || 'No preview text',
        actions: [{ label: 'Edit', key: 'email' }],
      },
    ],
  },
  {
    key: 'web',
    title: 'Web Details',
    icon: 'i-tabler-world',
    theme: 'cyan',
    content: [
      {
        label: 'Web audience',
        value: getVisibilityInfo(props.post.visibility.value),
        actions: [{ label: 'Edit', key: 'audience' }],
      },
      {
        label: 'URL Slug',
        value: props.post.slug.value || 'Not set',
        actions: [{ label: 'Edit', key: 'web' }],
      },
      {
        label: 'Featured Media',
        value: 'media',
        actions: [{ label: 'Edit', key: 'web' }],
      },
    ],
  },

])

const hasNoEmailRecipients = vue.computed(() =>
  props.post.emailConfig?.value?.target === 'nobody' || !props.post.emailConfig?.value?.target,
)
</script>

<template>
  <div class="space-y-6">
    <!-- Alert for no email recipients -->
    <div v-if="hasNoEmailRecipients" class="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
      <div class="flex gap-3">
        <div class="text-primary-500 dark:text-primary-400 mt-0.5 flex-shrink-0">
          <XIcon media="info-circle" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-medium text-primary-800 dark:text-primary-300">
            No recipients for email
          </h3>
          <p class="text-primary-700 dark:text-primary-400 mt-1 text-sm">
            It looks like you haven't selected any email recipients. This post will only be published to your website.
          </p>
          <div class="mt-3 flex gap-2">
            <XButton
              size="sm"
              theme="primary"
              design="ghost"
              @click="emit('navigate', { key: 'audience' })"
            >
              Edit audience
            </XButton>
            <XButton size="sm" theme="primary" design="ghost">
              Dismiss
            </XButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Review sections -->
    <div
      v-for="section in sections"
      :key="section.key"
      class="border border-theme-200 dark:border-theme-600/60 rounded-lg overflow-hidden"
    >
      <!-- Section header -->
      <div
        class="flex items-center gap-3 p-3 bg-theme-50 dark:bg-theme-700/60  dark:hover:bg-theme-700/40"
        @click="toggleSection(section.key)"
      >
        <XIcon
          :media="section.icon"
          class="w-5 h-5 "
          :class="getColorThemeStyles(section.theme)?.text || 'text-theme-500 dark:text-theme-400'"
        />
        <h3 class="font-semibold text-theme-900 dark:text-theme-100 grow">
          {{ section.title }}
        </h3>
        <XIcon :media="{ class: openSections[section.key] ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down' }" class="size-5" />
      </div>

      <!-- Section content -->
      <TransitionSlide>
        <div
          v-if="openSections[section.key]"
          class="divide-y divide-theme-200 dark:divide-theme-600/60"
        >
          <div
            v-for="(item, i) in section.content"
            :key="`${section.key}-${i}`"
            class="p-6"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="flex gap-4">
                <h4 class="font-medium text-theme-500 dark:text-theme-400 text-sm">
                  {{ item.label }}
                </h4>

                <XButton v-if="item.badge" :theme="section.theme" design="ghost" size="xs">
                  {{ item.badge }}
                </XButton>
              </div>

              <XButton
                v-if="item.actions?.length"
                size="xs"
                :theme="section.theme"
                design="outline"
                @click="emit('navigate', { key: item.actions[0].key as ViewModeKey })"
              >
                {{ item.actions[0].label }}
              </XButton>
            </div>

            <!-- Value content -->
            <div class="mt-3">
              <!-- Thumbnail special case -->
              <div
                v-if="item.value === 'media'"
                class="bg-theme-100 dark:bg-theme-700/30 rounded-lg p-4 flex items-center justify-center"
              >
                <div v-if="post.media.value?.url">
                  <XMedia
                    :media="post.media.value"
                    image-mode="inline"
                    constraint="height"
                    class="h-[100px]"
                  />
                </div>
                <div v-else class="flex gap-3 items-center text-theme-500 p-4">
                  <XIcon :media="{ class: 'i-tabler-photo' }" class="size-[1.3em]" />
                  <span>Not Added</span>
                </div>
              </div>

              <!-- NavListItem display -->
              <div
                v-else-if="typeof item.value === 'object'"
                class="flex items-center gap-3 bg-theme-50 dark:bg-theme-700/60 rounded-lg p-4"
              >
                <div v-if="item.value?.icon" class="text-theme-500 dark:text-theme-400">
                  <XIcon :media="item.value.icon" class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-medium text-theme-700/60 dark:text-theme-200">
                    {{ item.value?.label }}
                  </div>
                  <div class="text-sm text-theme-500 dark:text-theme-400">
                    {{ item.value?.description }}
                  </div>
                </div>
              </div>

              <!-- String value display -->
              <div
                v-else
                class="text-theme-700/60 dark:text-theme-200  p-4 font-bold bg-theme-50 dark:bg-theme-700/60 rounded-lg"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </TransitionSlide>
    </div>
  </div>
</template>
