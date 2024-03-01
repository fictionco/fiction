<script lang="ts" setup>
import { ref } from 'vue'

const list = ref([
  {
    category: 'Data',
    title: 'CX Analytics',
    description:
      'Event analytics that help you understand everything that happens with your customer.',
    bg: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2971&q=80',
  },
  {
    category: 'Feedback',
    title: 'Forms + Surveys',
    description:
      'Understand your customer satisfaction and NPS. Increase retention and word-of-mouth.',
    bg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2971&q=80',
  },
  {
    category: 'Intelligence',
    title: 'Dashboards',
    description:
      'Create custom dashboards and visualize what matters to you and your business. ',

    bg: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80',
  },
])
</script>

<template>
  <section class="mx-auto">
    <div class="mx-auto mt-48 text-center">
      <h2
        class="m-scroll text-4xl font-black tracking-tighter text-primary-500 md:text-8xl"
        :style="{ lineHeight: '1.5em' }"
      >
        <div class="m-scroll-title">
          <span
            v-for="item in 20"
            :key="item"
            class="scroll-text bg-gradient-to-br from-slate-200 to-slate-400 box-decoration-clone bg-clip-text pr-12 text-transparent"
          ><span>Know Your Customer</span></span>
        </div>
      </h2>
    </div>
    <div
      class="relative z-10 mx-auto mt-12 -mb-12 grid max-w-7xl grid-cols-12 gap-6 px-6"
    >
      <div
        v-for="(item, i) in list"
        :key="i"
        class="bg-theme-900 relative col-span-12 w-full overflow-hidden rounded-lg bg-cover text-left text-white shadow-lg ring-1 ring-white/10 md:col-span-4 md:mx-auto"
      >
        <div
          class="bg-theme-800 absolute z-10 h-full w-full opacity-90 transition-all hover:bg-primary-500"
        />
        <div class="pointer-events-none relative z-10 p-10">
          <h5
            class="mb-2 bg-gradient-to-r from-amber-200 to-amber-300 box-decoration-clone bg-clip-text text-sm font-bold uppercase tracking-wider text-transparent"
          >
            {{ item.category }}
          </h5>
          <h3 class="mb-2 text-4xl font-black tracking-tight">
            {{ item.title }}
          </h3>
          <p class="text text-white">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less">
.m-scroll {
  display: flex;
  position: relative;

  height: 1.5em;
  margin: auto;
  overflow: hidden;
  z-index: 1;

  .m-scroll-title {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    transition: all 1s ease;
    & > .scroll-text {
      transform: translateX(-50%);
      animation: scrollText 100s infinite linear;
    }
  }
}

/*div:hover {
  animation-play-state: paused;
}*/
@keyframes scrollText {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-300%);
  }
}
</style>
