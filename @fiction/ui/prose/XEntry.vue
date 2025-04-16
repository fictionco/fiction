<script lang="ts" setup>
import type { ColorThemeUser, ColorThemeWithInvert } from '@fiction/core'
import { getColorScheme, vue } from '@fiction/core'

defineOptions({ name: 'XEntry' })

const { theme } = defineProps<{
  theme?: ColorThemeUser
}>()

const entryEl = vue.ref<HTMLElement>()

const themeColors = vue.computed(() => {
  const t = theme

  if (['primary', 'default', 'naked', 'overlay', 'theme', ''].includes(t || '')) {
    return {
      colorLight: 'var(--primary-500)',
      colorDark: 'var(--primary-400)',
    }
  }

  const themeScale = getColorScheme(t as ColorThemeWithInvert)
  return {
    colorLight: themeScale[500],
    colorDark: themeScale[400],
  }
})
</script>

<template>
  <div ref="entryEl" class="x-entry">
    <slot />
  </div>
</template>

<style lang="less">
/* Dark mode typography styling optimized for Tufte principles and golden ratio proportions */
/* All sizing is relative to container's em size for scalability */

.x-entry {
  /* CSS Variables for maintainable theming */
  --base-font-size: 1em;
  --golden-ratio: 1.618;
  --line-height: 1.75;
  --text-color: rgba(var(--theme-100) / 1);
  --heading-color: rgba(255, 255, 255, 0.95);
  --muted-color: rgba(var(--theme-100) / 0.8);
  --border-color: rgba(var(--theme-600) / 0.6);

  /* Base typography */
  font-size: var(--base-font-size);
  line-height: var(--line-height);
  font-feature-settings: "kern", "liga", "calt";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);

  /* Headings with golden ratio progression */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-title, inherit);
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.15;
    margin: 0;
    color: var(--heading-color);
  }

  h1 {
    font-size: calc(var(--base-font-size) * 2.618);
    margin: calc(var(--base-font-size) * 1.618) 0 calc(var(--base-font-size) * 0.618);
  }

  h2 {
    font-size: calc(var(--base-font-size) * 2);
    margin: calc(var(--base-font-size) * 1.5) 0 calc(var(--base-font-size) * 0.5);
  }

  h3 {
    font-size: calc(var(--base-font-size) * 1.618);
    margin: calc(var(--base-font-size) * 1.4) 0 calc(var(--base-font-size) * 0.4);
  }

  h4 {
    font-size: calc(var(--base-font-size) * 1.309);
    margin: calc(var(--base-font-size) * 1.3) 0 calc(var(--base-font-size) * 0.3);
  }

  h5 {
    font-size: calc(var(--base-font-size) * 1.159);
    margin: calc(var(--base-font-size) * 1.2) 0 calc(var(--base-font-size) * 0.3);
  }

  h6 {
    font-size: var(--base-font-size);
    margin: calc(var(--base-font-size) * 1.1) 0 calc(var(--base-font-size) * 0.3);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* Remove top margin for first headings in common TipTap contexts */
  > :where(h1, h2, h3, h4, h5, h6):first-child,
  section > :where(h1, h2, h3, h4, h5, h6):first-child,
  li > :where(h1, h2, h3, h4, h5, h6):first-child {
    margin-top: 0;
  }

  /* Paragraphs */
  p {
    margin: 0 0 var(--base-font-size);
    max-width: 65ch;
    line-height: var(--line-height);
  }

  p:last-child {
    margin-bottom: 0;
  }

  /* Sections */
  section {
    margin: calc(var(--base-font-size) * 2) 0;
  }

  /* Aside (informational boxes) */
  aside {
    margin: 3em 0;
    padding: 2em;
    border-radius: .5em;
    background: rgba(var(--theme-700) / 0.3);

    :first-child { margin-top: 0; }
    :last-child { margin-bottom: 0; }
    p {
    margin: 0 0 calc(var(--base-font-size) * 0.618);
  }
  }

  /* Links */
  a {
    color: rgba(var(--primary-400) / 1);
    text-decoration: underline;
    text-decoration-thickness: calc(var(--base-font-size) * 0.05);
    text-underline-offset: calc(var(--base-font-size) * 0.15);
    transition: color 0.2s ease;

    &:hover {
      color: rgba(var(--post-theme-dark) / 1);
    }
  }

  /* Blockquotes */
  blockquote {
    margin: calc(var(--base-font-size) * 2) calc(var(--base-font-size) * 1.618);
    padding-left: calc(var(--base-font-size) * 1.618);
    position: relative;
    max-width: 55ch;
    font-family: var(--font-family-title, inherit);

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(
        to bottom,
        transparent,
        rgba(var(--theme-600) / 1) 15%,
        rgba(var(--theme-600) / 1) 85%,
        transparent
      );
    }

    p {
      font-size: calc(var(--base-font-size) * 1.159);
      line-height: 1.5;
      color: var(--heading-color);
    }

    footer {
      margin-top: calc(var(--base-font-size) * 0.618);
      font-size: calc(var(--base-font-size) * 0.9);
      color: var(--muted-color);
    }

    cite {
      font-style: normal;
    }
  }

  /* Lists */
  ul, ol {
    margin: calc(var(--base-font-size) * 1.618) 0;
    padding-left: calc(var(--base-font-size) * 1.618);
    line-height: var(--line-height);
  }

  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }

  li {
    margin-bottom: calc(var(--base-font-size) * 0.618);
    padding-left: calc(var(--base-font-size) * 0.3);

    p {
      margin: 0 0 calc(var(--base-font-size) * 0.5);
    }

    :where(h1, h2, h3, h4, h5, h6) {
      margin: calc(var(--base-font-size) * 0.618) 0 calc(var(--base-font-size) * 0.3);
    }

    > ul, > ol {
      margin: calc(var(--base-font-size) * 0.618) 0;
    }
  }

  /* Code */
  pre {
    margin: calc(var(--base-font-size) * 1.618) 0;
    padding: var(--base-font-size);
    border-radius: calc(var(--base-font-size) * 0.3);
    overflow-x: auto;
    background: rgba(30, 30, 30, 1);
    border: 1px solid var(--border-color);
    font-size: calc(var(--base-font-size) * 0.9);

    code {
      padding: 0;
      background: transparent;
      color: rgba(220, 220, 220, 1);
    }
  }

  :not(pre) > code {
    padding: calc(var(--base-font-size) * 0.2) calc(var(--base-font-size) * 0.4);
    border-radius: calc(var(--base-font-size) * 0.3);
    font-size: calc(var(--base-font-size) * 0.875);
    background: rgba(60, 60, 60, 0.7);
    color: rgba(240, 240, 240, 1);
    font-family: var(--font-family-mono, monospace);
  }

  /* Images and figures */
  figure {
    margin: calc(var(--base-font-size) * 2) auto;
    max-width: 100%;
    text-align: center;

    img {
      max-width: 100%;
      height: auto;
      border-radius: calc(var(--base-font-size) * 0.3);
      border: 1px solid var(--border-color);
    }
  }

  figcaption {
    margin-top: calc(var(--base-font-size) * 0.618);
    font-size: calc(var(--base-font-size) * 0.875);
    color: var(--muted-color);
    max-width: 40em;
    margin-left: auto;
    margin-right: auto;
  }

  /* Horizontal rule */
  hr {
    margin: calc(var(--base-font-size) * 3) 0;
    height: 1px;
    border: none;
    background: linear-gradient(
      to right,
      transparent,
      var(--border-color) 20%,
      var(--border-color) 80%,
      transparent
    );
  }

  /* Lead paragraph */
  .lead, p.lead {
    font-size: calc(var(--base-font-size) * 1.309);
    line-height: 1.5;
    margin-bottom: calc(var(--base-font-size) * 1.618);
    color: var(--heading-color);
    max-width: 36em;
  }

  /* Drop cap */
  .drop-cap:first-letter {
    float: left;
    font-size: calc(var(--base-font-size) * 3.5);
    line-height: 0.8;
    font-weight: 700;
    margin-right: calc(var(--base-font-size) * 0.15);
    margin-top: calc(var(--base-font-size) * 0.1);
    color: rgba(var(--primary-400) / 1);
  }

  /* Responsive embeds */
  .embed-responsive {
    position: relative;
    margin: calc(var(--base-font-size) * 2) 0;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;

    iframe, object, embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: calc(var(--base-font-size) * 0.3);
      border: 1px solid var(--border-color);
    }
  }

  /* Pull quotes and side notes */
  .pull-right {
    float: right;
    margin: calc(var(--base-font-size) * 0.5) 0 calc(var(--base-font-size)) calc(var(--base-font-size) * 1.618);
    max-width: 40%;
  }

  .pull-left {
    float: left;
    margin: calc(var(--base-font-size) * 0.5) calc(var(--base-font-size) * 1.618) calc(var(--base-font-size)) 0;
    max-width: 40%;
  }

  .side-note {
    font-size: calc(var(--base-font-size) * 0.875);
    padding: calc(var(--base-font-size) * 0.618) var(--base-font-size);
    margin: var(--base-font-size) 0;
    color: var(--muted-color);
    border-left: 2px solid var(--border-color);
    max-width: 20em;
  }

  /* Mark */
  mark {
    background: rgba(var(--primary-900) / 0.7);
    color: rgba(var(--primary-200) / 1);
    padding: calc(var(--base-font-size) * 0.1) calc(var(--base-font-size) * 0.2);
    border-radius: calc(var(--base-font-size) * 0.2);
  }

  /* Marker */
  .marker {
    display: inline-block;
    width: calc(var(--base-font-size) * 1.5);
    margin-right: calc(var(--base-font-size) * 0.5);
    color: rgba(var(--primary-400) / 1);
    font-weight: 600;
  }
}
</style>
