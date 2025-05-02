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
const activeFormat = vue.ref<'browser' | 'email'>('browser')

async function load(args: { postId?: string, format?: 'browser' | 'email' }) {
  const { postId, format = 'browser' } = args
  loading.value = true
  activeFormat.value = args.format || 'browser'
  try {
    if (!postId)
      return

    await fictionUser.userInitialized({ caller: 'email-preview' })
    post.value = await managePost({ card, fictionPosts, params: { _action: 'get', where: { postId } }, caller: 'postEdit' })

    const org = fictionUser.activeOrganization.value

    if (!org || !post.value)
      return

    if (format === 'email') {
      const conf = await getEmailForPost({
        postConfig: post.value?.toConfig(),
        fictionPosts,
        org,
        withDefaults: true,
        previewMode: 'dark',
      })

      emailHtml.value = conf.bodyHtml || ''
    }
  }
  catch (error) {
    console.error('Error loading post preview', error)
  }
  finally {
    loading.value = false
  }
}

vue.watch(
  () => fictionRouter.vars.value,
  async (v) => {
    const { postId, format } = v || {}
    if (v) {
      await load({ postId: postId as string, format: format as 'browser' | 'email' })
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
