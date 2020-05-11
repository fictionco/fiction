<template>
  <div class="single-entry">
    <component
      :is="setting(`jobs.components.${comp}`)"
      v-for="(comp, i) in setting('jobs.layout.single')"
      :key="i"
      :post-id="post._id"
    />
  </div>
</template>
<script lang="ts">
import { setting, stored, titleTag, descriptionTag, shareImage } from "@factor/api"
export default {
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id),
    }
  },
  computed: {
    post() {
      return stored("post") || {}
    },
  },
  methods: { setting },
}
</script>

<style lang="less">
.plugin-jobs {
  .single-entry {
    max-width: 48rem;
    margin: 0 auto;
    padding: 3rem 0;

    @media (max-width: 767px) {
      padding: 3rem 1rem;
    }

    .post-entry {
      padding: 0;
      margin: 0 auto;
    }
  }
}
</style>
