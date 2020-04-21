---
title: Standard UI Elements
description: A reference for standard UI elements available for Factor apps
---

# Standard UI Elements

Factor includes several standard UI elements and CSS files that can be used for common tasks.

## Using Elements

All elements are made available from the `@factor/ui` module. Import them into your components, making sure to add them under `components` inside Vue options.

## Link

#### Purpose

Add links between routes and to external resources.

#### Props

```yaml
# Props
- path: The path to URL. If it's a route it will use Vue Router. If it includes a protocol (e.g. https..) then it will navigate like a normal link.
- query: Query parameters
- to: Standard Vue Router `to` parameter.
- btn: Turn Turn into a 'factor-btn' ('primary', 'default')
  - tip: Accepts attributes for 'factor-btn'
```

#### To Import

```js
import { factorLink } from "@factor/ui"
```

#### In Template

```html
<factor-link path="https://www.fiction.com">External Link</factor-link>
<factor-link path="/">Local Link</factor-link>
<factor-link btn="primary" path="/">Button</factor-link>
<factor-link btn="default" path="/">Button</factor-link>
<factor-link btn="primary" path="/" :loading="true">Button</factor-link>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.link"></component>

## Spinner

#### Purpose

A universal loading indicator.

#### Props

```yaml
- colorMode(string): primary, text, placeholder (default)
- size(string): Spinner width
```

#### To Import

```js
import { factorSpinner } from "@factor/ui"
```

#### In Template

```html
<factor-spinner />
<factor-spinner color-mode="primary" />
<factor-spinner color-mode="text" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.spinner"></component>

## Modal

#### Purpose

Standard modal.

#### Props

```yaml
- vis.sync (boolean): Synced parameter. Set [true] to show modal.
```

#### To Import

```js
import { factorModal } from "@factor/ui"
```

#### In Template

```html
<factor-modal :vis.sync="vis">Your Modal Content</factor-modal>
<factor-btn @click="vis = !vis">Click Me</factor-btn>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.modal"></component>

## Button

#### Purpose

Standard buttons.

#### Props

```yaml
- btn(string): primary, secondary, text, default
- loading(boolean): Show loading spinner.
- size(string): normal, small, tiny, large
```

#### To Import

```js
import { factorBtn } from "@factor/ui"
```

#### In Template

```html
<div class="row">
  <factor-btn btn="primary">Click Me</factor-btn>
  <factor-btn btn="secondary">Click Me</factor-btn>
  <factor-btn btn="default">Click Me</factor-btn>
  <factor-btn btn="text">Click Me</factor-btn>
</div>
<div class="row sizes">
  <factor-btn size="large">Click Me</factor-btn>
  <factor-btn size="small">Click Me</factor-btn>
  <factor-btn size="tiny">Click Me</factor-btn>
</div>
<div class="row loading">
  <factor-btn size="large" :loading="true">Click Me</factor-btn>
  <factor-btn size="small" :loading="true">Click Me</factor-btn>
  <factor-btn size="tiny" :loading="true">Click Me</factor-btn>
</div>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.btn"></component>

## Avatar

#### Purpose

User profile images with Gravatar fallback.

#### Props

```yaml
- url(string): image URL
- user(object): Factor user object
- post-id(string): Post ID for an image in store
- loading(boolean): Loading spinner
```

#### To Import

```js
import { factorAvatar } from "@factor/ui"
```

#### In Template

```html
<factor-avatar :user="{email: `email@example.com`}" />
<factor-avatar email="email@example.com" />
<factor-avatar url="/icon.svg" />
<factor-avatar email="no-exist@example.com" />
<factor-avatar :loading="true" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.avatar"></component>

## Icon

#### Purpose

Loads Font Awesome and displays an icon. Free version only and loads max once per page.

#### Props

```yaml
- icon(string): A Font Awesome icon class
```

#### To Import

```js
import { factorIcon } from "@factor/ui"
```

#### In Template

```html
<factor-icon icon="fas fa-key" />
<factor-icon icon="far fa-trash-alt" />
<factor-icon icon="fas fa-map-marker-alt" />
<factor-icon icon="fas fa-camera x2" />
<factor-icon icon="fas fa-times x2" />
<factor-icon icon="fas fa-plus-square x2" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.icon"></component>

## Lightbox

#### Purpose

Lightboxes images in full screen mode.

#### Props

```yaml
- visible(boolean): Show lightbox
- imgs(array): Array of image urls
- index(number): Selected image index
```

#### Usage in Component

```html
<template>
  <div class="example docs-component-example">
    <factor-lightbox :visible.sync="vis" :images="images" :selected="selected" />
    <factor-btn btn="primary" @click="vis = !vis">View Images Lightbox &rarr;</factor-btn>
  </div>
</template>
<script lang="ts">
  import { factorLightbox, factorBtn } from "@factor/ui"
  export default {
    components: { factorLightbox, factorBtn },
    data() {
      return {
        vis: false,
        selected: 0,
        images: [
          require("./img/icon-1.svg"),
          require("./img/icon-2.svg"),
          require("./img/icon-3.svg"),
          require("./img/icon-4.svg"),
        ],
      }
    },
    computed: {},
  }
</script>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.lightbox"></component>

## Standard Reset CSS

Most apps and themes will want to apply a CSS "reset" to help create consistency across browsers. Factor has one you can import as follows:

```less
// global scope
@import "~@factor/ui/css/standard-reset.less";
```

## Standard Entry CSS

Long form text&mdash;similar to the text in this document&mdash;typically uses a common formatting pattern and style. To help you quickly format and style text like this, Factor provides you a CSS file for standard long form entries.

```less
.my-entry-text {
  @import "~@factor/ui/css/standard-entry.less";
}
```
