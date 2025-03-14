<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import { taxonomyLink } from '@fiction/posts'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import CardButton from '../../CardButton.vue'
import CardTextPost from '../../CardTextPost.vue'
import CardLink from '../../el/CardLink.vue'
import ElAuthor from './ElAuthor.vue'

const { card, posts, indexMeta } = defineProps<{
  card: Card<UserConfig>
  posts: Post[]
  loading: boolean
  indexMeta: IndexMeta
}>()

const emit = defineEmits<{
  (e: 'update:indexMeta', value: IndexMeta): void
}>()

const uc = vue.computed(() => card.userConfig.value)

const totalPages = vue.computed(() => Math.ceil((indexMeta.count || 0) / (indexMeta.limit || 10)))
const currentPage = vue.computed(() => Math.floor((indexMeta.offset || 0) / (indexMeta.limit || 10)) + 1)

function getItemClasses(index: number): string {
  const out = []

  if (index === 0)
    out.push('col-span-1 lg:col-span-2 row-span-2 rounded-lg min-h-[400px]')
  else
    out.push('col-span-1 row-span-1 flex flex-col')

  return out.join(' ')
}

function changePage(newPage: number) {
  if (newPage < 1 || newPage > totalPages.value)
    return

  const newOffset = (newPage - 1) * (indexMeta.limit || 10)
  emit('update:indexMeta', { ...indexMeta, offset: newOffset })
}
</script>

<template>
  <div>
    <!-- Grid Container -->
    <div v-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 auto-rows-[minmax(280px,20vh)]">
      <!-- Loop through posts -->
      <CardLink
        v-for="(post, i) in posts"
        :key="post.slug.value"
        :card
        :href="post.href.value"
        :class="[getItemClasses(i)]"
        :data-link-slug="post.slug.value"
        :data-link-href="post.href.value"
      >
        <EffectGlare class="relative" wrap-class="rounded-[20px]" :class="i === 0 ? 'w-full h-full' : 'w-full h-full'">
          <XMedia class="bg-theme-50 dark:bg-theme-700/70" :animate="true" :media="post.media.value" :class="i === 0 ? 'w-full h-full' : 'w-full h-full'" />
          <div v-if="i === 0" class="py-8 px-5 space-y-4 absolute top-0 z-10 text-white">
            <div class="mb-4 space-x-2">
              <CardButton
                v-for="(cat, ii) in post.categories.value?.slice(0, 2)"
                :key="ii"
                :card
                theme="overlay"
                rounding="full"
                size="xs"
                :text="cat"
                :href="taxonomyLink({ card, taxonomy: 'category', term: cat })"
              />
            </div>
            <CardTextPost :data-post-title="post.title.value" :post path="title" tag="h2" class="text-2xl md:text-3xl font-medium x-font-title text-balance max-w-[80%]" />
            <template v-if="uc.index?.showAuthors && post.authors.value?.length">
              <ElAuthor
                v-for="(author, ii) in post.authors.value || []"
                :key="ii"
                :user="author"
                :date-at="post.dateAt.value"
              />
            </template>
          </div>
          <div v-if="i === 0" class="overlay absolute w-full h-full z-0 pointer-events-none inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,.5)_0,rgba(0,0,0,.3)_40%,transparent_70%)]" />
        </EffectGlare>

        <div v-if="i !== 0" class="pt-4">
          <CardTextPost :post path="title" tag="h2" class="text-xl font-medium x-font-title !leading-[1.3] line-clamp-2" />
          <div class="mt-2 space-x-2">
            <CardButton
              v-for="(cat, ii) in post.categories.value?.slice(0, 2)"
              :key="ii"
              :card
              :text="cat"
              size="xs"
              :href="taxonomyLink({ card, taxonomy: 'category', term: cat })"
              rounding="full"
            />
          </div>
        </div>
      </CardLink>
    </div>
    <El404
      v-else
      :super-title="{ text: 'Posts' }"
      title="No Posts Available"
      sub-title="Check back later for new content"
      :buttons="[{ label: 'Return to Homepage', href: '/', theme: 'primary' }]"
    />

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-6">
      <XButton
        :disabled="currentPage === 1"
        size="sm"
        rounding="full"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </XButton>
      <span class="font-sans text-xs text-theme-500 dark:text-theme-400">{{ currentPage }} / {{ totalPages }}</span>
      <XButton
        :disabled="currentPage === totalPages"
        size="sm"
        rounding="full"
        @click="changePage(currentPage + 1)"
      >
        Next
      </XButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
.overlay {
  background: radial-gradient(circle at 0 0,rgba(0,0,0,0.75) 0,transparent 70%);
}
</style>
