<template>
  <div class="docs-engine-wrap">
    <div class="sidebar-area">
      <div class="sidebar-wrap">
        <div class="search-panel">
          <doc-search />
        </div>

        <div class="sidebar-toggle">
          <factor-btn
            btn="default"
            class="toggle-button"
            :class="vis ? 'active' : ''"
            @click.stop="toggleNav()"
          >
            <mobile-toggle :active="vis" />
            <span class="text">Docs Menu</span>
          </factor-btn>
        </div>

        <div class="sidebar" :class="vis ? 'show-mobile' : 'standard'">
          <div class="nav-wrap">
            <div class="nav">
              <div
                v-for="(group, i) in nav"
                :key="i"
                class="nav-group"
                :class="selectedGroup == group.title ? 'selected' : ''"
              >
                <div
                  v-if="group.title"
                  class="nav-group-title"
                  @click.stop="toggleGroupTitle(group)"
                >
                  <factor-icon class="ico" :icon="group.icon || `fas fa-angle-down`" />
                  <span class="title">{{ group.title }}</span>
                </div>
                <div v-if="!group.title || selectedGroup == group.title" class="group-items">
                  <factor-link
                    v-for="(link, ii) in group.items"
                    :key="ii"
                    :path="link.path || `${baseRoute}/${link.doc}`"
                  >
                    <span class="ico" />
                    <span v-formatted-text="link.title || toLabel(link.doc)" class="link" />
                  </factor-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="view-area">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { setting, toLabel } from "@factor/api"
import { factorLink, factorIcon, factorBtn } from "@factor/ui"
import { activeDocGroup, DocConfig } from "../util"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    factorBtn,
    mobileToggle: () => import("./mobile-toggle.vue"),
    docSearch: () => import("./search.vue"),
  },
  // Injected components wont load metaInfo
  metaInfo: {
    link: [
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.0/css/all.min.css",
      },
    ],
  },
  data() {
    return {
      vis: false,
      selectedGroup: "",
      nav: setting("docsEngine.nav"),
    }
  },
  computed: {
    baseRoute() {
      return setting("docsEngine.baseRoute") ?? "/docs"
    },
    doc(this: any) {
      return this.$route.params.doc
    },
  },
  watch: {
    $route: {
      handler: function (this: any) {
        this.setActiveGroup()
      },
    },
  },

  async created() {
    this.setActiveGroup()
  },
  methods: {
    toLabel,
    async setActiveGroup(this: any) {
      this.selectedGroup = await activeDocGroup(this.doc)
    },
    toggleGroupTitle(this: any, group: DocConfig) {
      if (this.selectedGroup == group.title) {
        this.selectedGroup = ""
      } else {
        this.selectedGroup = group.title
      }
    },
    toggleNav(this: any) {
      this.vis = !this.vis

      this.clickHandler = () => {
        this.vis = false
        document.removeEventListener("click", this.clickHandler)
      }

      if (this.vis) {
        document.addEventListener("click", this.clickHandler)
      } else {
        document.removeEventListener("click", this.clickHandler)
      }
    },
  },
})
</script>

<style lang="less">
.docs-engine-wrap {
  margin-top: 3rem;
  --content-width: 1000px;
  --panel-shadow: 0 0 0 2px rgba(0, 43, 93, 0.1), 0 0 1px rgba(58, 55, 148, 0.25),
    0 3px 3px 0 rgba(24, 32, 41, 0.06), 0 6px 14px -10px rgba(24, 32, 41, 0.04);
  --panel-shadow-inset: inset 0 0 0 1px rgba(0, 43, 93, 0.06),
    inset 0 0 1px rgba(58, 55, 148, 0.25), inset 0 -12px 34px 0 rgba(24, 32, 41, 0.03);
  --dropdown-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
    0 30px 60px -30px rgba(0, 0, 0, 0.3), 0 -18px 60px -10px rgba(0, 0, 0, 0.025);
  --menu-shadow: 0 0 0 1px rgba(50, 50, 93, 0.1), 0 2px 5px -1px rgba(50, 50, 93, 0.25),
    0 15px 15px -6px rgba(50, 50, 93, 0.2), 0 1px 3px -1px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 3fr;
  box-shadow: var(--panel-shadow-inset);
  position: relative;
  @media (max-width: 1100px) {
    margin-top: 0rem;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
  .view-area {
    min-height: 50vh;
    min-width: 0;
  }
  .search-panel {
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    .search-area {
      width: 300px;
      @media (max-width: 900px) {
        width: 100%;
      }
    }
  }
  .sidebar-area {
    z-index: 200;
    position: relative;
    border-top: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
    .sidebar-wrap {
      position: sticky;
      top: 3rem;

      height: calc(~"100vh - 3rem");
    }
    .sidebar {
      position: relative;

      display: flex;
      justify-content: flex-end;

      // background-color: #fbfcfd;

      z-index: 0;
      height: 100%;
      overflow: auto;
      .nav {
        width: 300px;
        font-weight: 600;
        padding: 1rem;
        padding-bottom: 6rem;
        .nav-group {
          border-bottom: 1px solid var(--color-border);
          &:last-child {
            border-bottom: none;
          }
          .nav-group-title,
          a {
            user-select: none;
            padding: 0.4rem 0.5rem 0.4rem 1rem;
            display: grid;
            grid-template-columns: 0.75rem 1fr;
            grid-gap: 5px;
            border-radius: 5px;
            align-items: center;
            font-weight: 700;
            font-size: 0.9em;
            cursor: pointer;
            &.router-link-exact-active,
            &:hover {
              background: var(--color-bg-contrast);
              color: var(--color-primary);
            }
            .ico {
              text-align: center;
            }
          }
          .nav-group-title {
            padding-top: 1rem;
            padding-bottom: 1rem;
            font-size: 0.85em;
            color: var(--color-text-secondary);
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .group-items {
            padding: 0.5rem 0;
          }

          &.selected,
          &:hover {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            .nav-group-title {
              color: var(--color-text);
            }
          }

          a {
            color: inherit;
          }
        }
      }
    }
    .sidebar-toggle {
      display: none;
      padding: 0.5rem 0;
      .toggle-button {
        .btn-content {
          display: flex;
          align-items: center;
          .mobile-toggle {
            margin-right: 0.5rem;
          }
        }
        text-transform: uppercase;
        font-size: 0.9em;
        font-weight: 700;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        letter-spacing: 1.5px;
        color: var(--color-text-secondary);
        .factor-icon {
          transition: transform 0.2s;
          margin-right: 0.5rem;
        }
        &.active {
          .factor-icon {
            transform: rotateZ(180deg);
          }
        }
      }
    }

    @media (max-width: 900px) {
      margin: 1rem;
      border: none;
      .sidebar-toggle {
        display: flex;
      }
      .sidebar-wrap {
        position: relative;
        top: auto;
        height: auto;
        padding-bottom: 0;
      }
      .sidebar {
        height: auto;
        position: absolute;
        left: 0;
        //  transform: translateX(-50%);
        top: 100%;
        background: var(--color-bg);
        z-index: 100;
        max-height: 90vh;
        box-shadow: var(--menu-shadow);
        border: none;
        border-radius: 5px;
        display: none;
        &.show-mobile {
          display: block;
        }
        .nav {
          padding: 0;
        }
      }
    }
  }
}
</style>
