<template>
  <div class="highlight-code-wrap">
    <slot />
  </div>
</template>

<script>
import { setting } from "@factor/tools"
export default {
  mounted() {
    require("./prism/prism.js")
    this.prism = window.Prism
    this.setPage()
  },
  methods: {
    style() {
      return setting("highlightCode.style")
    },
    setPage() {
      if (this.prism) {
        // wait til content is done rendering
        setTimeout(() => {
          this.prism.highlightAll()
        }, 500)
      }
    }
  }
}
</script>
<style lang="less">
.code-toolbar {
  font-family: "Roboto Mono", Monaco, courier, monospace;
  padding: 1em 2em;
  border-radius: 5px;
  font-family: "Roboto Mono", Monaco, courier, monospace;
  font-size: 0.85em;
  -webkit-font-smoothing: initial;
  -moz-osx-font-smoothing: initial;
}

/* Code blocks */
pre {
  margin: 0;
  overflow: auto;
  border-radius: 5px;

  transition: all 0.2s;

  &[class*="language-"] {
    opacity: 1;
  }
}

code[class*="language-"],
pre[class*="language-"] {
  color: inherit;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  font-weight: 300;
}

@media print {
  code[class*="language-"],
  pre[class*="language-"] {
    text-shadow: none;
  }
}

/* Inline code */
:not(pre) > code[class*="language-"] {
  padding: 0.1em;
  border-radius: 0.3em;
  white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: var(--code-color-comment, #a3b6ca);
}

.namespace {
  opacity: 0.7;
}

.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted,
.token.function,
.token.class-name {
  color: var(--code-color-tag, #5458d2);
}

.token.punctuation {
  color: var(--code-color-punctuation, #5490f5);
}

.token.property {
  color: #2c506c;
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: var(--code-color-selector, #42b983);
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  opacity: 0.6;
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: var(--code-color-keyword, #0063ab);
}

.token.regex,
.token.important,
.token.variable {
  color: var(--code-color-variable, #e90);
}

.token.important,
.token.bold {
  font-weight: bold;
}

.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}

div.code-toolbar {
  position: relative;
}

div.code-toolbar > .toolbar {
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.3s ease-in-out;
  opacity: 0.1;
  font-weight: 800;
  text-transform: uppercase;
}

div.code-toolbar > .toolbar .toolbar-item {
  display: inline-block;
}

div.code-toolbar > .toolbar a {
  cursor: pointer;
}

div.code-toolbar > .toolbar button {
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  padding: 0;
  -webkit-user-select: none;
  /* for button */
  -moz-user-select: none;
  -ms-user-select: none;
}

div.code-toolbar > .toolbar a,
div.code-toolbar > .toolbar button,
div.code-toolbar > .toolbar span {
  font-size: 0.8em;
  padding: 0 0.5em;

  border-radius: 4px;
}

div.code-toolbar > .toolbar a:hover,
div.code-toolbar > .toolbar a:focus,
div.code-toolbar > .toolbar button:hover,
div.code-toolbar > .toolbar button:focus,
div.code-toolbar > .toolbar span:hover,
div.code-toolbar > .toolbar span:focus {
  color: inherit;
  text-decoration: none;
}
</style>