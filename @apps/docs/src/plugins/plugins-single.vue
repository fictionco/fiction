<template>
  <div class="single-plugin-entry plugins-container">
    <section class="header">
      <div class="content-pad">
        <div class="header-content">
          <h1 class="page-title">Single Plugin Entry</h1>
          <h3 class="page-title-sub">Plugin short description.</h3>
        </div>
        <div class="header-figure">
          <!-- <figure-plugins /> -->
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Factor from "vue"
export default {
  data() {
    return {}
  }
  // metaInfo() {
  //   return {
  //     title: this.$post.titleTag(this.post._id),
  //     description: this.$post.descriptionTag(this.post._id),
  //     image: this.$post.shareImage(this.post._id)
  //   }
  // },
  // routeClass() {
  //   return "nav-white"
  // },
  // computed: {
  //   post() {
  //     return this.$store.val("post") || {}
  //   }
  // }
}
</script>

<style lang="less">
.single-plugin-entry {
  .widget-date,
  .entry-meta,
  .post-entry,
  .social-share,
  .author-bio {
    max-width: 50rem;
    margin: 1rem auto;
    padding: 0;
  }

  @media (max-width: 767px) {
    .return-link,
    .entry-headers,
    .post-entry,
    .entry-meta,
    .social-share,
    .author-bio {
      padding: 0 1em;
    }
  }
}
</style>