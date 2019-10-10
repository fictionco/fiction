<template>
  <h1>Init</h1>
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
      title: "init",
      titleTemplate: "%s init",
      description: "init description",
      image: require("./factor.png"),
      htmlAttrs: {
        lang: "en",
        amp: true
      }
    }
  }
}
</script>
