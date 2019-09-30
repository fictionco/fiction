<template>
  <h1>Async</h1>
</template>

<script>
export default {
  metaInfo() {
    return this.$store.val("test") || {}
  },
  serverPrefetch() {
    return this.prefetch()
  },
  methods: {
    async prefetch() {
      const r = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: "async-title",
            description: "async-description"
          })
        }, 100)
      })

      this.$store.add("test", r)
      return
    }
  }
}
</script>
