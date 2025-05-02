<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { TableSiteConfig } from '@fiction/site'
import type { Card } from '@fiction/site/card'
import type { FictionPosts, Post } from '..'
import { resetUi, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { managePost } from '..'

const { card, vis = false } = defineProps<{
  card: Card
  vis?: boolean
}>()

const emit = defineEmits(['update:vis'])

const serv = useService<{ fictionPosts: FictionPosts }>()

const { fictionPosts, fictionEnv } = serv

const postDetails = vue.ref<Partial<TableSiteConfig>>({
  title: '',
  userConfig: {},
})
const isSubmitting = vue.ref(false)
const draftPost = vue.shallowRef<Post | undefined>()

async function createNewPost() {
  isSubmitting.value = true
  try {
    const createParams = {
      _action: 'create',
      fields: { title: postDetails.value.title || '' },
    } as const

    draftPost.value = await managePost({ card, fictionPosts, params: createParams, caller: 'postStart' })

    const postId = draftPost.value?.postId
    if (!postId) {
      fictionEnv.events.emit('notify', { type: 'error', message: 'Unable to create post. Please try again.' })
      return
    }

    await card.goto({ path: '/edit-post', query: { postId, view: 'compose' } })
  }
  catch (error) {
    fictionEnv.events.emit('notify', {
      type: 'error',
      message: 'Unable to create post. Please try again later.',
    })
    resetUi({ scope: 'all', cause: 'post creation failed', trigger: 'manualReset' })
    console.error('Post creation failed:', error)
  }
  finally {
    isSubmitting.value = false
  }
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form: postDetails,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [
      {
        title: 'Create New Post',
        subTitle: 'Give it a title, you can change this later',
        key: 'title',
        class: 'max-w-lg',
        isLoading: isSubmitting.value,
        onClick: () => createNewPost(),
        button: { label: 'Next' },
      },
    ]

    return out
  }),
}
</script>

<template>
  <ElModal
    modal-class="max-w-screen-md"
    style-class="pointer-events-none"
    :vis="vis"
    @update:vis="emit('update:vis', $event)"
  >
    <ElStepNav
      v-slot="{ step }"
      :step-config="stepConfig"
      data-test-id="createPostModal"
      :classes="{ step: 'bg-theme-0 dark:bg-theme-950 text-theme-900 dark:text-theme-0' }"
    >
      <div v-if="step.key === 'title'" class="">
        <ElInput
          v-model="postDetails.title"
          input="InputText"
          :input-props="{
            'placeholder': `Enter post title`,
            'aria-label': 'Post title',
            'required': true,
          }"
          data-test-id="start-post-title"
          ui-size="lg"
          required
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
