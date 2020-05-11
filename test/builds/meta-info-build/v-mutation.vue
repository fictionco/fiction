<template>
  <h1>Mutation</h1>
</template>

<script lang="ts">
export default {
  data() {
    return {
      title: "change-title",
      description: "change-description",
    }
  },
  metaInfo(this: any) {
    return {
      title: this.title,
      description: this.description,
    }
  },
}
</script>
