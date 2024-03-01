<script setup lang="ts">
import type { FactorUser } from '@factor/api'
import { useService } from '@factor/api'
import ElLogo from './ElLogo.vue'
import ElNav from './ElNav.vue'

useService<{ factorUser: FactorUser }>()
</script>

<template>
  <div class="relative z-30">
    <div class="header mx-auto flex max-w-screen-xl justify-between px-6 py-4">
      <div class="logo col-span-4 flex items-center">
        <RouterLink to="/">
          <ElLogo class="w-24" />
        </RouterLink>
      </div>

      <div class="nav col-span-8 items-end justify-end space-x-4 lg:flex">
        <ElNav />
      </div>
    </div>
  </div>
</template>
