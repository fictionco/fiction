<script lang="ts" setup>
import { type IndexItem, dayjs, useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import type { Card } from '@fiction/site'
import { managePostIndex } from '@fiction/plugin-posts'
import type { FictionPosts, Post, TablePostConfig } from '@fiction/plugin-posts'
import ClipPathAnim from '@fiction/ui/anim/AnimClipPath.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const service = useService<{ fictionPosts: FictionPosts }>()
const posts = vue.shallowRef<Post[]>([])

const list = vue.computed<(IndexItem & TablePostConfig)[]>(() => {
  return posts.value.map((p) => {
    return {
      ...p.toConfig(),
      key: p.postId,
      name: p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: props.card.link(`/post/${p.postId}`),
      media: p.image.value,
    }
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  const createParams = { _action: 'list', fields: { }, loadDraft: true, limit: 5 } as const
  posts.value = await managePostIndex({ fictionPosts: service.fictionPosts, params: createParams })
  loading.value = false
}

vue.onMounted(async () => {
  await load()
})

function getItemClasses(index: number): string {
  const out = []

  if (index === 0)
    out.push('col-span-1 lg:col-span-2 row-span-2 rounded-lg  ')
  else
    out.push('col-span-1 row-span-1 aspect-[4/3]')

  return out.join(' ')
}
</script>

<template>
  <div class="p-8" :class="card.classes.value.contentWidth">
    <!-- Grid Container -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- Loop through posts -->
      <div
        v-for="(item, index) in list"
        :key="item.slug"
        :class="[getItemClasses(index)]"
      >
        <ClipPathAnim :enabled="true" class="w-full h-full">
          <div
            class="h-full w-full relative group cursor-pointer"
            :class="index === 0 ? '' : 'aspect-[4/3]'"
            :style="item.media?.url ? { backgroundImage: `url(${item.media.url})` } : {}"
          >
            <div :data-bg="item.media?.url" class="group-hover:scale-110 duration-1000 ease-[cubic-bezier(0.25,1,0.33,1)] absolute z-0 inset-0 bg-cover  bg-gradient-to-br from-theme-500 to-theme-800 rounded-lg overflow-hidden bg-center" :style="item.media?.url ? { backgroundImage: `url(${item.media.url})` } : {}" />
            <div v-if="index === 0" class="overlay absolute w-full h-full z-10 pointer-events-none inset-0" />
            <div v-if="!item.media" class="w-full h-60 sm:h-full" />
            <div v-if="index === 0" class="p-[min(max(35px,_3.5vw),_50px)] text-theme-0 z-20 relative ">
              <div class="mb-4">
                <span class="font-sans antialiased inline-flex items-center rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-theme-0 ring-1 ring-inset ring-rose-600/50">Badge</span>
              </div>
              <h2 class="text-3xl font-bold x-font-title text-balance max-w-[75%]">
                {{ item.name }}
              </h2>
              <div class="text-base flex gap-3 items-center mt-4">
                <ElAvatar class="size-12 rounded-full" :email="item.authors?.[0].email" />
                <div>
                  <div class="font-semibold text-lg">
                    {{ item.authors?.[0].fullName }}
                  </div>
                  <div class="font-sans antialiased text-sm">
                    {{ dayjs(item.dateAt).format('MMMM D, YYYY') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ClipPathAnim>
        <div v-if="index !== 0" class="pt-4">
          <h2 class="text-2xl font-bold x-font-title text-balance">
            {{ item.name }}
          </h2>
          <div class="mt-2">
            <span class="font-sans antialiased inline-flex items-center rounded-full dark:bg-theme-700 px-2 py-1 text-xs font-medium text-theme-300">Badge</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.overlay {
  background: radial-gradient(circle at 0 0,rgba(0,0,0,0.75) 0,transparent 70%);
}
</style>, TablePostConfig
