<script lang="ts" setup>
import { vue } from '@factor/api'

const benefits = vue.ref([
  {
    icon: `i-heroicons-beaker`,
    class: 'bg-rose-600 text-rose-100',
    title: 'First of its Kind',
    text: 'Fiction is the first personal AI platform for professionals',
  },
  {
    icon: `i-heroicons-server-stack`,
    class: 'bg-primary-600 text-primary-100',
    title: 'Combine Concepts',
    text: 'Just a few clicks to train and use multi-concept AI models.',
  },
  {
    icon: `i-heroicons-document`,
    class: 'bg-danger-600 text-danger-100',
    title: 'Advanced AI, No Coding',
    text: 'Built for people that pay attention to details, but don\'t want to code.',
  },
])
</script>

<template>
  <div class="relative">
    <div class="relative z-10 mx-auto max-w-6xl">
      <div class="pt-6 lg:pt-16">
        <dl class="space-y-10 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
          <div v-for="(benefit, i) in benefits" :key="i">
            <div class="mt-5">
              <dt class="text-2xl font-extrabold leading-6 tracking-tight">
                {{ benefit.title }}
              </dt>
              <dd class="mt-2 text-xl font-medium text-slate-400">
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
