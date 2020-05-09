---
title: Template Settings API
description: The API for creating settings for templates
---

# Template Settings API

The template settings API is a format for settings that is used by page templates and post types to create post-by-post settings.

This is a reference guide for options and configuration of template settings.

## Format

Template settings are used to render a list of settings for users. This is accomplished as an array of settings configuration objects. The general format looks like this:

```js
const myTemplateSettings = [
  {
    _id: "settingId",
    input: "---inputType---",
    label: "Setting Label",
    description: "The setting description",
    _default: "The default value",
    list: ["foo", "bar"],
    settings: [], // sortable input
  },
]
```

- `_id` is the key that you'll use to refer to the setting in your templates.
- `label` and `description` are used to add text to the setting
- `_default` is the default value of the setting if it is undefined
- `list` is for providing a [standard list](./form-ui) of options
- `input` is the type of input to show, discussed below.
- `settings` are nested settings for the sortable list input

## Types of Inputs

The template settings are built on the elements available under the [form UI](./form-ui). In each setting object, you can select on with the basic key of the input type:

- `sortable` - nested sortable inputs (discussed below)
- `text` - text input
- `textarea` - textarea input
- `email` - email text input
- `phone` - phone number text input
- `password` - password text input
- `checkbox` - checkbox input
- `birthday` - birthday input
- `date` - date input
- `image-upload` - image upload input
- `select` - select input
- `editor` - markdown editor
- `tags` - tags selector

## Sortable Lists

Often you'll want to allow users to organize a list of data items. This is the use case for the `sortable` input that is also discussed in the [Form UI](./form-ui) doc.

To configure a `sortable` with template settings, you can use the nested `settings` property.

You'll also need to add the default in an array format, however the nested settings defaults will be used if no value is set in the parent `sortable` setting config. Let's take a look:

```js
const myTemplateSettings = [
  {
    _id: "boxes",
    input: "sortable",
    label: "Feature Boxes",
    description: "Some feature boxes",
    _default: [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }],
    settings: [
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
    ],
  },
]
```

The above creates a sortable with three items (Box 1, 2, 3). In each item you'll have two inputs (heading (text), description(textarea)).

## Page Template Components

In [page templates](./page-templates) you can use template settings to create options for users on a page-by-page basis.

As an example, we'll use the settings above sortable idea to show a list of boxes that a user creates. Full example:

```html
<template>
  <div class="feature-boxes">
    <div v-for="(box, i) in settings.boxes" :key="i" class="box">
      <div class="box-heading">{{ box.heading }}</div>
      <div class="box-description">{{ box.description }}</div>
    </div>
  </div>
</template>

<script>
  import { stored } from "@factor/api"
  export default {
    computed: {
      post() {
        return stored("permalink") || {}
      },
      settings() {
        return this.post.settings || {}
      },
    },
    templateSettings() {
      return [
        {
          _id: "boxes",
          input: "sortable",
          label: "Feature Boxes",
          description: "Some feature boxes",
          _default: [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }],
          settings: [
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
          ],
        },
      ]
    },
  }
</script>

<style lang="less">
  // styles
</style>
```

## Template Settings in Post Types

When you create a post type, you may want to create custom settings for each individual post that is created. An example might be a portfolio where for each "portfolio item" you want to add a URL, dates, logo, etc..

To automatically add these settings you can just register them on the [post type](./post-type) with template settings.

```js
import { addPostType } from "@factor/api"

addPostType({
  // ... other options
  templateSettings: [
    {
      input: "url",
      label: "URL",
      _id: "url",
    },
  ],
})
```

In the default management UI the settings will be rendered for users. When they save them, they'll become available under the `post.settings` property.
