<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
</script>

<template>
  <ElForm
    class="text-color rounded-lg bg-white px-6 py-4 text-left text-xs shadow-lg ring-1 ring-black/10"
  >
    <ElInput
      class="my-3"
      input="InputSelect"
      label="What type of feedback do you have?"
      :list="['complaint', 'compliment', 'other']"
      selected="compliment"
    />
    <ElInput
      class="my-3"
      input="InputTextarea"
      label="How can we improve?"
    />
  </ElForm>
</template>
