<template>
  <div class="site-head blue">
    <div class="site-head-pad">
      <div class="brand">
        <factor-link path="/">
          <site-logo />
        </factor-link>
      </div>
      <div class="nav">
        <slot name="nav" />
      </div>
      <div class="social">
        <slot name="social" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "site-logo": () => import("./el/factor-logo")
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

  position: relative;
  z-index: 10;
  &.blue {
    background: #1a49bd;
    color: #fff;
  }
}

.site-head-pad {
  height: 75px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .brand {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .nav {
    font-weight: 600;
    display: flex;
    flex: 2;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;

    @media (max-width: 767px) {
      flex-grow: 2;
      justify-content: flex-end;
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
  .social {
    flex: 1;
    text-align: right;
  }
  .nav,
  .social {
    > a {
      letter-spacing: 0.08em;
      font-size: 0.9em;
      font-weight: 300;
      color: #fdfdfd;
      margin: 0 0.5em;
      &:hover,
      &.active {
        color: #9afecb;
      }
      &:active {
        color: #9afecb;
      }
    }
  }
}
</style>