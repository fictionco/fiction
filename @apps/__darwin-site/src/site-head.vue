<template>
  <div class="site-head">
    <div class="site-head-pad">
      <site-logo />
    </div>
  </div>
</template>
<script lang="ts">
export default {
  components: {
    "site-logo": () => import("./el/brand.vue"),
  },
  data() {
    return {
      toggle: false,
    }
  },
}
</script>
<style lang="less">
.site-head {
  padding: 1rem 1rem;
  width: 100%;
  position: fixed;
  z-index: 110;
  background: var(--color-bg);
  @media (max-width: 900px) {
    padding: 0 0.5em;
  }
  transition: all 0.3s;
  will-change: padding;
}
.factor-site {
  .site-head {
    opacity: 0;
  }
  &.scrolled,
  &.top {
    .site-head {
      opacity: 1;
    }
  }
  &.scrolled {
    .site-head {
      padding: 0rem 1rem;
      background: var(--color-bg);
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
}

.site-head-pad {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem auto;
  max-width: 1200px;
  height: 55px;
  margin: 0 auto;
  padding: 0 2rem;

  .brand {
    display: flex;
    width: 140px;
  }
}
</style>
