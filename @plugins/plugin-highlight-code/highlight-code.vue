<template>
  <div ref="code" class="highlight-code-wrap">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { onEvent } from "@factor/api"
export default Vue.extend({
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    require("./prism/prism.js")
    this.prism = window.Prism

    // Set page on load
    this.setPage()

    // Event trigger for rehighlight
    onEvent("highlight-post", () => {
      this.setPage()
    })
  },
  methods: {
    setPage(this: any) {
      if (this.prism && this.$refs.code) {
        // wait til content is done rendering
        setTimeout(() => {
          this.prism.highlightAllUnder(this.$refs.code)
        }, 1000)
      }
    }
  }
})
</script>
<style lang="less">
.code-toolbar {
  padding: 1em 2em;
  border-radius: 5px;
  margin: 2rem 0;
  font-size: 0.85em;
  -webkit-font-smoothing: initial;
  -moz-osx-font-smoothing: initial;
  background: var(--highlight-code-bg);
  font-family: var(--highlight-code-font);
  color: var(--highlight-code-color-text);
  box-shadow: var(--highlight-code-shadow);
}

.highlight-code-wrap {
  /* Code blocks */
  pre {
    transition: 0.4s;
    margin: 0;
    overflow: auto;
    border-radius: 5px;
    transition: all 0.2s;
  }
  .code-toolbar pre {
    opacity: 1;
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
  color: var(--highlight-code-color-comment);
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
  color: var(--highlight-code-color-tag);
}

.token.punctuation {
  color: var(--highlight-code-color-punctuation);
}

.token.property {
  color: var(--highlight-code-color-property);
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: var(--highlight-code-color-selector);
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
  color: var(--highlight-code-color-keyword);
}

.token.regex,
.token.important,
.token.variable {
  color: var(--highlight-code-color-variable);
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
  letter-spacing: 0.1em;
  color: var(--highlight-code-color-text);
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.3s ease-in-out;
  opacity: 0.2;
  font-weight: 700;
  text-transform: uppercase;
  .toolbar-item {
    display: inline-block;
  }
  a {
    cursor: pointer;
  }
  button {
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
  a,
  button,
  span {
    font-size: 11px;
    padding: 0 0.5em;
    border-radius: 4px;
  }

  a:hover,
  a:focus,
  button:hover,
  button:focus,
  span:hover,
  span:focus {
    color: inherit;
    text-decoration: none;
  }
}
</style>
