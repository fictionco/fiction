<script lang="ts" setup>
import type { FictionPosts, Post, TablePostConfig } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { type IndexItem, useService, vue } from '@fiction/core'
import { postLink, taxonomyLink } from '@fiction/posts'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import CardButton from '../CardButton.vue'
import CardLink from '../el/CardLink.vue'
import ElAuthor from './ElAuthor.vue'

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
      media: p.media.value,
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
    <div v-if="list.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      <!-- Loop through posts -->
      <CardLink
        v-for="(item, i) in list"
        :key="item.slug"
        :card
        :href="item.href"
        :class="[getItemClasses(i)]"
      >
        <EffectGlare class="relative" wrap-class="rounded-[20px]" :class="i === 0 ? 'w-full h-full' : 'aspect-[4/3]'">
          <XMedia :animate="true" :media="item.media" :class="i === 0 ? 'w-full h-full' : 'aspect-[4/3]'" />
          <div v-if="i === 0" class="py-8 px-5 space-y-4 absolute top-0 z-10">
            <div class="mb-4 space-x-2">
              <CardButton
                v-for="(cat, ii) in item.categories?.slice(0, 2)"
                :key="ii"
                :card
                theme="overlay"
                rounding="full"
                size="xs"
                :text="cat.title"
                :href="taxonomyLink({ card, taxonomy: 'category', term: cat.slug })"
              />
            </div>
            <h2 class="text-2xl md:text-3xl font-semibold x-font-title text-balance max-w-[80%]">
              {{ item.name }}
            </h2>
            <ElAuthor v-for="(author, ii) in item.authors || []" :key="ii" :user="author" :date-at="item.dateAt" />
          </div>
          <div class="overlay absolute w-full h-full z-0 pointer-events-none inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,.5)_0,rgba(0,0,0,.3)_40%,transparent_70%)]" />
        </EffectGlare>

        <div v-if="i !== 0" class="pt-4">
          <h2 class="text-lg font-medium x-font-title !leading-[1.3]">
            {{ item.name }}
          </h2>
          <div class="mt-2 space-x-2">
            <CardButton
              v-for="(cat, ii) in item.categories?.slice(0, 2)"
              :key="ii"
              :card
              :text="cat.title"
              size="xs"
              :href="taxonomyLink({ card, taxonomy: 'category', term: cat.slug })"
              rounding="full"
            />
          </div>
        </div>
      </CardLink>
    </div>
    <El404 v-else super-heading="Index" heading="No Posts Found" sub-heading="Nothing to show here." :actions="[{ name: 'Go to Home', href: '/' }]" />
  </div>
</template>

<style lang="less" scoped>
.overlay {
  background: radial-gradient(circle at 0 0,rgba(0,0,0,0.75) 0,transparent 70%);
}
</style>
