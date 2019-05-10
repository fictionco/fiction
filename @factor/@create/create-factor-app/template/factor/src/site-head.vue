<template>
  <div class="site-head">
    <div class="site-head-pad">
      <div class="brand">
        <factor-link path="/">{{ siteName }}</factor-link>
      </div>
      <div class="nav">
        <slot />
        <plugin-signin-profile-menu v-if="$uid" />
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
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.25), 0 1px 15px rgba(0, 0, 0, 0.03);
  background: #fff;
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
      color: var(--color-text);
      margin: 0 1em;
      @media (max-width: 767px) {
        margin: 0 0.5em;
      }
      &:hover,
      &.active-path {
        color: var(--color-primary);
      }
      &:active {
        color: var(--color-secondary);
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