<template>
  <div class="docs-engine-wrap">
    <div class="sidebar-area">
      <div class="nav">
        <div
          v-for="(group, i) in nav"
          :key="i"
          class="nav-group"
          :class="selectedGroup == group.title ? 'selected' : ''"
        >
          <div v-if="group.title" class="nav-group-title" @click="selectedGroup = group.title">
            <factor-icon class="ico" :icon="group.icon || `fas fa-angle-down`" />
            <span class="title">{{ group.title }}</span>
          </div>
          <div v-if="!group.title || selectedGroup == group.title" class="group-items">
            <factor-link v-for="(link, ii) in group.items" :key="ii" :path="link.path">
              <span class="ico" />
              <span class="link">{{ link.title }}</span>
            </factor-link>
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
import { setting } from "@factor/api"
import { factorLink, factorIcon } from "@factor/ui"
export default Vue.extend({
  components: { factorLink, factorIcon },
  data() {
    return {
      selectedGroup: "",
      nav: setting("docsEngine.nav")
    }
  }
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
  display: grid;
  grid-template-columns: minmax(300px, 400px) 1fr;
  box-shadow: var(--panel-shadow-inset);
  position: relative;
  .view-area {
    min-height: 50vh;
  }
  .sidebar-area {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
    // background-color: #fbfcfd;
    position: relative;
    z-index: 0;

    .nav {
      padding-top: 2rem;
      width: 300px;
      font-weight: 600;
      padding: 1rem;
      .nav-group {
        border-bottom: 1px solid var(--color-border);
        &:last-child {
          border-bottom: none;
        }
        .nav-group-title,
        a {
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          display: grid;
          grid-template-columns: 0.75rem 1fr;
          grid-gap: 5px;
          border-radius: 5px;
          align-items: center;
          font-weight: 700;
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
}
</style>
