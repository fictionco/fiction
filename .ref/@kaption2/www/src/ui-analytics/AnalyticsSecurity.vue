<script lang="ts" setup>
import screenSecurity from './img/analyticsSecurityScreen.webp'
import thumbBotCountry from './img/analyticsSecurityBotCountry.webp'
</script>

<template>
  <div class="my-12">
    <div class="figure-stage relative m-auto max-w-screen-lg">
      <img
        class="rounded-md shadow-xl ring-1 ring-black/10"
        :src="screenSecurity"
      >

      <img
        class="absolute -bottom-7 -right-7 w-[27rem] rounded-md shadow-2xl ring-1 ring-black/10"
        :src="thumbBotCountry"
      >
    </div>
  </div>
</template>
