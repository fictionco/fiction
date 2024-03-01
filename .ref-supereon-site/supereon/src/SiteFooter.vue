<script lang="ts" setup>
import { dayjs } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import ElLogo from './ElLogo.vue'
import ElNavFooter from './ElNavFooter.vue'
import ShootingStar from './ShootingStar.vue'
</script>

<template>
  <footer class="">
    <div
      class="from-theme-950 to-theme-950 relative overflow-hidden bg-gradient-to-br py-40 text-white"
    >
      <div class="relative z-30 mx-auto max-w-3xl text-center">
        <div class="font-cal mb-8 text-3xl leading-tight md:text-6xl">
          It's Time to Start With AI
        </div>
        <div class="text-lg font-medium md:text-3xl">
          Let us handle the heavy lifting.
        </div>
        <div class="mt-12">
          <ElButton
            href="/contact"
            btn="primary"
            size="xl"
          >
            Schedule A Call &rarr;
          </ElButton>
        </div>
      </div>
      <ShootingStar class="absolute inset-0" />
    </div>
    <div
      class="from-theme-900 to-theme-900 border-theme-800 border-t bg-gradient-to-b py-12 text-white"
    >
      <div class="mx-auto max-w-screen-lg">
        <div
          class="flex flex-col items-center space-y-8 md:flex-row md:justify-between md:space-y-0"
        >
          <RouterLink to="/">
            <ElLogo class="w-40" />
          </RouterLink>
          <div class="">
            <ElNavFooter />
          </div>
        </div>
        <div
          class="text-theme-500 mt-12 flex flex-col items-center justify-center space-y-8 text-xs md:flex-row md:justify-between md:space-y-0"
        >
          <div>
            Based in
            <a href="#" class="text-theme-400">Irvine, California</a> /
            <a href="#" class="text-theme-400">Salt Lake, Utah</a>
          </div>
          <div class="text-center md:text-right">
            <p>
              &copy; {{ dayjs().format("YYYY") }}
              <a class="text-theme-300" href="https://www.supereon.ai">Supereon, LLC</a>
            </p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
