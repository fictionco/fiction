---
title: Form UI Elements
description: A reference for form UI elements available for Factor apps
---

# Form UI Elements

Factor includes several form UI elements that can be used for common tasks.

## Using Elements

All elements are made available from the `@factor/ui` module. Import them and then use them as Vue components.

## Form Wrapper

#### Purpose

Wraps inputs in a `<form>`. Emits a `@submit` on enter.

#### Props

```yaml
- @submit: Fires when form is submitted (enter key).
```

#### To Import

```js
import { factorForm } from "@factor/ui"
```

#### In Template

```html
<factor-form @submit="send()">
  <!-- Form Inputs -->
</factor-form>
```

## Inputs Wrapper

#### Purpose

Wraps inputs with consistent markup for label and description.

#### Props

```yaml
- value(any): input value
- label(string): input label
- description(string): input description
- input(string): component name (as you'd call it in template)
- inputClasses(string): classes to add to input
- labelClasses(string): classes to add to label
# attrs + $listeners: Passes other attributes and events to input
```

#### To Import

```js
import { factorInputWrap } from "@factor/ui"
```

#### In Template

```html
<factor-input-wrap
  v-model="title"
  input="factor-input-text"
  label="Title"
  description="Your example title"
  placeholder="Write A Title"
  required
/>
<factor-input-wrap
  v-model="select"
  input="factor-input-select"
  label="Select Option"
  description="Options for selecting something"
  placeholder="Select Something"
  :list="['foo', 'bar', 'baz']"
  required
/>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputWrap"></component>

## Markdown Editor

#### Purpose

Standard Markdown editor used for formatted text.

#### Props

```yaml
- value(any): input value
- autosaveId(string): Enabled auto save based on passed ID
- allowImageUpload(boolean): Allow dragged images to upload
# attrs + $listeners: Passes other attributes and events to input
```

#### Import

```js
import { factorInputEditor } from "@factor/ui"
```

#### In Template

```html
<factor-input-editor autosave-id="ui" :allow-image-upload="false" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputEditor"></component>

## Image Upload

#### Purpose

Standard image upload component.

#### Props

```yaml
- value(array): array of image post Ids
- min(string|number): Minimum images
- max(string|number): Maximum images
```

#### Import

```js
import { factorInputImageUpload } from "@factor/ui"
```

#### In Template

```html
<factor-input-image-upload v-model="images" max="3" min="1" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputImageUpload"></component>

## Sortable Inputs

#### Purpose

Allow for ordered and arranged inputs and values. Ideal for config. Uses the [template settings API](/template-settings).

#### Props

```yaml
- settings(array): Template settings array
```

#### Import

```js
import { factorInputSortable } from "@factor/ui"
```

#### Template Example

```html
<template>
  <div class="wrap">
    <factor-input-sortable v-model="sorted" :settings="settings" />
  </div>
</template>

<script lang="ts">
  import { factorInputSortable } from "@factor/ui"
  import { initSortableSettings } from "@factor/templates"

  const _default = [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }]
  const settings = [
    {
      input: "text",
      label: "Heading",
      _id: "heading",
      _default: "Box",
    },
    {
      input: "textarea",
      label: "Description",
      _id: "description",
      _default: "Box Description",
    },
  ]
  export default {
    components: { factorInputSortable },
    data() {
      return {
        sorted: initSortableSettings({ _default, settings }),
        settings,
      }
    },
  }
</script>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputSortable"></component>

## Tags

## Select

## Date

## Birthday

## Checkbox

## Text, Email, Password, Phone, Textarea
