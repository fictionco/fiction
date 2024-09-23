<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { TableSiteConfig } from '@fiction/site'
import type { Card } from '@fiction/site/card'
import { resetUi, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import { type FictionPosts, managePost, type Post } from '..'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const serv = useService<{ fictionPosts: FictionPosts }>()

const { fictionPosts, fictionEnv } = serv

const form = vue.ref<Partial<TableSiteConfig>>({ title: '', userConfig: { } })
const isLoading = vue.ref(false)
const post = vue.shallowRef<Post | undefined>()

async function requestCreate() {
  isLoading.value = true
  try {
    const createParams = { _action: 'create', fields: { title: form.value.title || '' } } as const
    post.value = await managePost({ fictionPosts, params: createParams })

    const postId = post.value?.postId

    if (!postId) {
      fictionEnv.events.emit('notify', { type: 'error', message: 'There was a problem.' })
      return
    }

    await props.card.goto({ path: '/edit-post', query: { postId } })
  }
  catch (error) {
    fictionEnv.events.emit('notify', { type: 'error', message: 'There was a problem.' })

    resetUi({ scope: 'all', cause: 'post creation error', trigger: 'manualReset' })
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [
      {
        name: 'Create A New Post',
        desc: 'Give it a title...',
        key: 'postTitle',
        class: 'max-w-lg',
        isLoading: isLoading.value,
        onClick: () => requestCreate(),
        actionText: 'Create Post',
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
    <ElStepNav v-slot="{ step }" :step-config="stepConfig" data-test-id="createPostModal">
      <div v-if="step.key === 'postTitle'" class="">
        <ElInput
          v-model="form.title"
          input="InputText"
          :input-props="{ placeholder: 'Post Title' }"
          data-test-id="postTitleInput"
          ui-size="lg"
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
