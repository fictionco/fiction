<template>
  <div class="docs-sidebar">
    <div class="sidebar-inner">
      <h2 class="title">Guide</h2>
      <!-- <select class="version-select">
        <option value="SELF" selected>2.x</option>
        <option value="v1">1.x</option>
      </select>-->
      <ul class="menu-root">
        <li>
          <h3>Essentials</h3>
        </li>

        <li>
          <factor-link path="/docs/installation">Installation</factor-link>
        </li>

        <li>
          <factor-link path="/docs/" class="sidebar-link current">Introduction</factor-link>
          <ul class="menu-sub">
            <li>
              <factor-link path="#what-is-factor" class="section-link">What is Factor?</factor-link>
            </li>
            <li>
              <factor-link path="#how-it-works" class="section-link">How it Works</factor-link>
            </li>
            <li>
              <factor-link path="#features" class="section-link">Features</factor-link>
            </li>
            <li>
              <factor-link path="#schema" class="section-link">Schema</factor-link>
            </li>
            <li>
              <factor-link
                path="#server-rendered-universal-ssr"
                class="section-link"
              >Server Rendered (Universal SSR)</factor-link>
            </li>
            <li>
              <factor-link
                path="#single-page-applications-spa"
                class="section-link"
              >Single Page Applications (SPA)</factor-link>
            </li>
            <li>
              <factor-link
                path="#static-generated-pre-rendering"
                class="section-link"
              >Static Generated (Pre Rendering)</factor-link>
            </li>
          </ul>
        </li>

        <li>
          <factor-link path="/docs/directory-structure" class="sidebar-link">Directory Structure</factor-link>
        </li>

        <li>
          <factor-link path="/docs/configuration" class="sidebar-link">Configuration</factor-link>
        </li>

        <li>
          <factor-link path="/docs/routing" class="sidebar-link">Routing</factor-link>
        </li>

        <li>
          <factor-link path="/docs/views" class="sidebar-link">Views</factor-link>
        </li>

        <li>
          <factor-link path="/docs/async-data" class="sidebar-link">Async Data</factor-link>
        </li>

        <li>
          <factor-link path="/docs/assets" class="sidebar-link">Assets</factor-link>
        </li>

        <li>
          <factor-link path="/docs/plugins" class="sidebar-link">Plugins</factor-link>
        </li>

        <li>
          <factor-link path="/docs/modules" class="sidebar-link">Modules</factor-link>
        </li>

        <li>
          <factor-link path="/docs/commands" class="sidebar-link">Commands and Deployment</factor-link>
        </li>

        <li>
          <factor-link path="/docs/development-tools" class="sidebar-link">Development Tools</factor-link>
        </li>

        <li>
          <h3>Placeholder Title</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Transitions &amp; Animation</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Reusability &amp; Composition</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Tooling</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Scaling Up</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Internals</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Migrating</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <h3>Meta</h3>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>

        <li>
          <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {}
  }
}
</script>
<style lang="less">
.docs-sidebar {
  position: fixed;
  top: 45px;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
  padding-bottom: 5em;
  &.open {
    transform: translate(0, 0);
  }
  .sidebar-inner {
    width: 340px;
    padding: 40px 20px 60px 60px;
  }
  @media (max-width: 767px) {
    z-index: 10;
    top: 0;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
    transform: translate(-340px, 0);
    .sidebar-inner {
      width: 290px;
      padding: 30px;
    }
  }
  // All Lists
  ul {
    line-height: 1.6em;
    list-style: none;
    li {
      margin-top: 0.5em;
    }
  }
  // sidebar main menu
  ul.menu-root {
    padding-left: 0;
    > li {
      a {
        color: inherit;
        &.current {
          color: var(--color-primary);
          font-weight: 800;
        }
        &:hover {
          border-bottom: 2px solid var(--color-primary);
        }
      }
    }
    // sidebar sub menu
    ul.menu-sub {
      font-size: 0.85em;
      padding-left: 1em;
    }
  }
}
</style>