<template>
  <div>
    <div class="py-10">
      <div class="mx-auto max-w-xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div class="text-center">
          <a
            href="https://www.twitter.com/arpowers"
            class="hover:text-primary-500 text-base font-semibold tracking-wide text-slate-500 transition-all hover:scale-105 md:text-lg"
          >
            @arpowers
          </a>
          <p
            class="mt-3 bg-gradient-to-br from-white to-white box-decoration-clone bg-clip-text text-4xl font-extrabold text-transparent sm:text-4xl sm:tracking-tight"
          >
            Andrew Powers
          </p>
          <p
            class="mx-auto mt-5 max-w-xl bg-gradient-to-br from-slate-100 to-slate-300 box-decoration-clone bg-clip-text text-lg text-transparent transition-all"
          >
            I am an entrepreneur and interaction developer with a focus on data
            & AI. Passionate about philosophy, mathematics, and the wisdom of
            antiquity.
          </p>
          <p
            class="mx-auto mt-5 max-w-xl text-xs uppercase tracking-widest text-slate-500"
          >
            Newport Beach, CA &mdash; Park City, UT
          </p>

          <div class="mt-8 text-center">
            <ElAvatar
              email="arpowers@gmail.com"
              class="inline-block h-16 w-16 rounded-full bg-transparent ring-2 ring-white"
            ></ElAvatar>
          </div>
        </div>
        <SocialLinks></SocialLinks>
      </div>
    </div>
    <div class=""></div>
  </div>
</template>
<script setup lang="ts">
import ElAvatar from "@factor/ui/ElAvatar.vue"
import SocialLinks from "./SocialLinks.vue"
</script>
