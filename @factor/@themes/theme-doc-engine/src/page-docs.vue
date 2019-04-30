<template>
  <div class="page-docs">
    <section class="docs-wrap">
      <div class="docs-inner mast">
        <div class="sidebar">
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
        <div class="content">
          <h1>Introduction</h1>
          <h2 id="What-is-Factor">
            <factor-link path="#What-is-Factor" class="current">What is Factor?</factor-link>
          </h2>
          <p>Factor is a Serverless Framework. In the documentation you will learn how to install it, how to use the interface and how to develop plugins and themes for the Factor platform.</p>
          <p>Ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>

          <h2 id="Getting-Started">
            <factor-link path="#Getting-Started">Getting Started</factor-link>
          </h2>
          <p>
            <factor-link path="/docs/quick-start" btn="primary" size="large">Quick Start</factor-link>
          </p>
          <p
            class="tip"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi:</p>
          <pre>
            <code class="hljs html">
              Some code
            </code>
          </pre>
          <p>or:</p>
          <pre>
            <code class="hljs html">
              Some code
            </code>
          </pre>
          <p>
            Lorem ipsum dolor sit amet,
            <factor-link path="#link-test">link test</factor-link>, sed do
            <strong>eiusmod tempor</strong> incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
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
.page-docs {
  padding: 3em 0;

  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .docs-wrap {
    .docs-inner {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-column-gap: 2em;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        grid-column-gap: 1em;
      }
    }
    h1 {
      font-size: 2em;
    }
    h2 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 1.2em;
      margin: 1em 0;
    }
    h1,
    h2,
    h3 {
      font-weight: 700;
    }
  }

  .sidebar {
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
  .content {
    h1 {
      margin: 0 0 1em;
    }
    h2 {
      margin: 45px 0 0.8em;
      padding-bottom: 0.7em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      a {
        pointer-events: auto;
        color: inherit;
      }
    }
    h3 {
      a:before {
        content: "#";
        color: var(--color-primary);
        position: absolute;
        left: -0.7em;
        margin-top: -0.05em;
        padding-right: 0.5em;
        font-size: 1.2em;
        line-height: 1;
        font-weight: 700;
      }
    }
    p,
    ul,
    ol {
      line-height: 1.6em;
      padding-bottom: 1.2em;
    }
    p.tip {
      padding: 12px 24px 12px 30px;
      margin: 2em 0;
      border-left: 4px solid var(--color-primary);
      background-color: #f8f8f8;
      border-radius: 0 4px 4px 0;
    }
  }
  // .sidebar {
  //   .title {
  //     font-size: 1.4em;
  //     font-weight: 600;
  //   }
  //   .list-items {
  //     list-style: none;
  //     padding: 0;
  //     margin-top: 1em;
  //     font-size: 1.2em;
  //     li {
  //       margin-bottom: 10px;
  //       a {
  //         color: rgba(80, 102, 119, 0.5);
  //         &:hover {
  //           color: rgba(80, 102, 119, 1);
  //         }
  //         &.active {
  //           color: #0496ff;
  //           font-weight: 600;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
