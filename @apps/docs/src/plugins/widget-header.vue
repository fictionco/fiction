<template>
  <section class="plugins-widget-header">
    <div class="content-pad">
      <div class="header-content">
        <div v-if="image" class="header-image">
          <img :src="require(`./img/${image}`)" :alt="title" />
        </div>
        <div>
          <h1 class="page-title">{{ title }}</h1>
          <div class="page-title-sub">
            <slot name="subtitle"></slot>
          </div>
        </div>
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
    title: { type: String, default: "", required: true }
  }
}
</script>
<style lang="less">
.plugins-widget-header {
  background-image: url("./img/dot.svg");
  overflow: hidden;
  box-shadow: inset 0 0 1px 3px rgba(0, 0, 0, 0.03);

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
      //margin: 0 0 .5rem;
      letter-spacing: -0.03em;
    }
    .page-title-sub {
      font-size: 1.6em;
      opacity: 0.7;
    }
    @media (max-width: 900px) {
      padding: 3rem 0;
      .page-title {
        font-size: 2.4rem;
        line-height: 1.3;
      }
      .page-title-sub {
        font-size: 1.4rem;
        line-height: 1.3;
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