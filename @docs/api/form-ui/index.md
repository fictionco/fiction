---
title: Form UI Elements
description: A reference for form UI elements available for Factor apps
---

# Form UI Elements

Factor includes several form UI elements that can be used for common tasks.

## Using Elements

All elements are made available from the `@factor/ui` module. Import them and then use them as Vue components.

## Standard Form CSS

To give developers flexibility inputs are unstyled by default. If you'd like to use the standard form CSS, you need to import it:

```less
html.factor-app {
  @import "~@factor/ui/css/standard-form.less";
}
```

Standard form CSS also gives you some additional CSS variables directed at forms and inputs:

```less
html.factor-app {
  --font-family-input: helvetica, sans-serif; // fallback: --font-family-primary
  --color-bg-input: #f7f7f7; // fallback: --color-bg
  --color-border-input: #ddd; // fallback: --color-border
}
```

## Standard List Format

Certain inputs, such as select or tags, use a "standard list format" for option names and values.

```js
// Longhand version (description is used occasionally)
const list = [
  { name: "Foo", value: "foo", desc: "" },
  { name: "Bar", value: "bar", desc: "" },
]

// Shorthand version that gets normalized to the first
const list = ["foo", "bar"]
```

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
  import { sortableSettings } from "@factor/templates"

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
        sorted: sortableSettings({ _default, settings }),
        settings,
      }
    },
  }
</script>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputSortable"></component>

## Tags

#### Purpose

Allows users to add a list of text tags or items.

#### Props

```yaml
- list(array): Standard list of options. Constrains the options into set values instead of just allowing text input.
- min(number): Minimum tags required
- max(number): Maximum tags allowed
```

#### Import

```js
import { factorInputTags } from "@factor/ui"
```

#### In Template

```html
<factor-input-tags v-model="tags" />
<factor-input-tags v-model="categories" :list="['foo', 'bar', 'baz']" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputTags"></component>

## Select

#### Props

```yaml
- list(array): Standard list of options.
- listSuffix(string): Add a suffix to each list item name
```

#### Import

```js
import { factorInputSelect } from "@factor/ui"
```

#### In Template

```html
<factor-input-select
  v-model="items"
  :list="['foo', 'bar']"
  placeholder="Select Something"
/>
<factor-input-select
  v-model="items"
  :list="[{name: `A more advanced list`, value: 'foo'}, {name: `With better names`, value: 'bar'}]"
  placeholder="Select An Item"
/>
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputSelect"></component>

## Date

A date picker.

#### Props

```yaml
- value(date|string|number): Date
```

#### Import

```js
import { factorInputDate } from "@factor/ui"
```

#### In Template

```html
<factor-input-date v-model="date" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputDate"></component>

## Birthday

A rapid birthday selector input.

#### Props

```yaml
- value(date|string|number): Date
```

#### Import

```js
import { factorInputBirthday } from "@factor/ui"
```

#### In Template

```html
<factor-input-birthday v-model="birthday" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputBirthday"></component>

## Checkbox

#### Props

```yaml
- label(string): Checkbox label
- value(boolean): Checked or unchecked
```

#### Import

```js
import { factorInputCheckbox } from "@factor/ui"
```

#### In Template

```html
<factor-input-checkbox v-model="checked" label="Checked" />
<factor-input-checkbox v-model="notChecked" label="Not Checked" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputCheckbox"></component>

## Text Inputs

#### Text, Email, Password, Phone, Textarea

Basic text based inputs with validation.

#### Imports

```js
import {
  factorInputText,
  factorInputTextarea,
  factorInputPassword,
  factorInputEmail,
  factorInputPhone,
} from "@factor/ui"
```

#### In Template

```html
<factor-input-text v-model="form.text" />
<factor-input-textarea v-model="form.textarea" />
<factor-input-password v-model="form.password" />
<factor-input-email v-model="form.email" />
<factor-input-phone v-model="form.phone" />
```

#### Rendered

<component class="inject-component" id="docsEngine.components.inputText"></component>
