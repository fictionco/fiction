<template>
  <div class="page-landing">
    <section class="feature">
      <h1 class="font-sans text-xl text-gray-800 text-center">Theme Zeno</h1>
      <p>Testing Tailwind CSS</p>
    </section>
  </div>
</template>

<script>
import { setting } from "@factor/tools"
export default {
  data() {
    return {
      loading: true
    }
  },
  metaInfo() {
    return {
      title: setting("home.meta.title"),
      description: setting("home.meta.description")
    }
  },
  methods: { setting }
}
</script>

<style lang="less">
.feature{
  text-align: center;
}
</style>
