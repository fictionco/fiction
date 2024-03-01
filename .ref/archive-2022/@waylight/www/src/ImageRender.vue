<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
</script>

<template>
  <ElForm>
    <ElInput
      class="my-4"
      label="Upload Image"
      input="InputMediaUpload"
    />
    <ElInput
      class="my-4"
      label="Design Setting"
      input="InputSelectCustom"
      :list="['Living Room', 'Bedroom']"
    />
    <ElInput
      class="my-4"
      label="Design Mode"
      input="InputSelectCustom"
      :list="['Living Room', 'Bedroom']"
    />
    <ElInput
      class="my-4"
      label="Design Style"
      input="InputSelectCustom"
      :list="['Living Room', 'Bedroom']"
    />
    <ElInput
      class="my-4"
      label="Renders"
      description="The number of images to render"
      input="InputSelectCustom"
      :list="['Living Room', 'Bedroom']"
    />

    <ElInput
      class="my-4"
      label="Quality"
      input="InputSelectCustom"
      :list="['Basic', 'Pro', 'Ultra']"
    />
    <ElButton btn="primary" format="block">
      Render Design
    </ElButton>
  </ElForm>
</template>
