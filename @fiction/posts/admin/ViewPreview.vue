<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionPosts, Post } from '..'
import { useService, vue } from '@fiction/core'
import SinglePost from '../ui/SinglePost.vue'
import { managePost } from '../utils'
import { getEmailForPost } from '../utils/email'

defineOptions({ name: 'ViewPostPreview' })

const { card } = defineProps<{
  card: Card
}>()

const { fictionRouter, fictionUser, fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(true)
const post = vue.shallowRef<Post | undefined>()
const emailHtml = vue.ref('')
const activeFormat = vue.ref<'web' | 'email'>('web')

async function load(args: { postId?: string, format?: 'web' | 'email' }) {
  const { postId } = args
  loading.value = true
  activeFormat.value = args.format || 'web'
  try {
    if (!postId)
      return

    await fictionUser.userInitialized({ caller: 'email-preview' })
    post.value = await managePost({ fictionPosts, params: { _action: 'get', where: { postId } }, caller: 'postEdit' })

    const org = fictionUser.activeOrganization.value

    if (!org || !post.value)
      return

    const conf = await getEmailForPost({
      postConfig: post.value?.toConfig(),
      fictionPosts,
      org,
      withDefaults: true,
      previewMode: 'dark',
    })

    emailHtml.value = conf.bodyHtml || ''
  }
  catch (error) {
    console.error('Error loading post preview', error)
  }
  finally {
    loading.value = false
  }
}

vue.watch(
  () => fictionRouter.query.value,
  async (v) => {
    const { postId, format } = v || {}
    if (v) {
      await load({ postId: postId as string, format: format as 'web' | 'email' })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full overflow-scroll">
    <div v-if="activeFormat === 'email'" class="w-full h-full" v-html="emailHtml" />
    <SinglePost v-else :post :card :loading class="pb-24 lg:pb-36" />
  </div>
</template>
