<script lang="ts" setup>
import HighlightCode from '@factor/plugin-highlight-code/HighlightCode.vue'
import type {
  FactorRouter,
  MarkdownFile,
  MenuGroup,
  PostOrPage,
} from '@factor/api'
import {
  dayjs,
  fileToPost,
  useMeta,
  useService,
  vue,
} from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import EntryToc from '@factor/ui/EntryToc.vue'
import ElNavMenu from '@factor/ui/ElNavMenu.vue'

const props = defineProps({
  settings: {
    type: Object as vue.PropType<{
      markdownFile: () => Promise<MarkdownFile>
      menu: MenuGroup[]
    }>,
    required: true,
  },
})

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()

const loading = vue.ref(false)

const post = vue.ref<PostOrPage>()

const activeMenu = vue.computed<MenuGroup[]>(() => {
  const currentPath = factorRouter.current.value.path
  return props.settings.menu.map((g) => {
    return {
      ...g,
      menu: g.menu.map((m) => {
        return {
          ...m,
          selected: m.href === currentPath,
        }
      }),
    }
  })
})

async function getContent(): Promise<void> {
  if (post.value)
    return

  loading.value = true

  post.value = await fileToPost(props.settings.markdownFile)

  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

vue.onMounted(async () => {
  await getContent()
})

useMeta({
  title: vue.computed(() => {
    return (post.value?.title as string) ?? '(No Title)'
  }),
  meta: [
    {
      key: 'description',
      name: `description`,
      content: vue.computed(() => {
        return post.value?.excerpt ?? ''
      }),
    },
    {
      key: 'og:title',
      property: `og:title`,
      content: vue.computed(() => post.value?.title || ''),
    },
    {
      key: 'og:image',
      property: `og:image`,
      content: vue.computed(() => {
        return post.value?.image?.url ?? ''
      }),
    },
    {
      property: `og:type`,
      content: 'article',
    },
    {
      property: 'article:published_time',
      content: dayjs(post.value?.publishedAt as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: vue.computed(() => post.value?.author?.name || ''),
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
        <h1 class="ui-font-title mb-12 pb-6 text-center text-5xl font-bold">
          {{ post?.title }}
        </h1>
        <div class="justify-center gap-12 lg:flex">
          <div class="mx-auto mb-8 w-64">
            <ElNavMenu :menu="activeMenu" />
          </div>
          <HighlightCode v-if="post" class="shadow-none">
            <div class="entry m-auto max-w-prose lg:px-6">
              <div class="toc-content entry" v-html="post.bodyHtml" />
            </div>
          </HighlightCode>
          <div class="mr-8 hidden w-64 flex-none pl-8 xl:block xl:text-sm">
            <EntryToc selector=".toc-content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "@factor/ui/entry.less";
</style>
