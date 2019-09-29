<template>
  <h1>{{ text }}</h1>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    text() {
      return this.$store.val("text")
    }
  },
  created() {
    this.$store.add("text", "loaded")
  }
}
</script>
