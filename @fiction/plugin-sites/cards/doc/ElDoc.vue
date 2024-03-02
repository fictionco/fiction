<script lang="ts" setup>
import HighlightCode from '@fiction/plugin-highlight-code/HighlightCode.vue'
import type { FactorRouter, NavGroup, PostOrPage } from '@fiction/core'
import { dayjs, renderMarkdown, unhead, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/ElSpinner.vue'
import EntryToc from '@fiction/ui/EntryToc.vue'
import ElNavMenu from '@fiction/ui/ElNavMenu.vue'
import type { Card } from '../../card'

type UserConfig = {
  menu?: NavGroup[]
  post?: PostOrPage
}

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => props.card.userConfig.value)
const post = vue.computed(() => uc.value.post)

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()

const loading = vue.ref(false)

const postHtml = vue.ref<string>()
const bodyMarkdown = vue.computed(() => {
  return uc.value.post?.bodyMarkdown ?? `# Lorem Ipsum

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Subsection

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Subsubsection

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

- Item 1
- Item 2
- Item 3

#### Another Subsubsection

1. First ordered list item
2. Another item
   - Unordered sub-list
3. Actual numbers don't matter, just that it's a number
   1. Ordered sub-list
4. And another item.

##### Small Section

*You can use italic or bold text here.*

> Blockquote: Excepteur sint occaecat cupidatat non proident,`
})

const activeMenu = vue.computed<NavGroup[]>(() => {
  const currentPath = factorRouter.current.value.path
  const menu = uc.value.menu ?? []
  return menu.map((g) => {
    return {
      ...g,
      menu: g.items.map((m) => {
        return {
          ...m,
          isActive: m.href === currentPath,
        }
      }),
    }
  })
})

async function getContent(): Promise<void> {
  if (postHtml.value)
    return

  loading.value = true

  postHtml.value = await renderMarkdown(bodyMarkdown.value)

  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

vue.onMounted(async () => {
  await getContent()
})

unhead.useHead({
  title: vue.computed(() => {
    return (post.value?.title as string) ?? '(No Title)'
  }),
  meta: [
    {
      key: 'description',
      name: `description`,
      content: vue.computed(() => post.value?.excerpt ?? ''),
    },
    {
      key: 'og:title',
      property: `og:title`,
      content: vue.computed(() => post.value?.title || ''),
    },
    {
      key: 'og:image',
      property: `og:image`,
      content: vue.computed(() => post.value?.imageUrl ?? ''),
    },
    { property: `og:type`, content: 'article' },
    {
      property: 'article:published_time',
      content: dayjs(post.value?.publishedAt as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: vue.computed(() => post.value?.authorName || ''),
    },
  ],
})
</script>

<template>
  <div class="flex w-full">
    <div class="doc-selector min-h-screen min-w-0 flex-auto p-4 sm:p-6 lg:p-16">
      <div v-if="loading" class="p-12">
        <ElSpinner class="text-theme-200 m-auto h-12 w-12" />
      </div>

      <div v-else>
        <h1 class="x-font-title mb-12 pb-6 text-center text-5xl font-bold">
          {{ post?.title || "No Title" }}
        </h1>
        <div class="justify-center gap-12 lg:grid grid-cols-9">
          <div class="col-span-2">
            <div class="mb-8 max-w-64">
              <ElNavMenu :menu="activeMenu" />
            </div>
          </div>
          <HighlightCode class="shadow-none col-span-5">
            <div class="entry m-auto max-w-prose  ">
              <div class="toc-content entry" v-html="postHtml" />
            </div>
          </HighlightCode>
          <div class="max-w-64 flex-none  xl:text-sm col-span-2">
            <EntryToc selector=".toc-content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "@fiction/ui/entry.less";
</style>
