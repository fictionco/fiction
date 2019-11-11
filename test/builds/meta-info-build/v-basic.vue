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
      titleTemplate: "%s template",
      description: "this is the description",
      image: require("./factor.png"),
      htmlAttrs: {
        lang: "en",
        amp: true
      }
    }
  }
}
</script>
