<template>
  <div class="portfolio-wrap">
    <router-view />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
export default {
  methods: { setting },
}
</script>
