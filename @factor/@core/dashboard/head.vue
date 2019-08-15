<template>
  <div class="dashboard-head">
    <div class="dashboard-head-pad">
      <factor-link path="/" class="brand">
        <div class="icon">
          <img :src="$setting.get('dashboard.icon', iconUrl)" />
        </div>
        <div class="name">{{ $config.setting('app.name') }}</div>
      </factor-link>
      <div class="nav">
        <slot />
        <plugin-signin-profile-menu :show-name="true" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    iconUrl() {
      return require("#/icon.png");
    }
  }
};
</script>
<style lang="less">
.dashboard-head {
  position: relative;
  z-index: 10;
}

.dashboard-head-pad {
  //height: 45px;
  align-items: center;
  display: flex;
  justify-content: space-between;

  .brand {
    display: flex;
    flex-grow: 1;
    align-items: center;
    color: inherit;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.9;
      color: inherit;
    }
    .icon {
      margin-right: 0.5em;
      display: block;
      width: 2em;
      img {
        width: 100%;
        display: block;
        border-radius: 5px;
        box-shadow: 0 2px 5px 0 rgba(60, 66, 87, 0.1),
          0 1px 1px 0 rgba(0, 0, 0, 0.07);
      }
    }
    .name {
      font-weight: var(--font-weight-bold);
    }
  }
  .nav {
    font-weight: var(--font-weight-bold);
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