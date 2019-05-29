<template>
  <div class="site-head">
    <div class="site-head-pad">
      <site-brand class="site-brand" />

      <div class="primary-nav">
        <factor-link v-for="(item, index) in settings.nav" :key="index" :path="item.path">
          <factor-icon v-if="item.icon" :icon="item.icon" />
          <span>{{ item.name }}</span>
        </factor-link>
      </div>
    </div>
  </div>
</template>
<script>
import settings from "#/settings"
export default {
  components: {
    "site-brand": () => import("./el/brand")
  },
  data() {
    return { settings }
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

  .primary-nav {
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
      &.router-link-active {
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