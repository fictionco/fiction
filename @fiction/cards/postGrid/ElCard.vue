<script lang="ts" setup>
import type { FictionPosts } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { useService, vue } from '@fiction/core'
import { Post } from '@fiction/posts'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const postMode = vue.computed(() => uc.value.postMode || 'global')
const loading = vue.ref(false)
const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()
const posts = vue.shallowRef<Post[]>([])
async function load() {
  if (postMode.value === 'custom') {
    const ps = uc.value.customPosts || []
    posts.value = ps.map(p => new Post({ fictionPosts, ...p, sourceMode: 'local' }))
  }
  else {
    loading.value = true
    const orgId = props.card.site?.settings.orgId

    if (!orgId)
      throw new Error('No fiction orgId found')

    posts.value = await fictionPosts.getPostIndex({ limit: 5, orgId })

    loading.value = false
  }
}

vue.onServerPrefetch(async () => {
  await load()
})
</script>

<template>
  <div>
    <div v-for="(item, i) in uc.customPosts" :key="i" class="py-[10vw] px-4">
      ..
    </div>
  </div>
</template>
