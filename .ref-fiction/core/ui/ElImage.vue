<script lang="ts" setup>
import type {
  ListItem,
} from '@factor/api'
import {
  notify,
  onResetUi,
  resetUi,
  shortId,
  vue,
  waitFor,
} from '@factor/api'
import DropDownList from '@factor/ui/DropDownList.vue'
import * as bh from 'blurhash'
import { useFictionApp } from '../util'
import type { Collection, RenderImage } from '../plugin-models/model'
import ElQuickCollection from './ElQuickCollection.vue'
import ElImageButton from './ElImageButton.vue'

const props = defineProps({
  image: {
    type: Object as vue.PropType<RenderImage>,
    required: true,
  },
  mode: {
    type: String as vue.PropType<'display' | 'full'>,
    default: 'full',
  },
})
const { factorRouter, fictionModel, factorUser } = useFictionApp()
const blurCanvas = vue.ref()
const theImageEl = vue.ref<HTMLImageElement>()
const copyUrlEl = vue.ref<HTMLInputElement>()
const activeUser = vue.computed(() => factorUser.activeUser.value)

const loading = vue.ref('')
const loadingImage = vue.ref(true)
const isLiked = vue.ref(false)
const dropdownVisible = vue.ref()
const collections = vue.shallowRef<Collection[]>([])

async function dropdown(args: { mode: string, imageId: string }) {
  const { mode } = args
  resetUi({ cause: 'dropdown', scope: 'inputs' })

  dropdownVisible.value = mode

  if (mode === 'collection')
    await getCollections()
}

async function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', (...args) => reject(args))
    img.src = src
  })
}

onResetUi(() => {
  dropdownVisible.value = ''
})

vue.onMounted(async () => {
  vue.watch(
    () => props.image,
    (val) => {
      isLiked.value = val.isLiked.value || false
    },
    { immediate: true },
  )

  vue.watch(
    () => props.image?.url,
    async (url) => {
      loadingImage.value = true
      if (url) {
        await loadImage(url)
        loadingImage.value = false
      }
      else {
        loadingImage.value = false
      }
    },
    { immediate: true },
  )

  const { blurhash, width, height } = props.image || {}
  if (blurhash && width && height) {
    const pixels = bh.decode(blurhash, 64, 64)

    const blurCanvasEl = blurCanvas.value as HTMLCanvasElement
    const ctx = blurCanvasEl.getContext('2d')
    const imageData = ctx?.createImageData(64, 64)
    imageData?.data.set(pixels)
    if (imageData && ctx)
      ctx.putImageData(imageData, 0, 0)
  }
})
async function toggleFavorite() {
  const imageId = props.image.imageId

  if (!activeUser.value) {
    const currentUrl = window.location.href
    location.href = `https://studio.fiction.com/login?redirect=${currentUrl}`
    return
  }

  loading.value = 'favorite'
  await fictionModel.requests.ManageLikes.projectRequest({
    _action: isLiked.value ? 'unlike' : 'like',
    imageId,
  })

  isLiked.value = !isLiked.value
  loading.value = ''
}

async function getCollections() {
  loading.value = 'collection'
  const r = await fictionModel.requestIndex({
    table: 'collection',
    imageId: props.image.imageId,
  })

  loading.value = ''

  collections.value = r.items || []
}

async function copyUrl(): Promise<void> {
  if (!copyUrlEl.value)
    return

  copyUrlEl.value.setAttribute('type', 'text')
  copyUrlEl.value.select()

  document.execCommand('copy')

  copyUrlEl.value.setAttribute('type', 'hidden')

  notify.info('url copied to clipboard')
}

function moreList(image: RenderImage): ListItem[] {
  return [
    {
      name: 'Copy Image URL',
      icon: 'i-heroicons-link',
      value: 'copy',
      callback: async () => {
        await copyUrl()
      },
    },

    {
      name: 'Download Image',
      icon: 'i-heroicons-arrow-down-tray',
      value: 'download',
      callback: () => downloadImage(),
    },
    {
      name:
        image.showcaseStatus.value === 'requested'
          ? 'Showcase Requested'
          : 'Submit to Showcase',
      icon:
        image.showcaseStatus.value === 'requested'
          ? 'i-heroicons-check'
          : image.showcaseStatus.value === 'ready'
            ? 'i-heroicons-sparkles'
            : 'i-heroicons-star',
      value: 'showcase',
      isDisabled: image.showcaseStatus.value === 'requested',
      isHidden: !activeUser.value?.organizations?.find(
        o => o.organizationId === image.organizationId,
      ),
      callback: async () => {
        const r = await fictionModel.requests.ManageImage.projectRequest({
          _action: 'update',
          message: 'submitted to showcase',
          imageConfig: {
            imageId: props.image.imageId,
            showcaseStatus: 'requested',
          },
        })

        if (r.status === 'success')
          image.showcaseStatus.value = 'requested'
      },
    },
  ]
}

