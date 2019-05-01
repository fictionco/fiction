<template>
  <div class="page-docs">
    <section class="docs-wrap">
      <docs-sidebar />
      <div class="mast">
        <div class="content">
          <div v-formatted-text="getMarkdown()" />

          <!-- <h1>Introduction</h1>
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
          <h3 id="Testing-Lists">
            <a href="#Testing-Lists">Testing Lists</a>
          </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</p>
          <ol>
            <li>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
            <li>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
          </ol>
          <ul>
            <li>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
            <li>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </li>
          </ul>
          <blockquote>
            <p>
              Blockquote test. This page assumes you’ve already read the
              <factor-link path="#link-test">Plugins Basics</factor-link>. Read that first if you are new to plugins.
            </p>
          </blockquote>-->
          <docs-footer />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    "docs-sidebar": () => import("#/el/el-docs-sidebar"),
    "docs-footer": () => import("#/el/el-docs-footer")
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {},
  metatags() {
    return {
      title: "Introduction — Factor.js",
      description: "Factor.js - The Serverless Framework.",
      image: ""
    }
  },
  methods: {
    getMarkdown() {
      return require("./docs-v1/introduction.md")
    }
  }
}
</script>
<style lang="less">
.page-docs {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .docs-wrap {
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
      font-weight: 800;
    }
  }

  // Docs Content
  .content {
    margin: 0 auto;
    max-width: 700px;
    padding: 3em 0 3em 3.125em;
    @media (max-width: 1300px) {
      margin-left: 290px;
    }
    @media (max-width: 767px) {
      margin: 0 auto;
      padding: 3em 0;
    }
    h1,
    h2,
    h3 {
      a {
        pointer-events: auto;
        color: inherit;
      }
    }
    h1 {
      margin: 0 0 1em;
    }
    h2 {
      margin: 45px 0 0.8em;
      padding-bottom: 0.7em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    h3 {
      position: relative;
      a:before {
        content: "#";
        color: var(--color-primary);
        position: absolute;
        left: -0.9em;
        margin-top: -0.05em;
        font-size: 1.2em;
        font-weight: 800;
      }
    }
    a {
      color: var(--color-primary);
    }
    img {
      max-width: 100%;
    }
    p,
    ul,
    ol {
      line-height: 1.6em;
      padding-bottom: 1.2em;
    }
    ol,
    ul {
      padding-left: 1.5em;
    }
    blockquote {
      margin: 2em 0;
      padding-left: 20px;
      border-left: 4px solid var(--color-primary);
      p {
        font-weight: 800;
        padding-bottom: 0;
      }
    }
    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    p.tip {
      padding: 12px 24px 12px 30px;
      margin: 2em 0;
      border-left: 4px solid var(--color-primary);
      background-color: #fff;
      border-radius: 0 4px 4px 0;
    }
    sub,
    sup {
      position: relative;
      font-size: 75%;
      line-height: 0;
      vertical-align: baseline;
    }
    sub {
      top: -0.5em;
    }
    sup {
      bottom: -0.25em;
    }
  }
}
</style>
