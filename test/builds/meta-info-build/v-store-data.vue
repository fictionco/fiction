<template>
  <h1>{{ text }}</h1>
</template>

<script lang="ts">
import { storeItem, stored } from "@factor/tools"
import Vue from "vue"

export default Vue.extend({
  data() {
    return {}
  },
  computed: {
    text() {
      return stored("text")
    }
  },
  created() {
    storeItem("text", "loaded")
  }
})
</script>
