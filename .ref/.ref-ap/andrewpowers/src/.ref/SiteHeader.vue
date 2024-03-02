<template>
  <div
    class="header mx-auto flex max-w-screen-md items-center justify-between p-6"
  >
    <div class="logo">
      <router-link
        to="/"
        class="hover:text-primary-600 pl-font-title block rounded-md text-2xl font-bold transition-all"
      >
        AP
      </router-link>
    </div>
    <div class="space-x-6 text-xl">
      <span class="text-theme-500 italic">Companies &rarr;</span>
      <a
        href="https://www.fiction.com"
        class="decoration-theme-300 font-medium hover:underline"
        target="_blank"
      >Fiction.com</a>
      <!-- <RouterLink
        to="/about"
        class="decoration-theme-300 hover:underline"
        active-class="underline text-theme-900"
        >About</RouterLink
      > -->
      <!-- <RouterLink
        to="/resume"
        class="decoration-theme-300 hover:underline"
        active-class="underline text-theme-900"
        >Resume</RouterLink
      > -->
    </div>
  </div>
</template>
