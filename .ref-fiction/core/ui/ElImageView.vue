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
import { RenderImage } from '../plugin-models/model'
import type { FictionModel } from '../plugin-models'
import ContentBox from './ContentBox.vue'
import ElCta from './ElCta.vue'
import ElImage from './ElImage.vue'

const { factorRouter, fictionModel } = useService<{
  factorRouter: FactorRouter
  fictionModel: FictionModel
}>()

const loading = vue.ref(false)
const image = vue.shallowRef<RenderImage>()
const routeImageId = vue.computed(() => {
  return factorRouter.params.value.imageId as string | undefined
})

async function getContent(): Promise<void> {
  loading.value = true
  const imageId = routeImageId.value as string
  const r = await fictionModel.requests.ManageImage.request({
    _action: 'retrieve',
    imageConfig: { imageId },
  })

  if (r.status === 'success' && r.data)
    image.value = new RenderImage({ fictionModel, ...r.data })

  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

vue.onMounted(async () => {
  await getContent()
})

const author = vue.computed(() => {
  return image.value?.author || {}
})

const title = vue.computed(() => {
  const byLine = author.value?.username ? `by ${author.value?.username} ` : ''
  return image.value?.title || `AI Generated Image ${byLine}- Fiction`
})

const description = vue.computed(() => {
  return (
    image.value?.description
    || `Create professional AI generated images with Fiction`
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
        return image.value?.url
      }),
    },
    {
      property: `og:type`,
      content: 'image',
    },
    {
      property: 'image:published_time',
      content: dayjs(image.value?.createdAt as string).toISOString(),
    },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:label1', content: 'Written by' },
    {
      name: 'twitter:data1',
      content: vue.computed(() => image.value?.author?.username),
    },
  ],
})
</script>

<template>
  <div class="my-12 min-h-[40vh] p-4">
    <div
      v-if="loading"
      class="text-theme-300 inset-0 flex h-full w-full flex-col items-center justify-center"
    >
      <ElSpinner class="h-10 w-10" />
    </div>
    <div v-else-if="image" class="mx-auto max-w-screen-md space-y-12">
      <ContentBox wrap-class="p-10 pb-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="grow">
            <h1 class=" ">
              <span class="block text-xl font-extrabold tracking-tight">{{
                image.title || "Untitled"
              }}</span>
            </h1>
          </div>
          <div class="block items-center justify-center space-x-4 lg:flex">
            <div
              v-if="image.author"
              class="author flex items-center justify-center space-x-4"
            >
              <ElAvatar
                class="inline-block h-6 w-6 rounded-full"
                :email="image.author?.email"
              />
              <span class="font-medium">
                {{ image.author?.username || image.author?.fullName }}
              </span>

              <a
                v-if="image.author?.twitter"
                class="hover:text-primary-500 text-slate-500"
                :href="`https://www.twitter.com/${image.author?.twitter}`"
                target="_blank"
              >@{{ image.author?.twitter }}</a>
            </div>
          </div>
        </div>
        <ElImage :image="image" />
        <div class="mt-4">
          <div
            class="date text-theme-400 flex items-center justify-center space-x-2 text-xs font-medium"
          >
            <span class="">Created</span>
            <time
              class=""
              itemprop="datePublished"
              :datetime="dayjs(image.createdAt).toISOString()"
            >
              {{ standardDate(image.createdAt) }}
            </time>
          </div>
        </div>
      </ContentBox>

      <ElCta />
      <div class="col-span-6">
        <div />
      </div>
    </div>
    <ElZeroState
      v-else
      title="404! Not Found..."
      sub-title="The media you're looking for is missing."
    />
  </div>
</template>
