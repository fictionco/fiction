<template>
  <div class="nav-sidebar" @click.stop>
    <div ref="nav" class="sidebar-inner">
      <div v-if="mode == 'mobile'" class="site-links">
        <template v-for="(item, index) in setting('site.nav')">
          <div v-if="item.subnav" :key="index" class="navbar-item has-dropdown is-hoverable">
            <factor-link :path="item.path" class="navbar-link">
              <span>{{ item.name }}</span>
            </factor-link>
            <div class="navbar-dropdown">
              <template v-for="(sub, subindex) in item.subnav">
                <factor-link :key="subindex" :path="sub.path" class="navbar-item">
                  <factor-icon v-if="sub.icon" :icon="sub.icon" />
                  <span>{{ sub.name }}</span>
                </factor-link>
              </template>
            </div>
          </div>
          <factor-link v-else :key="index" :path="item.path" class="navbar-item">
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span>{{ item.name }}</span>
          </factor-link>
        </template>
      </div>
      <div class="buttons">
        <factor-link
          :path="setting('site.navCta.path')"
          class="button is-outlined is-rounded"
          target="_blank"
        >
          {{ setting("site.navCta.name") }}
          <factor-icon icon="arrow-right" class="ml-2" />
        </factor-link>
      </div>
    </div>
  </div>
</template>
<script>
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/tools"
export default {
  components: { factorLink, factorIcon },
  props: {
    mode: { type: String, default: "" }
  },
  methods: { setting }
}
</script>

<style lang="less">
// Nav Sidebar
.nav-sidebar {
  position: fixed;
  top: 45px;
  padding-bottom: 5em;
  overflow: scroll;
  height: calc(~"100vh - 45px");
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  .site-links {
    font-size: 1.2em;
    border-bottom: 1px solid #eee;
    padding-bottom: 1em;
    margin-bottom: 1.5em;
    a {
      color: inherit;
      display: block;
      padding: 4px 0;
      .fa {
        margin-left: 5px;
        opacity: 0.3;
      }
    }
  }
  .button {
    font-size: 1.2em;
  }
  .sidebar-inner {
    max-width: 300px;
    padding: 40px 20px 60px 50px;
  }
}
</style>
