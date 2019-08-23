<template>
  <div class="site-head">
    <div class="site-head-pad">
      <div class="brand">
        <factor-link path="/">{{ siteName }}</factor-link>
      </div>
      <div class="nav">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
import { name, description } from "../package"
export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    siteName() {
      return this.$utils.toLabel(name)
    }
  }
}
</script>
<style lang="less">
.site-head {
  padding: 0 1.5em;

  position: relative;
  z-index: 10;
}

.site-head-pad {
  height: 45px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .brand {
    display: flex;
    flex-grow: 1;
    align-items: center;
    width: 100px;
    a {
      color: inherit;
      font-weight: 700;
    }
  }
  .nav {
    font-weight: 600;
    display: flex;
    align-items: center;
    @media (max-width: 767px) {
      flex-grow: 2;
      justify-content: flex-end;
    }
    > a {
      letter-spacing: -0.03em;
      font-size: 0.9em;
      color: inherit;
      margin: 0 1em;
      @media (max-width: 767px) {
        margin: 0 0.5em;
      }
      &:hover,
      &:active {
        opacity: 0.6;
      }
    }
    .profile-menu {
      margin-left: 1em;
      @media (max-width: 767px) {
        display: none;
      }
    }
  }
}
</style>