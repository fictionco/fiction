<template>
  <h1>Mutation</h1>
</template>

<script>
export default {
  data() {
    return {
      title: "change-title",
      description: "change-description"
    }
  },
  metaInfo() {
    return {
      title: this.title,
      description: this.description
    }
  }
}
</script>
