<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import { dayjs, useMeta, useService, vue, vueRouter } from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import EntryToc from '@factor/ui/EntryToc.vue'
import type { FactorBlog, PostOrPage } from '@factor/plugin-blog-engine'
import PageWrap from '../../PageWrap.vue'

const { factorBlog } = useService<{ factorBlog: FactorBlog }>()
const baseRoute = vue.ref(factorBlog.settings.baseRoute)
const router = vueRouter.useRouter()
const loading = vue.ref(false)
const config = vue.ref<PostOrPage>()

async function getContent(): Promise<void> {
  loading.value = true

  const slug = router.currentRoute.value.params.slug as string | undefined

  const c = await factorBlog.getGhostPost(slug)

  config.value = c
  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

getContent().catch(error => console.error(error))

useMeta({
  title: vue.computed(() => {
    return (config.value?.title as string) ?? 'Blog'
  }),
  meta: [
    {
      name: `description`,
      content: vue.computed(() => {
        return config.value?.excerpt ?? ''
      }),
    },
    {
      property: `og:title`,
      content: vue.computed(() => config.value?.og_title || ''),
    },
    {
      property: `og:image`,
      content: vue.computed(() => {
        return config.value?.og_image ?? ''
      }),
    },
    {
      property: `og:type`,
      content: 'article',
    },
    {
      property: 'article:published_time',
      content: dayjs(config.value?.published_at as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: vue.computed(() => config.value?.primary_author?.name || ''),
    },
    { name: 'twitter:label2', content: 'Est. reading time' },
    {
      name: 'twitter:data2',
      content: vue.computed(() => `${config.value?.reading_time} minutes`),
    },
  ],
})
</script>

<template>
  <PageWrap mode="bar">
    <div class="bg-theme-0 py-12">
      <div class="relative z-20 mx-auto max-w-screen-xl">
        <div class="grid-cols-12 gap-12 lg:grid">
          <div class="col-span-2 pt-20">
            <div class="author flex items-center justify-center space-x-4">
              <ElAvatar
                class="inline-block h-8 w-8 rounded-full"
                :url="config?.primary_author?.profile_image ?? ''"
              />
              <div>
                <div class="font-medium">
                  {{ config?.primary_author?.name }}
                </div>

                <a
                  v-if="config?.primary_author?.twitter"
                  class="hover:text-primary-500 text-theme-500 block"
                  :href="`https://www.twitter.com/${config?.primary_author?.twitter}`"
                  target="_blank"
                >{{ config?.primary_author?.twitter }}</a>
              </div>
            </div>
          </div>
          <div class="col-span-8">
            <div v-if="loading" class="p-12">
              <ElSpinner class="text-theme-200 m-auto h-12 w-12" />
            </div>
            <div v-else-if="!config?.html">
              <div class="py-40">
                <div class="text-center">
                  <h1
                    class="my-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
                  >
                    404 Not Found
                  </h1>
                  <p class="text-theme-500 mt-2 text-base">
                    We couldn’t find the page you’re looking for.
                  </p>
                  <div class="mt-6">
                    <router-link
                      :to="baseRoute ?? '/'"
                      class="text-primary-600 hover:text-primary-500 text-base font-medium"
                    >
                      Back to Index
                      <span aria-hidden="true"> &rarr;</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            <template v-else>
              <div class="mx-auto mb-32 max-w-prose px-4 text-lg lg:px-6">
                <div class="text-theme-400 text-xs">
                  <RouterLink to="/blog" class="text-theme-700">
                    Back to Blog Index
                  </RouterLink>
                  &middot; Reading Time &rarr;
                  {{ config?.reading_time }} Minutes
                </div>
                <h1 class="mx-auto mb-8 mt-16 text-left">
                  <span
                    class="block text-3xl font-bold leading-tight sm:text-5xl"
                  >{{ config?.title }}</span>
                </h1>
                <div v-if="config?.feature_image" class="mb-16 mt-12">
                  <img :src="config?.feature_image" class="rounded-xl">
                </div>
                <div class="toc-content entry" v-html="config?.html" />
                <div
                  v-if="config?.published_at"
                  class="text-theme-500 my-12 block text-xs font-bold uppercase tracking-wide"
                >
                  Last Updated &mdash;
                  {{ dayjs(config.published_at).format("MMM DD, YYYY") }}
                </div>
                <div>
                  <div
                    class="from-theme-800 to-theme-950 border-theme-200 text-theme-0 mx-auto my-24 max-w-7xl rounded-xl bg-gradient-to-br py-6 md:py-24"
                  >
                    <h2 class="text-center text-2xl font-semibold sm:text-3xl">
                      <span class="font-cal block">Thanks for Reading</span>
                    </h2>
                    <div class="mt-8 flex justify-center space-x-4">
                      <ElButton href="/" btn="primary">
                        Learn More About Supereon
                      </ElButton>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="hidden pt-20 lg:col-span-2 lg:block">
            <EntryToc selector=".toc-content" />
          </div>
        </div>
      </div>
    </div>
  </PageWrap>
</template>

<style lang="less">
@import "@factor/ui/entry.less";
</style>
