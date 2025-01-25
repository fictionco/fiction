<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { TableSiteConfig } from '@fiction/site'
import type { Card } from '@fiction/site/card'
import { resetUi, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { type FictionPosts, managePost, type Post } from '..'

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

    draftPost.value = await managePost({ fictionPosts, params: createParams, caller: 'postStart' })

    const postId = draftPost.value?.postId
    if (!postId) {
      fictionEnv.events.emit('notify', {
        type: 'error',
        message: 'Unable to create post. Please try again.',
      })
      return
    }

    await card.goto({ path: '/edit-post', query: { postId } })
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
        title: 'Start a New Post',
        subTitle: 'Enter a title for your post',
        key: 'postTitle',
        class: 'max-w-lg',
        isLoading: isSubmitting.value,
        onClick: () => createNewPost(),
        actionText: 'Continue to Editor',
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
      <div v-if="step.key === 'postTitle'" class="">
        <ElInput
          v-model="postDetails.title"
          input="InputText"
          :input-props="{
            'placeholder': 'What would you like to write about?',
            'aria-label': 'Post title',
          }"
          data-test-id="postTitleInput"
          ui-size="lg"
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
