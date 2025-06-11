<script lang="ts" setup>
import type { ColorThemeUser, ColorThemeWithInvert } from '@fiction/core'
import { getColorScheme, vue } from '@fiction/core'

defineOptions({ name: 'XEntry' })

const { theme, dropCap } = defineProps<{
  theme?: ColorThemeUser
  dropCap?: boolean
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
  <div>
    <div ref="entryEl" class="x-entry" :class="[dropCap ? 'drop-cap' : '']">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.x-entry {
  /* Theme variables */
  --post-theme-light: v-bind('themeColors.colorLight');
  --post-theme-dark: v-bind('themeColors.colorDark');
--text-color: color-mix(in srgb, var(--color-theme-100) 100%, transparent 0%);
--muted-color: color-mix(in srgb, var(--color-theme-100) 80%, transparent 20%);
--border-color: color-mix(in srgb, var(--color-theme-600) 60%, transparent 40%);
--background-alt-color: color-mix(in srgb, var(--color-theme-700) 40%, transparent 50%);
--background-alt-color-subtle: color-mix(in srgb, var(--color-theme-700) 30%, transparent 70%);
  /* Base typography */
  font-size: 1.3em;
  line-height: 1.75;
  font-feature-settings: "kern", "liga", "calt";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);

  /* Drop cap styling */
  &.drop-cap p:first-of-type:first-letter {
    float: left;
    font-size: 3.5em;
    line-height: 0.8;
    font-weight: 700;
    margin-right: 0.15em;
    margin-top: 0.05em;
  }

  /* Headings with golden ratio progression */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-title, inherit);
    font-weight: 600;
    line-height: 1.15;
    margin: 0;
    text-wrap: pretty;
    letter-spacing: -.02em;
  }

  h1 { font-size: 2em; margin: 1.5em 0 0.4em; }
  h2 { font-size: 1.618em; margin: 1.5em 0 0.75em; line-height: 1.2; }
  h3 { font-size: 1.309em; margin: 1em 0 0.35em; line-height: 1.4; }
  h4 { font-size: 1.159em; margin: 0.9em 0 0.3em; line-height: 1.5; }
  h5 { font-size: 1.05em; margin: 0.8em 0 0.3em; line-height: 1.6;}
  h6 {
    font-size: 1em;
    margin: 0.7em 0 0.3em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    line-height: 1.6;
  }

  h2{
    padding-bottom: .5em;
    border-bottom: 1px solid var(--border-color);
  }

  /* Remove top margin for first headings */
  > :where(h1, h2, h3, h4, h5, h6):first-child,
  section > :where(h1, h2, h3, h4, h5, h6):first-child,
  li > :where(h1, h2, h3, h4, h5, h6):first-child {
    margin-top: 0;
  }

  /* Paragraphs */
  p {
    margin: 0 0 1em;
    line-height: 1.75;
    font-weight: 400;
  }

  /* Sections */
  section { margin: 2em 0; }

  /* Asides */
  aside {
    margin: 2em 0;
    padding: 1.5em;
    border-radius: 0.5em;
    background: var(--background-alt-color-subtle);

    :first-child { margin-top: 0; }
    :last-child { margin-bottom: 0; }
  }

  /* Links */
  a {
    color: rgba(var(--primary-400) / 1);
    text-decoration: underline;
    text-decoration-thickness: 0.05em;
    text-underline-offset: 0.15em;
    transition: color 0.2s ease;

    &:hover { color: rgba(var(--post-theme-dark) / 1); }
  }

  /* Blockquotes */
  blockquote {
    margin: 2em 0;
    padding-left: 1.5em;
    position: relative;
    max-width: 32em;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 3px;
      background: var(--border-color)
    }

    p {
      font-size: 1.1em;
      line-height: 1.5;
    }

    footer {
      font-size: 0.9em;
      color: var(--muted-color);
    }
  }

  /* Lists */
  ul, ol {
    margin: 1.5em 0;
    padding-left: 1.618em;
    line-height: 1.75;
  }

  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }

  li {
    margin-bottom: 0.6em;
    padding-left: 0.3em;

    p { margin: 0 0 0.5em; }

    :where(h1, h2, h3, h4, h5, h6) {
      margin: 0.618em 0 0.3em;
    }

    > ul, > ol { margin: 0.618em 0; }
  }

  /* Code */
  pre {
    margin: 1.618em 0;
    padding: 1.2em;
    border-radius: 0.3em;
    overflow-x: auto;
    background: var(--background-alt-color);
    border: 1px solid var(--border-color);
    line-height: 1.5;
    font-size: .85em;
    font-family: var(--font-family-mono, monospace);
    code {
      padding: 0;
      background: transparent;
      color: rgba(220, 220, 220, 1);
    }
  }

  :not(pre) > code {
    padding: 0.2em 0.4em;
    border-radius: 0.3em;
    font-size: 0.875em;
    background: rgba(var(--theme-600) / .5);
    color: rgba(240, 240, 240, 1);
    font-family: var(--font-family-mono, monospace);
  }

  /* Tables - Improved for horizontal scrolling */
  .table-container {
    width: 100%;
    margin: 1.618em 0;
    overflow-x: auto;
  }

  table {
    width: 100%;
    margin: 2em 0;
    border-collapse: collapse;
    font-size: 0.9em;
    line-height: 1.5;
    color: var(--text-color);
    min-width: 100%; /* Ensures table takes full width */
    white-space: nowrap; /* Prevents text wrapping in cells */
    border-radius: 0.3em;
    border: 1px solid var(--border-color);

  }

  /* Allow specific tables to wrap if desired */
  table.wrap {
    white-space: normal;
  }

  thead {
    background: var(--background-alt-color-subtle);
    font-family: var(--font-family-title, inherit);
  }

  th {
    font-weight: 600;
    text-align: left;
    padding: 0.618em 1em;
    border-bottom: 1px solid var(--border-color);
  }

  td {
    padding: 0.618em 1em;
    border-bottom: 1px solid var(--border-color);
  }

  tr:hover {
    background: var(--background-alt-color-subtle);
  }

  /* Images and figures */
  figure {
    margin: 2em auto;
    max-width: 100%;
    text-align: center;

    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.3em;
      border: 1px solid var(--border-color);
    }
  }

  figcaption {
    margin-top: 0.618em;
    font-size: 0.875em;
    color: var(--muted-color);
    max-width: 40em;
    margin-left: auto;
    margin-right: auto;
  }

  /* Horizontal rule */
  hr {
    margin: 3em 0;
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
    font-size: 1.309em;
    line-height: 1.5;
    margin-bottom: 1.618em;
    color: var(--text-color);
    max-width: 30em;
  }

  /* Responsive embeds */
  .embed-responsive {
    position: relative;
    margin: 2em 0;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;

    iframe, object, embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 0.3em;
      border: 1px solid var(--border-color);
    }
  }

  /* Mark */
  mark {
    background: rgba(var(--primary-900) / 0.7);
    color: rgba(var(--primary-200) / 1);
    padding: 0.1em 0.2em;
    border-radius: 0.2em;
  }
}
</style>
