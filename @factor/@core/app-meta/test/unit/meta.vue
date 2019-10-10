<template>
  <h1>Meta</h1>
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
      title: "meta title",
      titleTemplate: "%s template",
      description: "this is the description",
      image: require("./factor.png"),
      htmlAttrs: {
        lang: "fr",
        amp: true
      }
    }
  }
}
</script>
