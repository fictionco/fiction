<script lang="ts" setup>
import { type IndexItem, getNavComponentType, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionPosts, Post, TablePostConfig } from '@fiction/posts'
import ClipPathAnim from '@fiction/ui/anim/AnimClipPath.vue'
import ElBadge from '@fiction/ui/common/ElBadge.vue'
import El404 from '@fiction/ui/page/El404.vue'
import { postLink, taxonomyLink } from '@fiction/posts'
import ElAuthor from './ElAuthor.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  postIndex: { type: Array as vue.PropType<Post[]>, default: () => [] },
  loading: { type: Boolean, default: true },
})

const service = useService<{ fictionPosts: FictionPosts }>()
// const posts = vue.shallowRef<Post[]>([])

const list = vue.computed<(IndexItem & TablePostConfig)[]>(() => {
  return props.postIndex.map((p) => {
    return {
      ...p.toConfig(),
      key: p.postId,
      name: p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: postLink({ card: props.card, slug: p.slug.value }),
      media: p.image.value,
      categories: p.categories.value,
      tags: p.tags.value,
      slug: p.slug.value,
    } as IndexItem & TablePostConfig
  })
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
  <div :class="card.classes.value.contentWidth">
    <!-- Grid Container -->
    <div v-if="list.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <!-- Loop through posts -->
      <component
        :is="getNavComponentType(item)"
        v-for="(item, i) in list"
        :key="item.slug"
        :to="item.href"
        :href="item.href"
        :class="[getItemClasses(i)]"
      >
        <ClipPathAnim :animate="true" class="w-full h-full overflow-hidden">
          <div
            class="h-full w-full relative group cursor-pointer block hover:scale-105 duration-1000 ease-[cubic-bezier(0.25,1,0.33,1)] transition-all"
            :class="i === 0 ? '' : 'aspect-[4/3]'"
            :style="item.media?.url ? { backgroundImage: `url(${item.media.url})` } : {}"
          >
            <div :data-bg="item.media?.url" class="absolute z-0 inset-0 bg-cover  bg-gradient-to-br from-theme-50 dark:from-theme-600 to-theme-100 dark:to-theme-700 rounded-lg overflow-hidden bg-center" :style="item.media?.url ? { backgroundImage: `url(${item.media.url})` } : {}" />
            <div v-if="i === 0" class="overlay absolute w-full h-full z-10 pointer-events-none inset-0" />
            <div v-if="!item.media" class="w-full h-60 sm:h-full" />
            <div v-if="i === 0" class="p-[min(max(35px,_3.5vw),_50px)] text-theme-0 z-20 relative ">
              <div class="mb-4 space-x-2">
                <ElBadge
                  v-for="(cat, ii) in item.categories?.slice(0, 2)"
                  :key="ii"
                  theme="overlay"
                  ui-size="sm"
                  :text="cat.title"
                  :href="taxonomyLink({ card, taxonomy: 'category', term: cat.slug })"
                />
              </div>
              <h2 class="text-2xl md:text-3xl font-semibold x-font-title text-balance max-w-[80%]">
                {{ item.name }}
              </h2>
              <ElAuthor v-for="(author, ii) in item.authors || []" :key="ii" :user="author" :date-at="item.dateAt" />
            </div>
          </div>
        </ClipPathAnim>
        <div v-if="i !== 0" class="pt-4">
          <h2 class="text-xl font-semibold x-font-title text-balance">
            {{ item.name }}
          </h2>
          <div class="mt-2 space-x-2">
            <ElBadge v-for="(cat, ii) in item.categories?.slice(0, 2)" :key="ii" :text="cat.title" ui-size="sm" :href="taxonomyLink({ card, taxonomy: 'category', term: cat.slug })" />
          </div>
        </div>
      </component>
    </div>
    <El404 v-else super-heading="Index" heading="No Posts Found" sub-heading="Nothing to show here." :actions="[{ name: 'Go to Home', href: '/' }]" />
  </div>
</template>

<style lang="less" scoped>
.overlay {
  background: radial-gradient(circle at 0 0,rgba(0,0,0,0.75) 0,transparent 70%);
}
</style>
