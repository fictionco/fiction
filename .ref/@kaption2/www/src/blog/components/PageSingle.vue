<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import { camelize, useMeta } from '@factor/api'
import { useRouter } from 'vue-router'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { computed, onServerPrefetch, ref } from 'vue'
import type { PostEntryConfig } from '@factor/plugin-blog-engine'
import EntryToc from '@factor/ui/EntryToc.vue'
import dayjs from 'dayjs'
import { useSiteService } from '../../inject'

const { factorBlog } = useSiteService()
const baseRoute = ref(factorBlog.settings.baseRoute)
const router = useRouter()
const loading = ref(false)
const config = ref<PostEntryConfig>({ attributes: {} })
const at = computed<PostEntryConfig>(() => {
  return {
    publishDate: '2021-01-01',
    title: '',
    description: '',
    postImage: '',
    authorName: 'Andrew Powers',
    readingMinutes: 1,
    ...config.value.attributes,
  }
})

const slug = computed<string | undefined>(() => {
  const params = router.currentRoute.value.params
  const id = camelize(params.slug as string)

  return id
})

async function getContent(): Promise<void> {
  loading.value = true

  const c = await factorBlog.getPostConfig(slug.value)

  config.value = c || { attributes: {} }

  loading.value = false
}

onServerPrefetch(async () => {
  await getContent()
})

getContent().catch(error => console.error(error))

useMeta({
  title: computed(() => {
    return (at.value.title as string) ?? 'Blog'
  }),
  meta: [
    {
      name: `description`,
      content: computed(() => {
        return at.value.description ?? ''
      }),
    },
    {
      property: `og:title`,
      content: computed(() => at.value.title || ''),
    },
    {
      property: `og:image`,
      content: computed(() => {
        return at.value.postImage ?? ''
      }),
    },
    {
      property: `og:type`,
      content: 'article',
    },
    {
      property: 'article:published_time',
      content: dayjs(at.value.publishDate as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: computed(() => at.value.authorName || ''),
    },
    { name: 'twitter:label2', content: 'Est. reading time' },
    {
      name: 'twitter:data2',
      content: computed(() => `${at.value.readingMinutes} minutes`),
    },
  ],
})
</script>

<template>
  <div class="my-32">
    <div class="grid-cols-12 gap-16 lg:grid">
      <div class="col-span-2">
        <div
          class="mx-4 my-10 rounded-md border border-slate-200 p-4 text-center lg:mx-0 lg:mt-0 lg:text-right"
        >
          <h4 class="mb-1 font-semibold">
            About Kaption
          </h4>
          <div class="text-sm text-theme-500">
            CX analytics and feedback tools.
          </div>
          <a
            class="text-primary-500 mt-2 block text-sm"
            href="http://www.kaption.co"
          >Learn More &rarr;</a>
        </div>
      </div>
      <div class="col-span-8">
        <div v-if="loading" class="p-12">
          <ElSpinner class="m-auto h-12 w-12 text-theme-200" />
        </div>
        <div v-else-if="!config.component">
          <div class="py-40">
            <div class="text-center">
              <h1
                class="my-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
              >
                404 Not Found
              </h1>
              <p class="mt-2 text-base text-theme-500">
                We couldn't find the page you're looking for.
              </p>
              <div class="mt-6">
                <router-link
                  :to="baseRoute ?? '/'"
                  class="text-primary-600 hover:text-primary-500 text-base font-medium"
                >
                  Back <span aria-hidden="true"> &rarr;</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <div class="mx-auto mb-32 px-4 lg:px-6">
            <div class="mb-4 lg:mb-12">
              <div class="flex items-center justify-between py-1 lg:py-4">
                <div
                  v-if="config.publishDate"
                  class="date flex items-center justify-center space-x-4"
                >
                  <time
                    class="font-bold"
                    itemprop="datePublished"
                    :datetime="dayjs(config.publishDate).toISOString()"
                  >
                    {{ dayjs(config.publishDate).format("MMM DD, YYYY") }}
                  </time>
                </div>

                <router-link
                  :to="baseRoute ?? '/'"
                  class="text-primary-600 hover:text-primary-500 text-base font-medium"
                >
                  All Posts &rarr;
                </router-link>
              </div>

              <h1 class="mt-4 mb-8 block text-3xl font-bold sm:text-5xl">
                {{ config.title }}
              </h1>
              <div
                v-if="config.authorEmail"
                class="author flex items-center space-x-4"
              >
                <ElAvatar
                  class="inline-block h-8 w-8 rounded-full"
                  :email="config.authorEmail"
                />

                <a
                  v-if="config.authorTwitter"
                  class="hover:text-primary-500 font-bold"
                  :href="`https://www.twitter.com/${config.authorTwitter}`"
                  target="_blank"
                >
                  {{ config.authorName }}</a>
                <span v-else class="font-bold">
                  {{ config.authorName }}
                </span>
              </div>
            </div>
            <div class="toc-content entry">
              <component :is="config.component" />
            </div>
            <div>
              <div class="mx-auto max-w-7xl py-6 md:py-12">
                <h2 class="text-2xl font-semibold sm:text-3xl">
                  <span class="mb-3 block text-theme-500">Hope you enjoyed this post.</span>
                  <span class="block">Check out Kaption to learn more about optimizing your
                    customer experience.
                  </span>
                </h2>
                <div class="mt-8 flex space-x-4">
                  <ElButton href="https://www.kaption.co" btn="primary">
                    About Kaption &rarr;
                  </ElButton>
                </div>
              </div>

              <div class="comments mt-24">
                <div id="disqus_thread" />
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="hidden lg:col-span-2 lg:block">
        <EntryToc selector=".toc-content" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "@factor/ui/entry.less";
</style>
