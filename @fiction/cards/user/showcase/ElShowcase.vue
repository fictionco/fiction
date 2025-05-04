<script lang="ts" setup>
import type { FictionPosts, Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { useService, vue, waitFor } from '@fiction/core'
import { PostLoader } from '@fiction/posts/postLoader.js'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElClose from '@fiction/ui/common/ElClose.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../../CardText.vue'
import CardWrap from '../../CardWrap.vue'

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
const proseClass = `prose dark:prose-invert prose-sm md:prose-lg max-w-[45ch]`

function gridImageAspect() {
  const aspectMappings: { [key: string]: string } = {
    square: 'aspect-square',
    tall: 'aspect-[9/16]',
    wide: 'aspect-[16/9]',
    golden: 'aspect-[1.618/1]',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    cinema: 'aspect-[21/9]',
    default: 'aspect-[4/3]',
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

function prev() {
  activeitemIndex.value = (activeitemIndex.value - 1 + posts.value.length) % posts.value.length
}

function next() {
  activeitemIndex.value = (activeitemIndex.value + 1) % posts.value.length
}
</script>

<template>
  <CardWrap :card>
    <div :class="[!loaded ? 'opacity-0' : '']" class="relative transition-opacity duration-700" data-test-id="showcase">
      <div class="grid md:gap-8 gap-6" :data-items-count="posts.length" :class="gridCols()" :data-aspect="uc.aspect" :data-grid-cols-max="uc.gridColsMax">
        <div v-for="(post, i) in posts" :key="post.postId" class="[perspective:1000px] group showcase-item x-action-item transition-all duration-300 space-y-2 relative cursor-pointer" @click.stop="activeitemIndex = i">
          <EffectGlare wrap-class="rounded-[20px]">
            <div class="relative">
              <XMedia :animate="true" :media="post.media.value" :class="gridImageAspect()" />
              <div class="py-4 px-5 space-y-0 absolute bottom-0 z-10">
                <CardText
                  tag="div"
                  :card
                  class="text-lg font-semibold min-w-0 x-font-title text-pretty leading-tight line-clamp-2 text-white"
                  :path="`posts.entries.${i}.title`"
                  animate="fade"
                />

                <CardText
                  tag="div"
                  :card
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
      <ElModal
        :vis="activeitemIndex >= 0"
        modal-class="w-full x-font-body"
        transition-mode="slideUp"
        @update:vis="activeitemIndex = -1"
      >
        <ElClose class="absolute right-2 top-2 z-40" @click="activeitemIndex = -1" />
        <transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-x-12"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="ease-in duration-300"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-12"
          mode="out-in"
        >
          <div :key="activeitemIndex" class="py-16 px-6 lg:px-16 ">
            <div class="flex flex-col md:flex-row gap-8 md:gap-12 justify-center">
              <div class="md:basis-[350px] shrink-0">
                <div class="sticky top-12 mb-8 not-prose space-y-4 text-left ">
                  <div class="flex justify-between gap-4 mb-12">
                    <XButton size="sm" icon="i-tabler-arrow-left" @click="prev()">
                      Previous
                    </XButton>
                    <XButton size="sm" icon-after="i-tabler-arrow-right" @click="next()">
                      Next
                    </XButton>
                  </div>

                  <CardText
                    tag="h1"
                    :card
                    class="mb-0 text-2xl lg:text-3xl font-semibold x-font-title "
                    :path="`posts.entries.${activeitemIndex}.title`"
                    animate="fade"
                  />
                  <CardText
                    tag="h3"
                    :card
                    class="my-0 text-theme-500 dark:text-theme-400 text-lg lg:text-xl"
                    :path="`posts.entries.${activeitemIndex}.subTitle`"
                    animate="fade"
                  />

                  <div :class="proseClass">
                    <CardText
                      tag="div"
                      :card
                      class="my-12 font-serif"
                      :path="`posts.entries.${activeitemIndex}.content`"
                      animate="fade"
                    />
                  </div>
                </div>
              </div>
              <div class="grow space-y-6 min-w-0 max-w-screen-sm">
                <div v-if="activeItem?.media?.value" class="max-w-screen-sm">
                  <XMedia
                    :animate="true"
                    :media="activeItem?.media?.value"
                    image-mode="inline"
                  />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </ElModal>
    </div>
  </CardWrap>
</template>
