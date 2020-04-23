---
title: Styles and CSS Variables
description: Learn how to set custom styles and CSS variables to customize plugins, themes and Factor core
---

# Styles

It can be hard to make sure your app stays consistent in its look and feel. To simplify this, Factor provides standards and best practices to ensure a great looking app.

## The Problem

Look and feel can be difficult to maintain consistently across applications. While CSS and UI frameworks exist to help you with this, they come with their particular downsides and technical challenges.

To help you with this, Factor provides some useful standards that can help with consistency across your app.

## LESS Preprocessor

The only CSS preprocessor that is supported by default in Factor is [Less](http://lesscss.org/). This is because we don't recommend using any functionality in these preprocessors aside from [nesting](http://lesscss.org/#nesting).

In the [near future](https://drafts.csswg.org/css-nesting/), CSS nesting will become native, and therefore we won't need preprocessors at all.

> **Note** You can support other preprocessors via plugin

## Styles in Components

You can add CSS to any Vue component by adding a `<style>` tag. The style tag will then use any preprocessor specified in its `lang` attribute (as long as its been supported):

```html
<style lang="less">
  .my-component {
    p {
      font-weight: 700;
    }
  }
</style>
```

The styles from the component should be treated as global, so make sure to namespace them well (by using a unique wrapper class from the component); or use Vue's `scoped` attribute:

```html
<style lang="less" scoped>
  p {
    font-weight: 700;
  }
</style>
```

### Loading External CSS

It is possible to load external CSS files from files and component `<style>` tags:

```html
<style lang="less" scoped>
  .my-component {
    @import "~@factor/ui/css/standard-entry.less";
    @import "./my-styles.less";
  }
</style>
```

In the example above, the resulting CSS will be wrapped with `.my-component` appropriately scoping the styles.

## Global Styles

### Scoping Global Styles

When loading global styles in Factor, it's important that styles scoped to `body` or `html` reference the `html.factor-app` selector. This is needed because styles might leak to the dashboard(`html.factor-dashboard`) if they aren't scoped correctly.

```less
html.factor-app {
  --font-family-primary: -apple-system, Segoe UI, Roboto, Helvetica Neue, sans-serif;
  font-family: var(--font-family-primary);
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
}
```

### `content.vue`

One of the cleanest ways to handle your global styling is to add it to your [content wrapper](./content) component. This removes the need for a stand-alone CSS file.

```html
<!-- content.vue -->
<style lang="less" scoped>
  html.factor-app {
    // global styles
  }
</style>
```

### `factor-styles.less`

Factor supports a simple loading scheme for `factor-styles` files from apps and plugins. Its purpose is to load things in priority order of specificity (load CSS from plugins, then themes, then your app).

```less
// factor-styles.less
html.factor-app {
  // global styles
}
```

## CSS Variables

In order to maintain consistency across apps, plugins, and themes, Factor uses a few standard [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

CSS variables are easily set from your application and can be used by plugins to set colors, fonts, shadows, etc. appropriate to your desired look and feel.

To reference the variables we recommend setting, check out the [standard CSS variables](./css-variables) document.

### Setting CSS Variables

CSS variables must be scoped to a selector, in global cases we recommend scoping them to the `html.factor-app` selector:

```less
// factor-styles.less
html.factor-app {
  --color-primary: #0471ff;
}
```
