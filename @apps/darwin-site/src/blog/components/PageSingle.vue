<template>
  <div>
    <div class="mb-4 lg:mb-12">
      <h1 class="mb-8">
        <span
          v-if="config.publishDate"
          class="
            block
            text-base text-center text-bluegray-500
            font-semibold
            tracking-wide
            uppercase
            xl:text-lg
          "
          >{{ dayjs(config.publishDate).format("MMM DD, YYYY") }}</span
        >
        <span
          class="
            mt-4
            block
            text-3xl text-center
            leading-8
            font-extrabold
            tracking-tight
            sm:text-4xl
            xl:text-6xl
          "
          >{{ config.title }}</span
        >
      </h1>
      <div
        class="
          py-1
          lg:py-4
          block
          justify-center
          items-center
          space-x-4
          lg:flex lg:text-lg
        "
      >
        <div class="author flex justify-center items-center space-x-4">
          <ElemAvatar
            class="inline-block h-8 w-8 rounded-full"
            :email="config.authorEmail"
          />
          <span class="font-medium">
            {{ config.authorName }}
          </span>

          <a
            v-if="config.authorTwitter"
            class="text-bluegray-500 hover:text-primary-500"
            :href="`https://www.twitter.com/${config.authorTwitter}`"
            target="_blank"
            >@{{ config.authorTwitter }}</a
          >
        </div>
        <div class="date flex justify-center items-center space-x-4">
          <span class="italic text-bluegray-500">on</span>
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
    <div class="lg:grid grid-cols-12 gap-8">
      <div class="col-span-2">
        <div
          class="
            mb-10
            mt-10
            mx-4
            border border-bluegray-200
            text-center
            lg:mx-0 lg:mt-0 lg:text-right
            p-4
            rounded-md
          "
        >
          <h4 class="font-semibold mb-1">About Darwin</h4>
          <div class="text-sm text-bluegray-500">
            A marketing + analytics platform for startups and developers.
          </div>
          <a
            class="text-sm block text-primary-500 mt-2"
            href="http://www.darwin.so"
            >Learn More &rarr;</a
          >
        </div>
      </div>
      <div class="col-span-8">
        <div v-if="loading" class="p-12">
          <ElemSpinner class="text-bluegray-200 w-12 h-12 m-auto" />
        </div>
        <div v-else-if="!config.component">
          <div class="py-40">
            <div class="text-center">
              <h1
                class="my-4 text-4xl font-extrabold tracking-tight sm:text-5xl"
              >
                404 Not Found
              </h1>
              <p class="mt-2 text-base text-bluegray-500">
                We couldn’t find the page you’re looking for.
              </p>
              <div class="mt-6">
                <router-link
                  :to="baseRoute"
                  class="
                    text-base
                    font-medium
                    text-primary-600
                    hover:text-primary-500
                  "
                  >Back to Index
                  <span aria-hidden="true"> &rarr;</span></router-link
                >
              </div>
            </div>
          </div>
        </div>
        <template v-else>
          <div class="text-lg max-w-prose mx-auto mb-32 px-4 lg:px-6">
            <div class="toc-content entry">
              <component :is="config.component" />
            </div>
            <div>
              <div class="max-w-7xl mx-auto py-6 md:py-12">
                <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span class="block text-bluegray-500"
                    >Hope you enjoyed this post.</span
                  >
                  <span class="block"
                    >Ready to take your business to the next level?</span
                  >
                </h2>
                <div class="mt-8 flex space-x-4">
                  <ElemButton href="https://www.darwin.so" btn="primary"
                    >Learn More</ElemButton
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

<script lang="ts">
import ElemButton from "@factor/ui/ElemButton.vue"
import ElemAvatar from "@factor/ui/ElemAvatar.vue"
import { useMeta, camelize } from "@factor/api"
import { useRouter } from "vue-router"
import ElemSpinner from "@factor/ui/ElemSpinner.vue"
import { ref, computed, onServerPrefetch } from "vue"
import { PostEntryConfig } from "@factor/plugin-blog-engine/types"
import { blogSetting, getPostConfig } from "@factor/plugin-blog-engine/helpers"
import EntryToc from "@factor/ui/EntryToc.vue"
import dayjs from "dayjs"
export default {
  components: {
    ElemSpinner,
    EntryToc,
    ElemAvatar,
    ElemButton,
  },
  setup() {
    const baseRoute = ref(blogSetting("baseRoute"))
    const router = useRouter()
    const loading = ref(false)
    const nav = ref(blogSetting("map"))
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

    const docId = computed<string | undefined>(() => {
      const params = router.currentRoute.value.params
      const id = camelize(params.postSlug as string)

      return id
    })

    const subHeaders = computed(() => {
      return config.value.attributes || {}
    })

    const getContent = async (): Promise<void> => {
      loading.value = true

      const c = await getPostConfig(docId.value)

      config.value = c || { attributes: {} }

      loading.value = false
    }

    onServerPrefetch(async () => {
      await getContent()
    })

    getContent()

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

    return { nav, config, loading, subHeaders, getContent, dayjs, baseRoute }
  },
}
</script>
<style lang="less">
@import "@factor/ui/entry.less";
</style>
