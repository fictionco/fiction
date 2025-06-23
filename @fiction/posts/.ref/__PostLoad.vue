<script lang="ts" setup>
import type { FictionPosts } from '../index.js'
import type { Post } from '../post.js'
import { useService, vue } from '@fiction/core'
import { managePost } from '../utils'

const { fictionRouter, fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

const loading = vue.ref(true)
const post = vue.shallowRef<Post | undefined>()

async function load(args: { postId: string }) {
  const { postId } = args
  loading.value = true
  const editParams = { _action: 'get', where: { postId } } as const
  post.value = await managePost({ fictionPosts, params: editParams, caller: 'postEdit' })
  loading.value = false
}

vue.watch(
  () => fictionRouter.query.value.postId,
  async (v) => {
    if (v) {
      await load({ postId: v as string })
    }
  },
  { immediate: true },
)
</script>

<template>
  <slot :post :loading />
</template>
