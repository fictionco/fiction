<template>
  <div class="site-head">
    <div class="site-head-pad">
      <div class="brand">
        <factor-link path="/">
          <primary-logo />
        </factor-link>
      </div>
      <div class="nav">
        <factor-link path="/docs">Docs</factor-link>
        <factor-link path="/themes">Themes</factor-link>
        <factor-link path="/plugins">Plugins</factor-link>

        <factor-link path="https://gitter.im/factorjs/community" target="_blank">
          <factor-icon icon="gitter" />
          <span>Community</span>
        </factor-link>
        <factor-link path="https://github.com/fiction-com/factor" target="_blank">
          <factor-icon icon="github" />
          <span>Github</span>
        </factor-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "primary-logo": () => import("./el/logo-factor")
  },
  data() {
    return {}
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
    a img {
      width: 80px;
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
      color: #506677;
      margin: 0 1em;
      @media (max-width: 767px) {
        margin: 0 1em;
        .fa {
          display: none;
        }
      }
      &:hover,
      &.active-path {
        color: #0496ff;
      }
      &:active {
        color: #ff0076;
      }
      &.factor-link {
        .fa {
          margin-right: 4px;
          opacity: 0.7;
          color: #0496ff;
        }
      }
    }
    .profile-menu {
      margin-left: 1em;
    }

    .nav-dropdown-toggle {
      padding: 4px 6px;
      font-weight: 500;
      border-radius: 4px;
      &.active,
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
</style>