<template>
  <h1>Mutation</h1>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      title: "change-title",
      description: "change-description",
    }
  },
  metaInfo() {
    return {
      title: this.title,
      description: this.description,
    }
  },
})
</script>
