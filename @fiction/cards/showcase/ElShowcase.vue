<script lang="ts" setup>
import type { FictionPosts, Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { type MediaObject, useService, vue, waitFor } from '@fiction/core'
import { PostLoader } from '@fiction/posts/postLoader.js'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
import ElClose from '@fiction/ui/common/ElClose.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()
const loaded = vue.ref(false)
const uc = vue.computed(() => props.card.userConfig.value)

const postLoader = new PostLoader({
  fictionPosts,
  card: props.card,
  rootKey: 'posts',
})

const posts = vue.shallowRef<Post[]>([])

vue.onMounted(async () => {
  await waitFor(100)
  const { posts: loadedPosts } = await postLoader.loadPosts()
  posts.value = loadedPosts
  loaded.value = true
})

const activeitemIndex = vue.ref(-1)
const activeItem = vue.computed(() => posts.value[activeitemIndex.value])
const proseClass = `prose dark:prose-invert prose-sm md:prose-lg lg:prose-2xl max-w-[45ch] mx-auto focus:outline-none `

function featuredImageAspect(media: MediaObject) {
  const img = media
  const h = img?.height
  const w = img?.width

  if (!img || !w || !h)
    return 'aspect-[4/3]'

  return w > h ? 'aspect-square max-h-[70dvh]' : 'aspect-[4/3]'
}

function gridImageAspect() {
  const aspectMappings: { [key: string]: string } = {
    square: 'aspect-square max-h-[70dvh]',
    tall: 'aspect-[9/16] max-h-[70dvh]',
    wide: 'aspect-[16/9] max-w-[70dvw]',
    golden: 'aspect-[1.618/1] max-w-[70dvw]',
    portrait: 'aspect-[3/4] max-h-[70dvh]',
    landscape: 'aspect-[4/3] max-w-[70dvw]',
    cinema: 'aspect-[21/9] max-w-[70dvw]',
    default: 'aspect-[4/3] max-h-[70dvh]',
  }

  const aspect = uc.value.aspect || 'default'

  return aspectMappings[aspect] || aspectMappings.default
}

function gridCols() {
  const gridColsMax = uc.value.gridColsMax || 4
  const gridColsMin = uc.value.gridColsMin || 1

  const breakpoints = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  }

  let classes = `grid-cols-${gridColsMin}`

  for (const [bp, cols] of Object.entries(breakpoints)) {
    const effectiveCols = Math.max(+gridColsMin, Math.min(+gridColsMax, cols))
    classes += ` ${bp}:grid-cols-${effectiveCols}`
  }

  return classes.trim()
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div :class="[!loaded ? 'opacity-0' : '']" class="relative transition-opacity duration-700" data-test-id="showcase">
      <div class="grid md:gap-8 gap-6" :data-items-count="posts.length" :class="gridCols()" :data-aspect="uc.aspect" :data-grid-cols-max="uc.gridColsMax">
        <div v-for="(post, i) in posts" :key="post.postId" class="[perspective:1000px] group showcase-item x-action-item transition-all duration-300 space-y-2 relative cursor-pointer" @click.stop="activeitemIndex = i">
          <EffectGlare wrap-class="rounded-[20px]">
            <div class="relative">
              <XMedia :animate="true" :media="post.media.value" :class="gridImageAspect()" />
              <div class="py-4 px-5 space-y-0 absolute bottom-0 z-10">
                <CardText
                  tag="div"
                  :card="card"
                  class="text-lg font-semibold min-w-0 x-font-title text-pretty leading-tight line-clamp-2 text-white"
                  :path="`posts.entries.${i}.title`"
                  animate="fade"
                />

                <CardText
                  tag="div"
                  :card="card"
                  class=" text-base text-white/80 text-pretty line-clamp-1 font-medium"
                  :path="`posts.entries.${i}.subTitle`"
                  animate="fade"
                />
              </div>
              <div class="overlay absolute w-full h-full z-0 pointer-events-none inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(0,0,0,.5)_0,rgba(0,0,0,.3)_40%,transparent_70%)]" />
            </div>
          </EffectGlare>
        </div>
      </div>
      <ElModal :vis="activeitemIndex >= 0" modal-class="lg:max-w-[96vw] min-h-[96vh] x-font-body " @update:vis="activeitemIndex = -1">
        <ElClose class="absolute right-2 top-2 z-40" @click="activeitemIndex = -1" />
        <div class="py-12 md:py-24 px-4">
          <div :class="proseClass">
            <div class="not-prose">
              <div class="mb-8 not-prose space-y-4 text-center">
                <CardText
                  tag="h1"
                  :card="card"
                  class="mb-0 text-3xl md:text-5xl font-semibold x-font-title "
                  :path="`posts.entries.${activeitemIndex}.title`"
                  animate="fade"
                />
                <CardText
                  tag="h3"
                  :card="card"
                  class="my-0 text-theme-500 dark:text-theme-400 text-lg md:text-3xl"
                  :path="`posts.entries.${activeitemIndex}.subTitle`"
                  animate="fade"
                />
              </div>

              <AnimClipPath animate="expand" class="my-[min(max(35px,_5vw),_30px)] md:-mx-16">
                <div v-if="activeItem?.media?.value?.url" class=" mx-auto relative overflow-hidden rounded-xl" :class="featuredImageAspect(activeItem.media.value)">
                  <img :src="activeItem.media.value.url" :alt="activeItem.title.value" class="absolute h-full w-full object-cover object-center">
                </div>
              </AnimClipPath>
            </div>

            <CardText
              tag="div"
              :card="card"
              class="my-12 font-serif"
              :path="`posts.entries.${activeitemIndex}.content`"
              animate="fade"
            />
          </div>
        </div>
      </ElModal>
    </div>
  </div>
</template>
