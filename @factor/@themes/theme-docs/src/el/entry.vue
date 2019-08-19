<template>
  <div class="docs-entry">
    <div v-formatted-text="text" />
  </div>
</template>
<script>
export default {
  props: {
    text: { type: String, default: "" }
  },
  data() {
    return {}
  },

  watch: {
    $route: function(to, from) {
      if (to.path != from.path) {
        this.setPage()
      }
    }
  },
  mounted() {
    require("../prism/prism.js")

    this.prism = window.Prism

    this.setPage()
  },
  methods: {
    setPage() {
      // wait til content is done rendering
      setTimeout(() => {
        this.prism.highlightAll()
      }, 50)
    }
  }
}
</script>
<style lang="less">
@import "../prism/prism.less";

code {
  color: #ff0070;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  padding: 3px 5px;
  margin: 0 2px;
  border-radius: 5px;

  background-color: rgba(255, 4, 4, 0.05);
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 0.85em;
  -webkit-font-smoothing: initial;
  -moz-osx-font-smoothing: initial;
}

// pre code {
//   overflow-x: auto;
//   background-color: #f8f8f8;

//   white-space: pre;

//   padding: 1.2em 1.4em;
//   font-size: 0.9rem;
//   line-height: 1.6rem;
//   display: block;
// }

// Docs Content
.docs-entry {
  /* Code blocks */
  pre {
    background: #f7f9fb;
    box-shadow: var(--box-shadow-input);
    border-radius: 5px;
    position: relative;
    padding: 1.5em;
    overflow-x: auto;
    line-height: normal;
    code {
      color: inherit;
      margin: 0;
      padding: 0;
      background: transparent;
    }
  }

  margin: 0 auto;
  h1 {
    font-size: 2em;
    line-height: 1.2;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.2em;
    margin: 2em 0 1em;
  }
  h4 {
    margin: 1em 0;
    font-size: 1.15em;
    opacity: 0.4;
  }
  h1,
  h2,
  h3,
  h4 {
    font-weight: 800;
    a {
      font-weight: 800;
    }
  }
  h1,
  h2,
  h3,
  h4 {
    position: relative;
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
    &:before {
      content: "#";

      position: absolute;
      left: -0.9em;
      margin-top: -0.15em;
      font-size: 1.2em;
      font-weight: 800;
      opacity: 0.15;
    }
    @media (max-width: 767px) {
      &:before {
        display: none;
      }
    }
  }
  a {
    color: var(--color-primary);
    font-weight: 600;
  }
  img {
    max-width: 100%;
  }
  p,
  ul,
  ol {
    line-height: 1.6;
    padding-bottom: 1.2em;
  }
  ol,
  ul {
    padding-left: 1.5em;
  }
  blockquote {
    margin-bottom: 2em;
    //padding: 1em 0 1em 1.5em;
    // border-left: 3px solid var(--color-text);
    // background-color: var(--color-bg-contrast);
    padding: 1em 1.4em;
    //border: 1px solid var(--color-placeholder);
    box-shadow: var(--box-shadow-input);
    border-radius: 6px;
    p,
    ul,
    ol {
      &:last-child {
        padding-bottom: 0;
      }
    }
  }
  .alert {
    color: var(--color-light);
    background-color: var(--color-bg-dark);
    padding: 15px 15px 0;
    line-height: 20px;
    margin: 20px 0;
    border-radius: 4px;
    code {
      background-color: rgba(255, 255, 255, 0.1);
    }
    a {
      color: var(--color-light);
      text-decoration: underline;
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
  table {
    margin-bottom: 1em;
    border-spacing: 0;

    thead tr th {
      background: #f8f8f8;
      padding: 10px 15px;
      text-transform: uppercase;
    }
    th,
    td {
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    td {
      padding: 10px;
    }
  }

  figure {
    margin: 2em 0;
    text-align: center;

    figcaption {
      margin-top: 0.1em;
      opacity: 0.3;
      text-align: center;
    }

    > a,
    > img {
      text-align: center;
      display: inline-block;
    }

    img {
      max-width: 100%;
      margin: 0 auto;
      box-shadow: 0 2px 5px -1px rgba(50, 50, 93, 0.25),
        0 1px 3px -1px rgba(0, 0, 0, 0.3);
      // box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.15),
      //   0 1px 2px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease-in-out;
      border-radius: 5px;

      &:hover {
        // box-shadow: 0 0 0 1px rgba(73, 86, 105, 0.15),
        //   0 1px 15px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 6px 12px -2px rgba(50, 50, 93, 0.25),
          0 3px 7px -3px rgba(0, 0, 0, 0.3);
        transform: translateY(-1px);
      }
    }
  }
}
</style>