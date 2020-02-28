<template>
  <div class="portfolio-wrap">
    <router-view />
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  methods: { setting }
})
</script>
