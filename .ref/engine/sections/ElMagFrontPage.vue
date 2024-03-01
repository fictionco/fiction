<script lang="ts" setup>
import type { PostOrPage } from '@factor/api'
import { standardDate, useService, vue } from '@factor/api'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type { FactorEngine } from '..'

defineProps({
  settings: {
    type: Object as vue.PropType<SectionProps>,
    required: true,
  },
})

const { factorEngine } = useService<{ factorEngine: FactorEngine }>()

export interface SectionProps {
  titlePrimary: string
  titleSecondary: string
  subTitle: string
}

const posts = vue.ref<PostOrPage[]>([])
const list = vue.computed(() => {
  return posts.value.slice(1, 5)
})

const featured = vue.computed<PostOrPage | undefined>(() => {
  return posts.value.slice(0, 1)[0]
})

const loading = vue.ref(false)

async function getContent(): Promise<void> {
  loading.value = true

  posts.value = await factorEngine.getPosts({ limit: 5 })

  loading.value = false
}

vue.onServerPrefetch(async () => {
  await getContent()
})

getContent().catch(error => console.error(error))
</script>

<template>
  <div class="content-standard mx-auto my-8 lg:my-32">
    <div class="mx-auto mb-6 max-w-3xl p-4 text-left lg:mb-16 lg:text-center">
      <div
        class="x-font-title mb-4 text-sm font-semibold uppercase tracking-wider lg:text-lg"
      >
        {{ settings?.titleSecondary }}
      </div>
      <div
        class="x-font-title text-4xl font-bold uppercase md:text-6xl xl:text-8xl"
        v-html="settings?.titlePrimary"
      />
      <div class="x-font-title mt-4 text-lg lg:text-2xl">
        {{ settings?.subTitle }}
      </div>
    </div>
    <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <!-- Main 2 column grid -->
      <div class="featured relative min-h-[500px]">
        <a
          v-if="featured"
          :href="featured.route"
          class="group absolute inset-0"
        >
          <div class="image-area clip-img absolute inset-0 w-full">
            <img
              :src="featured.imageUrl"
              class="transition-hover absolute inset-0 h-full w-full object-cover group-hover:scale-110"
            >
            <div class="grad pointer-events-none absolute inset-0 z-10" />
          </div>
          <div class="absolute inset-0 p-10 text-white lg:max-w-[70%]">
            <div>
              <span
                v-for="cat in featured.category"
                :key="cat"
                class="x-font-title inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium text-white ring-1 ring-inset ring-white"
              >{{ cat }}</span>
            </div>
            <h2 class="leading-tighter mt-2 break-words text-4xl font-semibold">
              {{ featured.title }}
            </h2>
            <div class="mt-2">{{ featured.excerpt }}</div>

            <div v-if="featured.authorName" class="mt-4 flex space-x-4">
              <ElAvatar
                :email="featured.authorEmail"
                class="inline-block h-10 w-10 rounded-full bg-transparent ring-2 ring-white"
              />
              <div>
                <div class="font-bold">{{ featured.authorName }}</div>
                <div class="text-xs">
                  {{ standardDate(featured.publishedAt) }}
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div class="list grid grid-cols-1 gap-12">
        <!-- Sub grid for the list -->
        <a
          v-for="(p, i) in list"
          :key="i"
          :href="p.route"
          class="group flex space-x-6"
        >
          <div class="w-24 shrink-0 drop-shadow-md md:w-36">
            <div
              class="image-area clip-img relative aspect-[3/2] w-full shadow-xl"
            >
              <!-- 56.25% for 16:9 aspect ratio -->
              <img
                :src="p.imageUrl"
                class="transition-hover absolute inset-0 h-full w-full object-cover group-hover:scale-110"
              >
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold leading-tight">{{ p.title }}</h2>
            <div v-if="p.authorName" class="mt-4 flex items-center space-x-2">
              <ElAvatar
                :email="p.authorEmail"
                class="inline-block h-6 w-6 rounded-full bg-transparent ring-2 ring-white"
              />
              <div class="flex space-x-1 text-sm">
                <div class="font-bold">{{ p.authorName }}</div>
                <template v-if="p.category?.length">
                  <span class="italic opacity-70">in</span><span class="font-bold">{{ p.category?.join(", ") }}</span>
                </template>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.clip-img {
  clip-path: inset(0 round 10px);
}
.grad {
  background: radial-gradient(
    circle at 0 0,
    rgba(0, 0, 0, 0.85) 0,
    transparent 100%
  );
}
.transition-hover {
  transition:
    opacity 0.45s cubic-bezier(0.15, 0.75, 0.5, 1) 0s,
    transform 0.45s cubic-bezier(0.15, 0.75, 0.5, 1) 0s;
}
.filter-shadow {
  filter: drop-shadow(1px 2px 2px rgba(0, 20, 20, 0.1));
}
</style>
