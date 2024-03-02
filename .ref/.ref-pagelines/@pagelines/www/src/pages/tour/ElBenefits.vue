<script lang="ts" setup>
import { vue } from '@factor/api'

const benefits = vue.ref([
  {
    icon: `i-heroicons-beaker`,
    class: 'bg-rose-600 text-rose-100',
    title: 'Answer Sales Enquiries',
    text: 'With adaptive and conversational tools, users will find what they need, when they need it.',
  },
  {
    icon: `i-heroicons-server-stack`,
    class: 'bg-primary-600 text-primary-100',
    title: 'Responsive <span class=\'italic under\'>Requests</span>',
    text: 'With a more understandable and engaging experience, you\'ll make more money.',
  },
  {
    icon: `i-heroicons-document`,
    class: 'bg-danger-600 text-danger-100',
    title: 'Documentation <span class=\'italic under\'>Search</span>',
    text: 'If your AI doesn\'t know the answer, it will email you and let you know what\'s missing.',
  },
])
</script>

<template>
  <div class="relative">
    <div class="relative z-10 mx-auto max-w-6xl">
      <div class="pt-6 lg:pt-16">
        <dl class="space-y-10 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
          <div v-for="(benefit, i) in benefits" :key="i">
            <div class="font-brand mt-5">
              <dt class="text-2xl font-bold" v-html="benefit.title" />
              <dd class="mt-2 text-xl font-medium">
                {{ benefit.text }}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.angled-shape {
  clip-path: polygon(0 0, 100% 0, 121% 100%, 0 100%, 12% 0, 0 0%);
}
</style>
