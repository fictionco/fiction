<template>
  <section class="plugins-widget-header">
    <div class="content-pad">
      <div class="header-content">
        <div class="entry-image">
          <img v-if="image" :src="require(`./img/${image}`)" :alt="title" />
        </div>
        <h1 class="page-title">{{ title }}</h1>
        <h3 class="page-title-sub">
          <slot name="subtitle"></slot>
          <!-- {{ subtitle }} -->
          <!-- <span v-if="post.author">by {{ post.author }}</span>
          <span v-if="post.categories">in{{ post.categories }}</span>
          <span v-if="post.downloads">{{ post.downloads }} Downloads</span>-->
        </h3>
      </div>
      <div class="header-figure">
        <slot name="figure"></slot>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    image: { type: String, default: "" },
    title: { type: String, default: "", required: true },
    subtitle: { type: String, default: "" }
  }
  // computed: {
  //   post() {
  //     return this.$store.val(this.postId) || {}
  //   }
  // }
}
</script>
<style lang="less">
.plugins-widget-header {
  background-image: url("./img/dot.svg");
  overflow: hidden;

  .content-pad {
    display: grid;
    grid-template-columns: 4fr 3fr;
  }

  .header-content {
    padding: 4em 0;

    .page-title {
      font-size: 3.5em;
      line-height: 1.1;
      font-weight: 500;
      margin: 0 0 1rem;
      letter-spacing: -0.03em;
    }
    .page-title-sub {
      font-size: 1.6em;
      opacity: 0.7;
    }
    @media (max-width: 900px) {
      padding: 3rem 0;
      .page-title {
        font-size: 1.7em;
        line-height: 1.3;
      }
      .page-title-sub {
        font-size: 1.4em;
        line-height: 1.1;
      }
    }
  }

  .header-figure {
    position: relative;
  }

  @media (max-width: 900px) {
    .content-pad {
      grid-template-columns: 1fr;
    }
  }
}
</style>