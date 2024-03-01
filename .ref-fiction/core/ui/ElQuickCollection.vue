<script lang="ts" setup>
import { notify, shortId, toSlug, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElInput from '@factor/ui/ElInput.vue'
import { useFictionApp } from '../util'
import { Collection } from '../plugin-models/model'

const emit = defineEmits<{
  (event: 'update', payload: Collection): void
}>()
const { fictionModel } = useFictionApp()
const collection = vue.shallowRef<Collection>(new Collection({ fictionModel }))
const vis = vue.ref(false)
const sending = vue.ref()
async function send(context: string): Promise<void> {
  sending.value = context

  if (!collection.value.title.value) {
    sending.value = false
    notify.error('please enter a title')
    return
  }

  collection.value.slug.value = `${toSlug(
    collection.value.title.value,
  )}-${shortId(5)}`

  const config = collection.value?.toConfig()

  await fictionModel.requests.ManageCollection.projectRequest({
    _action: 'update',
    config,
  })

  emit('update', collection.value)

  sending.value = false
}
</script>

<template>
  <div class="quick-collection p-2">
    <ElButton
      v-if="!vis"
      btn="default"
      size="xs"
      format="block"
      @click="vis = true"
    >
      New Collection
    </ElButton>
    <div v-if="vis" class="space-y-2">
      <ElInput
        v-model="collection.title.value"
        input="InputText"
        placeholder="Collection Title"
        required
      />
      <ElButton
        btn="primary"
        format="block"
        size="xs"
        :loading="sending"
        @click="send('collection')"
      >
        Save New Collection
      </ElButton>
    </div>
  </div>
</template>

<style lang="less">
.quick-collection {
  --input-x: 0.5em;
  --input-y: 0.3em;
  --input-size: 0.8rem;
}
</style>
