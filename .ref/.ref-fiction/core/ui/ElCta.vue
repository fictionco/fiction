<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import ContentBox from './ContentBox.vue'
</script>

<template>
  <ContentBox wrap-class="py-8 px-12 md:py-12" scheme="dark">
    <div class="flex items-center justify-between space-x-12">
      <div class="">
        <div class="text-2xl font-extrabold tracking-tight">
          AI Generated Media for Professionals
        </div>
        <div class="text-theme-400 mt-4 text-xl font-medium">
          The pro platform for no-code AI generation. Try it free.
        </div>
      </div>
      <div class="">
        <ElButton
          class="border-theme-300 text-theme-0 border-2 py-2 px-4 text-base font-semibold hover:opacity-70 md:text-xl"
          btn="naked"
          target="_blank"
          href="https://studio.fiction.com/register"
        >
          Create Account &rarr;
        </ElButton>
      </div>
    </div>
  </ContentBox>
</template>
