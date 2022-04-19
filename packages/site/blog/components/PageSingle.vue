<template>
  <div>
    <div class="mb-4 lg:mb-12">
      <h1 class="mb-8">
        <span
          v-if="config.publishDate"
          class="block text-center text-base font-semibold uppercase tracking-wide text-slate-500 xl:text-lg"
          >{{ dayjs(config.publishDate).format("MMM DD, YYYY") }}</span
        >
        <span
          class="mt-4 block text-center text-3xl font-extrabold leading-8 tracking-tight sm:text-4xl xl:text-6xl"
          >{{ config.title }}</span
        >
      </h1>
      <div
        class="block items-center justify-center space-x-4 py-1 lg:flex lg:py-4 lg:text-lg"
      >
        <div class="author flex items-center justify-center space-x-4">
          <ElAvatar
            class="inline-block h-8 w-8 rounded-full"
            :email="config.authorEmail"
          />
          <span class="font-medium">
            {{ config.authorName }}
          </span>

          <a
            v-if="config.authorTwitter"
            class="text-slate-500 hover:text-primary-500"
            :href="`https://www.twitter.com/${config.authorTwitter}`"
            target="_blank"
            >@{{ config.authorTwitter }}</a
          >
        </div>
        <div class="date flex items-center justify-center space-x-4">
          <span class="italic text-slate-500">on</span>
          <time
            class="font-medium"
            itemprop="datePublished"
            :datetime="dayjs(config.publishDate).toISOString()"
          >
            {{ dayjs(config.publishDate).format("MMM DD, YYYY") }}
          </time>
        </div>
      </div>
    </div>
    <div class="grid-cols-12 gap-8 lg:grid">
      <div class="col-span-2">
        <div
          class="mx-4 my-10 rounded-md border border-slate-200 p-4 text-center lg:mx-0 lg:mt-0 lg:text-right"
        >
          <h4 class="mb-1 font-semibold">About FactorJS</h4>
          <div class="text-sm text-slate-500">
            FactorJS is a next-generationframework for sites and apps.
          </div>
          <a
            class="mt-2 block text-sm text-primary-500"
            href="http://www.factorjs.org"
            >Learn More &rarr;</a
          >
        </div>
      </div>
      <div class="col-span-8">
        <div v-if="loading" class="p-12">
          <ElSpinner class="m-auto h-12 w-12 text-slate-200" />
        </div>
        <div v-else-if="!config.component">
          <div class="py-40">
            <div class="text-center">
              <h1
                class="my-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
              >
                404 Not Found
              </h1>
              <p class="mt-2 text-base text-slate-500">
                We couldn’t find the page you’re looking for.
              </p>
              <div class="mt-6">
                <router-link
                  :to="baseRoute"
                  class="text-base font-medium text-primary-600 hover:text-primary-500"
                  >Back to Index
                  <span aria-hidden="true"> &rarr;</span></router-link
                >
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <div class="mx-auto mb-32 max-w-prose px-4 text-lg lg:px-6">
            <div class="toc-content entry">
              <component :is="config.component" />
            </div>
            <div>
              <div class="mx-auto my-12 max-w-7xl bg-color-50 p-6 md:p-12">
                <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span class="block text-slate-500"
                    >Hope you enjoyed this post.</span
                  >
                  <span class="block font-bold"
                    >Ready for the future of web dev?</span
                  >
                </h2>
                <div class="mt-8 flex space-x-4">
                  <ElButton href="https://www.factorjs.org" btn="primary"
                    >Learn More</ElButton
                  >
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

<script lang="ts" setup>
import ElButton from "@factor/ui/ElButton.vue"
import ElAvatar from "@factor/ui/ElAvatar.vue"
import { useMeta } from "@factor/api"
import { useRouter } from "vue-router"
import ElSpinner from "@factor/ui/ElSpinner.vue"
import { ref, computed, onServerPrefetch } from "vue"
import { PostEntryConfig } from "@factor/plugin-blog-engine/types"
import { blogPlugin } from "@factor/site"
import EntryToc from "@factor/ui/EntryToc.vue"
import dayjs from "dayjs"
const baseRoute = ref(blogPlugin.setting("baseRoute"))
const router = useRouter()
const loading = ref(false)
const config = ref<PostEntryConfig>({ attributes: {} })
const at = computed<PostEntryConfig>(() => {
  return {
    publishDate: "2021-01-01",
    title: "",
    description: "",
    postImage: "",
    authorName: "Andrew Powers",
    readingMinutes: 1,
    ...config.value.attributes,
  }
})

const getContent = async (): Promise<void> => {
  loading.value = true

  const slug = router.currentRoute.value.params.slug as string | undefined

  const c = await blogPlugin.getPostConfig(slug)

  config.value = c || { attributes: {} }

  loading.value = false
}

onServerPrefetch(async () => {
  await getContent()
})

getContent().catch((error) => console.error(error))

useMeta({
  title: computed(() => {
    return (at.value.title as string) ?? "Blog"
  }),
  meta: [
    {
      name: `description`,
      content: computed(() => {
        return at.value.description ?? ""
      }),
    },
    {
      property: `og:title`,
      content: computed(() => at.value.title),
    },
    {
      property: `og:image`,
      content: computed(() => {
        return at.value.postImage ?? ""
      }),
    },
    {
      property: `og:type`,
      content: "article",
    },
    {
      property: "article:published_time",
      content: dayjs(at.value.publishDate as string).toISOString(),
    },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:label1", content: "Written by" },
    { name: "twitter:data1", content: computed(() => at.value.authorName) },
    { name: "twitter:label2", content: "Est. reading time" },
    {
      name: "twitter:data2",
      content: computed(() => `${at.value.readingMinutes} minutes`),
    },
  ],
})
</script>
<style lang="less">
@import "@factor/ui/entry.less";
</style>
