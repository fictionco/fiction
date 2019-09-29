<template>
  <h1>Basic</h1>
</template>

<script>
export default {
  data() {
    return {
      text: "nope"
    }
  },
  metaInfo() {
    return {
      title: "title",
      titleTemplate: "%s - template",
      description: "the description",
      htmlAttrs: {
        lang: "en",
        amp: true
      }
    }
  }
}
</script>
