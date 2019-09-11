<template>
  <transition name="fade">
    <div class="sidebar-container">
      <div class="sidebar-title-container">
        <site-brand class="site-brand" />
      </div>
      <nav>
        <template v-for="(item, index) in $setting.get('site.nav')">
          <factor-link :key="index" :path="item.path" class="nav-link">
            <span>{{ item.name }}</span>
          </factor-link>
        </template>
      </nav>
      <div v-formatted-text="$setting.get('site.copyright')" class="copyright" />
    </div>
  </transition>
</template>

<script>
export default {
  components: {
    "site-brand": () => import("./el/brand")
  },
  props: {
    showSidebar: { type: String, default: () => {} }
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>

<style lang="less" scoped>
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.4s;
// }
// .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
.sidebar-container {
  position: fixed;
  font-family: var(--font-family-primary);
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  color: #f7f7f7;
  background: linear-gradient(90deg, #732b29 -100%, #101010 100%);
  min-height: 100vh;
  height: auto;
  width: 280px;

  @media (max-width: 900px) {
    left: -280px;
    z-index: 10;
  }

  > div:last-child {
    display: flex;
    align-self: end;
    padding: 1rem 2rem;
  }

  nav {
    display: grid;
    align-items: center;
    padding: 0 2em;

    .nav-link {
      color: var(--color-text-gray);
      font-size: 1.4em;
      line-height: 1.2;
      text-decoration: none;
      min-height: 30px;

      &:hover {
        color: var(--color-text);
      }

      // &.router-link-active,
      &.nav-link-selected {
        color: var(--color-text);
        font-weight: var(--font-weight-semibold);
        span {
          position: relative;
          &:after {
            content: "";
            display: block;
            position: absolute;
            right: -54px;
            top: 50%;
            width: 40px;
            height: 3px;
            background: var(--color-primary);
          }
        }
      }
    }
  }

  .copyright {
    font-size: 0.8rem;
  }
}
</style>
