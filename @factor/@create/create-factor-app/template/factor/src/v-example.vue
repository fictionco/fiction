<template>
  <div class="home-page">
    <section class="mast">
      <div class="splash">
        <div>
          <h1 class="title">
            <span class="alt">Example Page</span>
          </h1>
          <h4>Just a quick example page</h4>
        </div>
      </div>
    </section>
    <section class="mast">
      <tour-grid theme="light" />
    </section>
  </div>
</template>
<script>
import { name, description } from "../package"

export default {
  components: {
    "tour-grid": () => import("./el/tour-grid")
  },
  computed: {
    siteName() {
      return this.$utils.toLabel(name)
    },
    description() {
      return description || ""
    }
  },
  metatags() {
    return {
      title: `Example Page`,
      description: this.description
    }
  }
}
</script>


<style lang="less">
.home-page {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }
  .splash {
    padding: 7em 0;
    text-align: center;
    @media (max-width: 767px) {
      padding: 4em 0;
    }
    .title {
      font-weight: 400;
      font-size: 3em;
      letter-spacing: -0.03em;
      line-height: 1.3em;
      margin-bottom: 0.2em;
      @media (max-width: 767px) {
        font-size: 2em;
      }
      .alt {
        display: block;
        font-weight: 800;
      }
    }
  }
}
</style>