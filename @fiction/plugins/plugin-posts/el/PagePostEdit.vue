<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import AdminEditItem from '@fiction/admin/AdminEditItem.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XTextBase from '@fiction/ui/XTextBase.vue'
import type { Post } from '../post'
import { postEditController } from './tools'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const sending = vue.ref()
const post = vue.shallowRef<Post | undefined>()

function save() {

}
</script>

<template>
  <div>
    <AdminEditItem :controller="postEditController">
      <template #headerLeft>
        <ElButton btn="default" :href="card.link('/')">
          <div class="i-tabler-home text-lg" />
        </ElButton>
        <div class="flex space-x-1 font-medium">
          <RouterLink
            class="text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
            :to="card.link('/')"
          >
            <span class="i-tabler-pin text-xl inline-block dark:text-theme-500" />
            <span>Edit Post</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XTextBase v-if="post" v-model="post.title.value" :is-editable="true" class="hover:bg-theme-100" />
        </div>
      </template>
      <template #headerRight>
        <ElButton
          btn="default"
          href="/"
          target="_blank"
        >
          View
        </ElButton>
        <ElButton
          btn="primary"
          :loading="sending === 'save'"
          class="min-w-36"
          icon="i-tabler-save"
          @click.prevent="save()"
        >
          Save Post
        </ElButton>
      </template>
      <template #default>
        <div>ddd</div>
      </template>
    </AdminEditItem>
  </div>
</template>
