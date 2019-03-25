<template>
  <div class="site-head">
    <div class="site-head-pad">
      <div class="brand">
        <factor-link path="/">
          <site-logo theme="muted" />
        </factor-link>
      </div>
      <div class="nav">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "site-logo": () => import("./el/logo")
  },
  data() {
    return {}
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
    .search {
      border-radius: 4px;
      flex-grow: 1;
      max-width: 600px;
      padding: 4px 1em;
      color: rgba(38, 67, 89, 0.4);

      background: #f3f5fa;
      margin: 0 2em;
      font-size: 0.9em;
      line-height: 1.6;
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
      &.active {
        color: #0496ff;
      }
      &:active {
        color: #ff0076;
      }
    }
    .profile-menu {
      margin-left: 1em;
      // .avatar {
      //   background-color: rgba(38, 67, 89, 0.06);
      // }
    }
    // > a,
    // .nav-dropdown {
    //   margin-left: 0.5em;
    // }
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