<script setup lang="ts">
import { vue } from '@factor/api'
import ElLogo from './ElLogo.vue'
import { useSiteService } from './inject'

const { factorUser, factorRouter } = useSiteService()
const activeUser = factorUser.activeUser

const nav = vue.ref([{ name: 'Login / Register', value: '/' }])
</script>

<template>
  <div class="header grid grid-cols-12 p-4 font-medium">
    <RouterLink class="logo col-span-4 flex items-end" to="/">
      <ElLogo />
    </RouterLink>
    <div class="nav flex space-x-10 col-span-8 justify-end items-end text-xs">
      <span v-for="item in nav" :key="item.value">
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
