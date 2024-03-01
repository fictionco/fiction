<script lang="ts" setup>
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type {
  FactorRouter,
} from '@factor/api'
import {
  dayjs,
  standardDate,
  useMeta,
  useService,
  vue,
} from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import ElZeroState from '@factor/ui/ElZeroState.vue'
import { Collection } from '../plugin-models/model'
import type { FictionModel } from '../plugin-models'
import ElCta from './ElCta.vue'
import ElGallery from './ElGallery.vue'
import ContentBox from './ContentBox.vue'

const { factorRouter, fictionModel } = useService<{
  factorRouter: FactorRouter
  fictionModel: FictionModel
}>()

const loading = vue.ref(false)
const collection = vue.shallowRef<Collection>()
const routeCollectionIdOrSlug = vue.computed(() => {
  return factorRouter.params.value.collectionIdOrSlug as string | undefined
})

async function getContent(): Promise<void> {
  loading.value = true
  const v = routeCollectionIdOrSlug.value || ''
  const isSlug = v.startsWith('co') === false
  const config = isSlug ? { slug: v } : { collectionId: v }

  const r = await fictionModel.requests.ManageCollection.request({
    _action: 'retrieve',
    config,
  })

  if (r.status === 'success' && r.data)
    collection.value = new Collection({ fictionModel, ...r.data })

  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

vue.onMounted(async () => {
  await getContent()
})

const author = vue.computed(() => {
  return collection.value?.author || {}
})

const title = vue.computed(() => {
  const byLine = author.value?.username ? `by ${author.value?.username} ` : ''
  return collection.value?.title.value || `Image Collection ${byLine}- Fiction`
})

const description = vue.computed(() => {
  return (
    collection.value?.description.value
    || `Professional AI generated images with Fiction`
  )
})

useMeta({
  title: vue.computed(() => {
    return title.value
  }),
  meta: [
    {
      name: `description`,
      content: vue.computed(() => {
        return description.value
      }),
    },
    {
      key: 'og:title',
      property: `og:title`,
      content: vue.computed(() => title.value),
    },
    {
      key: 'og:image',
      property: `og:image`,
      content: vue.computed(() => {
        return collection.value?.media.value?.[0]?.url
      }),
    },
    {
      property: `og:type`,
      content: 'image',
    },
    {
      property: 'image:published_time',
      content: dayjs(collection.value?.createdAt as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: vue.computed(() => collection.value?.author?.username),
    },
  ],
})
</script>

<template>
  <div class="min-h-[40vh] p-4 lg:p-16">
    <div
      v-if="loading"
      class="text-theme-300 inset-0 flex h-full w-full flex-col items-center justify-center"
    >
      <ElSpinner class="h-10 w-10" />
    </div>
    <div v-else-if="collection" class="mx-auto max-w-screen-xl space-y-12">
      <ContentBox wrap-class="px-8 pt-4 pb-8 md:px-12 md:pt-12 md:pb-16">
        <div class="mb-8 flex items-center justify-between">
          <div class="grow">
            <h1 class=" ">
              <span class="block text-4xl font-extrabold tracking-tight">{{
                collection.title.value || "Untitled"
              }}</span>
            </h1>
            <div class="date text-theme-400 space-x-2 text-base font-semibold">
              <time
                class=" "
                itemprop="datePublished"
                :datetime="dayjs(collection.updatedAt).toISOString()"
              >
                {{ standardDate(collection.updatedAt) }}
              </time>
            </div>
          </div>
          <div class="meta flex items-center justify-center space-x-4">
            <div
              v-if="collection.author"
              class="flex items-center justify-center space-x-4"
            >
              <div class="font-medium">
                <span class="font-extrabold">{{
                  collection.author?.username || collection.author?.fullName
                }}</span>
              </div>
              <ElAvatar
                class="ring-theme-300 inline-block h-8 w-8 rounded-full ring-2"
                :email="collection.author?.email"
              />
            </div>
          </div>
        </div>
        <ElGallery :collection="collection" />
      </ContentBox>
      <ElCta />
    </div>
    <ElZeroState
      v-else
      title="404! Not Found..."
      sub-title="The media you're looking for is missing."
    />
  </div>
</template>
