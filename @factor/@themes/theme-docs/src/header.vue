<template>
  <div class="site-head">
    <div class="site-head-pad">
      <site-brand class="site-brand" />

      <div class="primary-nav">
        <template v-for="(item, index) in $setting.get('site.nav')">
          <component :is="item.component" v-if="item.component" :key="index" />
          <factor-link v-else :key="index" :path="item.path">
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span>{{ item.name }}</span>
          </factor-link>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "site-brand": () => import("./el/brand")
  }
}
</script>
<style lang="less">
.nav-light:not(.scrolled) .site-head {
  color: #fff;
  background: transparent;
}

.site-head {
  transition: all 0.3s;

  padding: 0 1.5em;
  position: fixed;
  width: 100%;
  z-index: 50;
  font-weight: var(--font-weight-bold, 600);
}

.scrolled .site-head {
  background: #fff;
}

.site-head-pad {
  height: 45px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .primary-nav {
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
        margin: 0 1em;
        .fa {
          display: none;
        }
      }
      &:hover,
      &.router-link-active {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.5;
      }
      &.factor-link {
        .fa {
          margin-right: 4px;
          opacity: 0.7;
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