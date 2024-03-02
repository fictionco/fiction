<script lang="ts" setup>
import { standardDate, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElBadge from '../ui/ElBadge.vue'
import AdminPage from '../plugin-admin/AdminPage.vue'
import { useFictionApp } from '../util'
import type { RenderImage } from '../plugin-models/model'
import { Collection } from '../plugin-models/model'

const { factorRouter, fictionModel } = useFictionApp()
const sending = vue.ref<boolean | string>(false)
const loadingPage = vue.ref<boolean>(true)
const collection = vue.shallowRef<Collection>()

const routeId = vue.computed<string | undefined>({
  get: () => factorRouter.params.value.collectionId as string | undefined,
  set: val =>
    factorRouter.goto(
      'collectionEdit',
      { collectionId: val as string },
      {},
      { navMode: 'replace' },
    ),
})

async function requestItem(collectionId: string): Promise<Collection> {
  const r = await fictionModel.requests.ManageCollection.projectRequest({
    _action: 'retrieve',
    config: { collectionId },
  })

  return new Collection({ fictionModel, collectionId, ...r.data })
}

async function removeImage(image: RenderImage) {
  if (!collection.value)
    return
  const r = await fictionModel.requests.ManageCollection.projectRequest({
    _action: 'removeMedia',
    config: { collectionId: collection.value.collectionId },
    imageIds: [image.imageId],
  })

  if (r.status === 'success') {
    collection.value.media.value = collection.value.media.value.filter(
      i => i.imageId !== image.imageId,
    )
  }
}

vue.onMounted(async () => {
  loadingPage.value = false

  vue.watch(
    () => routeId.value,
    async (val) => {
      if (val)
        collection.value = await requestItem(val)
    },
    { immediate: true },
  )

  if (!routeId.value) {
    collection.value = new Collection({ fictionModel })
    routeId.value = collection.value.collectionId
  }
})

async function send(context: string): Promise<void> {
  sending.value = context

  const config = collection.value?.toConfig()

  const r = await fictionModel.requests.ManageCollection.projectRequest({
    _action: 'update',
    config,
  })

  if (r.data)
    collection.value = new Collection({ fictionModel, ...r.data })

  sending.value = false
}
</script>

<template>
  <AdminPage title="Collections" :loading="loadingPage">
    <ElPanel title="Edit Collection">
      <div class="pb-12">
        <div
          v-if="collection"
          class="border-theme-200 mb-12 flex items-center justify-between border-b pb-4"
        >
          <div>
            <div class="text-xl font-extrabold">
              {{ collection.title.value || "New Collection" }}
            </div>
            <div
              v-if="collection.createdAt"
              class="text-theme-500 text-sm font-medium"
            >
              Created {{ standardDate(collection.createdAt) }}
            </div>
          </div>
          <div>
            <div v-if="collection.slug.value && collection.createdAt" class="">
              <ElBadge
                btn="default"
                :href="collection.url.value"
                target="_blank"
              >
                View Collection &rarr;
              </ElBadge>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div v-if="collection" class="mx-auto max-w-xl space-y-6">
            <ElInput
              v-model="collection.title.value"
              input="InputText"
              label="Collection Title"
              sub-label="Create a relevant title for the collection."
              placeholder="Mockups for new..."
              required
            />

            <ElInput
              v-model="collection.description.value"
              input="InputTextarea"
              :rows="8"
              label="Collection Description"
              placeholder="Describe the collection..."
            />

            <ElInput
              v-model="collection.slug.value"
              input="InputText"
              label="URL Slug"
              sub-label="A url-friendly id for the collection. It should be unique and descriptive."
              placeholder="my-collection"
            />
            <ElInput
              v-model="collection.isPrivate.value"
              input="InputToggle"
              label="Private Collection"
              sub-label="This collection will only be visible to you and other users you invite."
            />

            <div>
              <ElButton
                btn="primary"
                :loading="sending"
                @click="send('save')"
              >
                Save Changes
              </ElButton>
            </div>
          </div>
          <div>
            <div class="grid grid-cols-12 gap-4">
              <div
                v-for="(img, i) in collection?.mediaFull.value"
                :key="i"
                class="relative col-span-3"
              >
                <div
                  class="absolute -right-2 -top-2 cursor-pointer rounded-full bg-black/50 p-1 text-xs text-white hover:bg-black/70"
                  @click="removeImage(img)"
                >
                  <div class="i-heroicons-x-mark text-sm" />
                </div>
                <img :src="img.url">
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElPanel>
  </AdminPage>
</template>
