<template>
  <div class="docs-sidebar">
    <h2 class="title">Guide</h2>
    <ul class="menu-root">
      <li>
        <h3>Essentials</h3>
      </li>

      <li>
        <factor-link path="/docs/quick-start">Quick Start</factor-link>
      </li>

      <li>
        <factor-link path="/docs/introduction" class="sidebar-link current">Introduction</factor-link>
        <ul class="menu-sub">
          <li>
            <factor-link path="#What-is-Factor" class="section-link">What is Factor?</factor-link>
          </li>
          <li>
            <factor-link path="#Getting-Started" class="section-link">Getting Started</factor-link>
          </li>
          <li>
            <factor-link path="#" class="section-link">Placeholder</factor-link>
          </li>
          <li>
            <factor-link path="#" class="section-link">Placeholder</factor-link>
          </li>
          <li>
            <factor-link path="#" class="section-link">Placeholder</factor-link>
          </li>
          <li>
            <factor-link path="#" class="section-link">Placeholder</factor-link>
          </li>
          <ul>
            <li>
              <factor-link path="#" class="section-link">Placeholder</factor-link>
            </li>
          </ul>
          <li>
            <factor-link path="#" class="section-link">Placeholder</factor-link>
          </li>
        </ul>
      </li>

      <li>
        <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
      </li>

      <li>
        <factor-link path="/docs/placeholder" class="sidebar-link">Placeholder</factor-link>
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
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
  max-width: 230px;
  padding: 3em 0;
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
          font-weight: 700;
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