<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import type { CardRequests } from './queries'
import { log, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps<{
  card: Card<UserConfig, { requests: CardRequests }>
}>()

const logger = log.contextLogger('Instagram Card')

const loading = vue.ref(true)
const error = vue.ref<string>()
const data = vue.ref<{
  profile: any
  posts: any[]
}>()

// Reactive config bindings
const config = vue.computed(() => props.card.userConfig.value)
const displayConfig = vue.computed(() => config.value.display || {})
const headerConfig = vue.computed(() => config.value.header || {})
const actionConfig = vue.computed(() => config.value.action || {})

// Grid layout classes
const gapClass = vue.computed(() => {
  const gapMap = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }
  return gapMap[displayConfig.value.gap || 'md']
})

const gridClass = vue.computed(() => {
  const layout = displayConfig.value.layout
  if (layout === 'masonry') {
    return 'columns-1 sm:columns-2 lg:columns-3'
  }
  else if (layout === 'carousel') {
    return 'flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar'
  }
  return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
})

const getHoverClass = vue.computed(() => {
  return 'transition-opacity duration-300'
})

// Utility functions
function formatNumber(num?: number): string {
  if (!num)
    return '0'
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

function isLastPost(post: any): boolean {
  return data.value?.posts[data.value.posts.length - 1].id === post.id
}

function scrollToNext() {
  const container = document.querySelector('.snap-x')
  if (container) {
    container.scrollBy({
      left: container.clientWidth,
      behavior: 'smooth',
    })
  }
}

// Load Instagram data
async function loadInstagram() {
  if (!config.value.account?.handle) {
    error.value = 'Please configure an Instagram handle'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = undefined

    const response = await props.card.request('instagram', {
      handle: 'arpowers', // config.value.account.handle,
      limit: config.value.account.postCount || 9,
    })

    if (response.status === 'success') {
      data.value = response.data
    }
    else {
      error.value = response.message || 'Failed to load Instagram feed'
    }
  }
  catch (e) {
    logger.error('Instagram load error', { error: e })
    error.value = 'Failed to load Instagram feed'
  }
  finally {
    loading.value = false
  }
}

// Watch for configuration changes
vue.watch(
  () => [config.value.account?.handle, config.value.account?.postCount],
  () => {
    loadInstagram()
  },
  { immediate: true },
)
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <!-- Header Section -->
    <div v-if="headerConfig.show" class="mb-8">
      <div v-if="loading" class="animate-pulse flex items-center gap-4 mb-6">
        <div class="rounded-full bg-theme-100 dark:bg-theme-800 size-16" />
        <div class="space-y-3 grow">
          <div class="h-4 w-32 bg-theme-100 dark:bg-theme-800 rounded" />
          <div class="h-3 w-24 bg-theme-100 dark:bg-theme-800 rounded" />
        </div>
      </div>

      <div v-else-if="data?.profile" class="flex items-center gap-6">
        <XMedia
          v-if="headerConfig.media?.url"
          :media="headerConfig.media"
          class="size-16 rounded-full bg-theme-100 dark:bg-theme-800"
          image-mode="cover"
        />
        <img
          v-else-if="data.profile.profilePictureUrl"
          :src="data.profile.profilePictureUrl"
          :alt="data.profile.username"
          class="size-16 rounded-full bg-theme-100 dark:bg-theme-800"
        >

        <div class="grow">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-xl">
              {{ data.profile.username }}
            </h3>
            <svg
              v-if="data.profile.isVerified"
              class="size-5 text-blue-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 12l2 2 4-4M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z" />
            </svg>
          </div>

          <div v-if="headerConfig.style === 'standard'" class="space-y-2">
            <div class="flex gap-6 text-sm text-theme-600 dark:text-theme-300">
              <span v-if="headerConfig.showPostCount">
                <strong>{{ formatNumber(data.profile.mediaCount) }}</strong> posts
              </span>
              <span v-if="headerConfig.showFollowers">
                <strong>{{ formatNumber(data.profile.followersCount) }}</strong> followers
              </span>
            </div>
            <div v-if="headerConfig.showBio && data.profile.biography" class="text-sm max-w-xl">
              {{ data.profile.biography }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 text-red-600 dark:text-red-300"
    >
      {{ error }}
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="min-h-[400px] grid place-items-center"
    >
      <ElSpinner class="size-8 text-theme-400" />
    </div>

    <!-- Posts Grid -->
    <div
      v-else-if="data?.posts.length"
      :class="[gridClass, gapClass]"
      class="relative"
    >
      <div
        v-for="post in data.posts"
        :key="post.id"
        class="group relative overflow-hidden aspect-square"
        :class="[
          displayConfig.layout === 'carousel' ? 'snap-center shrink-0' : '',
          displayConfig.layout === 'masonry' ? 'mb-4' : '',
        ]"
      >
        <!-- Post Media -->
        <img
          :src="post.mediaUrl"
          :alt="post.caption || 'Instagram post'"
          class="object-cover h-full rounded-sm group-hover:scale-110 transition-transform duration-500"
          :class="[
            displayConfig.layout === 'carousel' ? 'w-80' : 'w-full',
          ]"
        >

        <!-- Post Media Overlay -->
        <a
          :href="post.permalink"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            getHoverClass,
          ]"
          class="bg-theme-950/80 text-white transition-all duration-300 absolute inset-0 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
        >
          <!-- Social Metrics -->
          <div
            v-if="displayConfig.showLikes || displayConfig.showComments"
            class="flex gap-6 mb-4 font-medium"
          >
            <div v-if="displayConfig.showLikes" class="flex items-center gap-2">
              <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {{ formatNumber(post.likeCount) }}
            </div>
            <div v-if="displayConfig.showComments" class="flex items-center gap-2">
              <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ formatNumber(post.commentCount) }}
            </div>
          </div>

          <!-- Caption -->
          <p
            v-if="displayConfig.showCaption && post.caption"
            class="text-sm text-center line-clamp-3"
          >
            {{ post.caption }}
          </p>

          <!-- View Post Link -->
          <span
            class="mt-4 text-xs font-medium uppercase tracking-wider opacity-75 hover:opacity-100"
          >
            View Post →
          </span>
        </a>

        <!-- Carousel Navigation -->
        <button
          v-if="displayConfig.layout === 'carousel' && !isLastPost(post)"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-theme-900/90 rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          @click="scrollToNext"
        >
          <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 px-6 text-theme-500 dark:text-theme-400 border-2 border-dashed border-theme-200 dark:border-theme-700 rounded-lg"
    >
      <svg class="size-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>No Instagram posts found</p>
      <p class="mt-2 text-sm">
        {{ config.account?.handle ? 'Please check the account handle and try again' : 'Please configure your Instagram handle in the settings' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
