<script lang="ts" setup>
import type { ActionItem, NavItem } from '@fiction/core'
import { getNavComponentType, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import type { EmailSendConfig } from '../schema.js'

const props = defineProps({
  modelValue: { type: Object as vue.PropType<EmailSendConfig>, default: undefined },
  card: { type: Object as vue.PropType<Card>, required: true },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: EmailSendConfig): void
}>()

const service = useService()
const email = vue.computed(() => {
  return props.modelValue
})

function getWordCountFromHTML(html?: string) {
  if (!html)
    return 0
  const h = html.replace(/<[^>]*>?/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = h.split(' ').length

  return wordCount
}

const items = vue.computed<NavItem[]>(() => {
  const em = email.value
  const wordCount = getWordCountFromHTML(em?.post?.content || '')
  const settings = props.card.link(`/email-manage/settings?emailId=${em?.emailId}`)
  const edit = props.card.link(`/email-edit?emailId=${em?.emailId}`)
  const pub = props.card.link(`/settings/project`)
  return [
    { name: 'Schedule Send', desc: 'Send on Publish', isActive: false, href: settings },
    { name: 'Subject', desc: em?.subject, isActive: true, href: settings },
    { name: 'Sending From', desc: 'not set', isActive: true, href: pub },
    { name: 'Sending To', desc: '240 Subscribers', isActive: true, href: settings },
    { name: 'Title', desc: em?.post?.title, href: edit },
    { name: 'Email Content', desc: `Approx. ${wordCount} Words`, href: edit },
  ]
})

const allActions = vue.computed<ActionItem[]>(() => {
  const propActions = props.actions || []
  return [
    { name: 'Publish Email', btn: 'primary' },
    ...propActions,
  ]
})
</script>

<template>
  <div>
    <div class="p-16  ">
      <div class="">
        <div class="mb-4 relative">
          <div class="text-4xl lg:text-5xl text-theme-500/30  i-tabler-mail" />
        </div>
        <h1 class=" text-2xl md:text-4xl font-bold tracking-tight dark:text-theme-0 sm:text-5xl x-font-title">
          Email:  {{ email?.title }}
        </h1>
        <p class="mt-6 text-lg lg:text-xl text-theme-600 dark:text-theme-300">
          Status: {{ email?.status }}
        </p>
        <ElActions class="flex gap-4 mt-6" ui-size="lg" :actions="allActions" />
      </div>
      <fieldset class="my-12">
        <div class="space-y-5">
          <div v-for="(item, i) in items" :key="i" class="relative flex gap-4">
            <div class="size-8 rounded-lg flex justify-center items-center " :class="item.isActive ? 'bg-primary-500 dark:bg-primary-800 text-white' : 'bg-theme-50 dark:bg-theme-700'">
              <div class="text-xl" :class="!item.isActive ? 'i-tabler-x' : 'i-tabler-check'" />
            </div>
            <div class=" text-sm">
              <component :is="getNavComponentType(item)" :to="item.href" class="font-medium text-theme-500 dark:text-theme-400 hover:text-theme-300 dark:hover:text-theme-0 cursor-pointer">
                {{ item.name }}
              </component>
              <p id="comments-description" class="text-lg">
                {{ item?.desc }}
              </p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>