function collectionList(): ListItem[] {
  const imageId = props.image.imageId

  const c = collections.value.map((c) => {
    return {
      name: c.title.value,
      frontIcon: c.hasMediaItem.value ? 'i-heroicons-check-circle' : undefined,
      actions: [
        {
          name: c.hasMediaItem.value
            ? 'Remove from Collection'
            : 'Add to Collection',
          icon: c.hasMediaItem.value
            ? 'i-heroicons-x-mark'
            : 'i-heroicons-plus',
          callback: async () => {
            loading.value = 'collection'
            await fictionModel.requests.ManageCollection.projectRequest({
              _action: c.hasMediaItem.value ? 'removeMedia' : 'addMedia',
              config: { collectionId: c.collectionId },
              imageIds: [imageId],
            })
            await getCollections()
            notify.success('added to collection')
            loading.value = ''
          },
        },
        {
          name: 'Edit Collection',
          icon: 'i-heroicons-pencil',
          callback: async () => {
            await factorRouter.goto('collectionEdit', {
              collectionId: c.collectionId,
            })
          },
        },
        {
          name: 'Go to Collection URL',
          icon: 'i-heroicons-link',
          callback: async () => {
            const u = c.url.value
            if (location.href !== u)
              window.open(u, '_blank')
          },
        },
      ],
      value: c.collectionId,

      callback: async () => {
        loading.value = 'collection'
        await fictionModel.requests.ManageCollection.projectRequest({
          _action: c.hasMediaItem.value ? 'removeMedia' : 'addMedia',
          config: { collectionId: c.collectionId },
          imageIds: [imageId],
        })
        await getCollections()
        notify.success('added to collection')
        loading.value = ''
      },
    }
  })

  return [
    ...c,
    { value: 'divider' },
    {
      name: 'Create New Collection',
      value: 'new',
      component: ElQuickCollection,
      callback: async () => {
        await factorRouter.goto('collectionEdit', { collectionId: '' })
      },
    },
  ]
}

async function imageLink(_image?: RenderImage) {
  // if (!image) return

  // if (location.href !== image.pageUrl.value) {
  //   window.open(image.pageUrl.value, "_blank")
  // }

  await copyUrl()
}

async function downloadImage() {
  const url = props.image.url

  if (!url)
    return
  loading.value = 'download'
  await waitFor(100)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.addEventListener('load', () => {
    canvas.width = img.width
    canvas.height = img.height
    if (!ctx)
      return
    ctx.drawImage(img, 0, 0)
    const pngURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `fiction-image-${shortId()}.png`
    link.href = pngURL
    link.click()
  })
  img.src = url
  loading.value = ''
}
</script>

<template>
  <div
    class="image-item group relative cursor-pointer rounded-lg transition-all hover:scale-[1.02] focus:scale-90"
    :class="dropdownVisible ? 'z-30' : 'hover:z-20'"
    @click="dropdownVisible = undefined"
  >
    <div
      class="image-overlay line-clamp pointer-events-none absolute inset-0 z-10 block rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
      style=""
    />
    <div
      v-if="mode === 'full'"
      class="absolute inset-0 z-20 flex w-full flex-col text-xs text-zinc-100 opacity-0 transition-opacity group-hover:opacity-100"
      :class="dropdownVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div class="top flex grow justify-between p-2 pb-0">
        <ElImageButton
          v-if="image.url"
          icon="i-heroicons-ellipsis-horizontal"
          :dropdown-visible="dropdownVisible === 'more'"
          dropdown-direction="right"
          @click.stop="dropdown({ mode: 'more', imageId: image.imageId })"
        >
          <DropDownList
            :loading="
              moreList(image)
                .map((_) => _.value)
                .includes(loading)
            "
            :list="moreList(image)"
            @select="$event.callback && $event.callback()"
          />
        </ElImageButton>
        <div class="flex flex-col space-y-2">
          <ElImageButton
            v-if="image.imageId"
            :loading="loading === 'favorite'"
            :icon="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            @click.stop="toggleFavorite()"
          />
          <ElImageButton
            icon="i-heroicons-link"
            title="Copy image link"
            :href="image.pageUrl.value"
            @click.stop.prevent="imageLink(image)"
          />
          <ElImageButton
            v-if="activeUser"
            icon="i-heroicons-bookmark"
            :dropdown-visible="dropdownVisible === 'collection'"
            dropdown-direction="left"
            @click.stop="
              dropdown({ mode: 'collection', imageId: image.imageId })
            "
          >
            <DropDownList
              v-if="activeUser"
              :loading="loading === 'collection'"
              :list="collectionList()"
              @select="$event.callback && $event.callback()"
              @update="getCollections()"
            />
          </ElImageButton>
        </div>
      </div>
      <div class="bottom flex shrink-0 items-end justify-between p-2 pt-0">
        <div class="flex h-full shrink items-end">
          <div class="flex flex-col justify-end">
            <p v-if="image.alt" class="p-1.5 text-xs font-medium leading-snug">
              {{ image.alt.slice(0, 30) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition ease duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease duration-200"
      leave-from-class="opacity-100 "
      leave-to-class="opacity-0"
    >
      <canvas
        v-if="loadingImage && image.blurhash"
        ref="blurCanvas"
        class="absolute inset-0 z-10 h-full w-full rounded-lg"
        :data-hash="image.blurhash"
        width="64"
        height="64"
      />
    </transition>
    <img
      ref="theImageEl"
      :src="image.url"
      class="w-full rounded-lg shadow-md"
      :width="image.width"
      :height="image.height"
    >

    <input
      ref="copyUrlEl"
      type="hidden"
      :value="image.pageUrl.value"
    >
  </div>
</template>

<style lang="less" scoped>
.image-overlay {
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.1) 100%
  );
}
</style>
