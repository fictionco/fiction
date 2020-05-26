<template>
  <div class="view-contact">
    <page-header title="Contact Form" sub-title="Plugin Demo" />
    <component :is="setting('contactForm.form')" />
  </div>
</template>


<script lang="ts">
import { setting } from "@factor/api"

export default {
  components: {
    pageHeader: () => import("./page-header.vue"),
  },
  data() {
    return {
      loading: true,
    }
  },
  metaInfo() {
    return {
      title: "Contact Form Demo",
      description: "Factor Contact Form plugin demo",
    }
  },
  methods: { setting },
}
</script>
<style lang="less">
.view-contact {
  margin: 2em auto;
  max-width: 600px;
  padding: 1rem;
}
</style>
