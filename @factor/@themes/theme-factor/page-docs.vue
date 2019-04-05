<template>
  <div class="docs-container">
    <section class="mast">
      <div class="docs-wrap">
        <div class="sidebar">
          <h3 class="title">Getting Started</h3>
          <ul class="list-items">
            <li>
              <factor-link href="#introduction" class="active">Introduction</factor-link>
            </li>
            <li>
              <a href="#">Requirements</a>
            </li>
            <li>
              <a href="#">Installation</a>
            </li>
            <li>
              <a href="#">Updating</a>
            </li>
            <li>
              <a href="#">Configuration</a>
            </li>
            <li>
              <a href="#">Data</a>
            </li>
            <li>
              <a href="#">Help</a>
            </li>
          </ul>
        </div>
        <div class="content">
          <h1>Documentation</h1>
          <h2>Getting Started</h2>
          <h3 id="introduction">Introduction</h3>
          <p>Welcome to factor! Get familiar with the products and explore their features:</p>
          <p>Factor is a modern CMS. In the documentation you will learn how to install it, how to use the interface and how to develop plugins and themes for the Factor platform.</p>
          <p>Ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "Factor Plugins",
      description: "Extend your project features and do more with Factor.",
      image: ""
    }
  }
}
</script>
<style lang="less">
.docs-container {
  padding: 3em 0;
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1024px;
    margin: 0 auto;
  }
  .docs-wrap {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-column-gap: 2em;
  }

  .content {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
      0 6px 14px 0 rgba(24, 32, 41, 0.06), 0 12px 34px 0 rgba(24, 32, 41, 0.04);
    padding: 1em;
  }

  .sidebar {
    .title {
      font-size: 1.4em;
      font-weight: 600;
    }
    .list-items {
      list-style: none;
      padding: 0;
      margin-top: 1em;
      font-size: 1.2em;
      li {
        margin-bottom: 10px;
        a {
          color: rgba(80, 102, 119, 0.5);
          &:hover {
            color: rgba(80, 102, 119, 1);
          }
          &.active {
            color: #0496ff;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
