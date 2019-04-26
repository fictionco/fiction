<template>
  <div class="page-work">
    <router-view />
    <el-cta />
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta")
  },
  props: {
    post: { type: Object, default: () => {} }
  },
  data() {
    return {
      loading: false
    }
  }
}
</script>

<style lang="less">
.page-work {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .factor-btn.default {
    color: var(--color-primary);
    letter-spacing: -0.03em;
  }

  .posts {
    padding: 6em 0;
    .posts-inner {
      display: grid;
      grid-gap: 20px 30px;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-row-gap: 100px;
      }
      // .post-item {
      //   text-align: center;
      //   &:nth-last-of-type(odd) {
      //     margin-top: 120px;
      //     @media (max-width: 767px) {
      //       margin: 0;
      //     }
      //   }
      //   .img-wrap {
      //     background-size: cover;
      //     background-position: center;
      //     background-repeat: no-repeat;
      //     height: 550px;
      //     margin-bottom: 1em;
      //     transform: scale(1);
      //     transition: all 0.2s ease-in-out;
      //     &:hover {
      //       transform: scale(0.95);
      //     }
      //   }
      //   .title {
      //     font-weight: 600;
      //   }
      //   .category {
      //     opacity: 0.5;
      //   }
      // }
    }
  }
}
</style>