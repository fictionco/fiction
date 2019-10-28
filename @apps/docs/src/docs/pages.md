# Dynamic Pages and Page Templates

## Overview

Factor supports a dynamic page and page template system that is useful for both apps and themes.

The use case for pages is to make various types of pages available to create and edit from the dashboard, which has the following advantages:

- No rebuilding your app for every change (common issue with static site generators)
- Themes can pre-design pages that can be shown in the dashboard interface
- Non-technical users can easily edit content

> **Note:** Dynamic pages should not be confused with "routes" or "views" which are the typical way of setting a component to a route in Vue apps. This is discussed in the [routes doc](./routes-and-stores).

## Using Dynamic Pages

By default, Factor supports a native `page` post type that can be used to create pages on your site. To add a page:

1. Visit your dashboard
2. Click Pages &rarr; Add New
3. Add settings for your page including URL (permalink) and content
4. At bottom you have the option of setting your page template, adding templates to an app is documented below

## Adding A Page Template

There are two easy ways to add a page template to your app or theme: the `page-templates` filter and `factor-settings`. Each template has the values:

- `_id` - which is the unique identifier for your template,
- `component` - which is the page component that should be loaded. Options for the templates are set via the page component discussed below.
- `name` - The name of the page template in dashboard interfaces.

```js
// (Important: This approach should be used by plugins)
addFilter("page-templates", _ => {
  return [
    ..._,
    {
      name: "My Landing Page",
      _id: "landing-page",
      component: () => import("./tpl-landing-page")
    }
  ]
})

// Via factor-settings
// Replaces default templates
export default Factor => {
  return {
    pageTemplates: {
      templates: [
        {
          name: "My Landing Page",
          _id: "landing-page",
          component: () => import("./tpl-landing-page")
        }
      ]
    }
  }
}
```

Note that if two pages have the same `_id` then the first will be removed and the second used. This allows applications and themes to override templates easily. This is also useful is changing the "default" template.

## Template Settings

The key part of the page template system is the simple page-by-page template setting feature.

### Configure Settings

This feature supports the following input types:

- text
- textarea
- sortable (creates an array)
- select

To configure these settings, add a config array to the page template component:

```js
export default {
  // ...other component code
  computed: {
    post() {
      return this.$store.val("post") || {}
    }
  },
  templateSettings() {
    return [
      {
        input: "text",
        label: "Heading",
        description: "Primary page heading",
        _id: "pageHeading",
        default: "Landing Page Template"
      },
      {
        input: "text",
        label: "Sub Heading",
        _id: "pageHeadingSub",
        default: "This is a landing page template."
      },
      {
        _id: "boxes",
        input: "sortable",
        label: "Feature Boxes",
        description: "Some feature boxes",
        default: [{ __title: "Box 1" }, { __title: "Box 2" }, { __title: "Box 3" }],
        settings: [
          {
            input: "text",
            label: "Heading",
            _id: "heading",
            default: "Box"
          },
          {
            input: "textarea",
            label: "Description",
            _id: "description",
            default: "Box Description"
          },
          {
            input: "image-upload",
            label: "Icon",
            _id: "icon"
          }
        ]
      }
    ]
  }
  // ...other component code
}
```

### Using Settings

To use the values in your component, just reference the `_id` from the settings as it relates to the `post` object which is automatically set when a dynamic page template is loaded. (The `post` variable is set in the computed property above).

```html
<template>
  <div class="landing-page">
    <div class="feature">
      <div class="feature-content">
        <h1>{{ post.settings.pageHeading }}</h1>
        <div class="sub">{{ post.settings.pageHeadingSub }}</div>
        <factor-btn size="large" btn="primary">Button</factor-btn>
      </div>
    </div>
    <div class="feature-boxes">
      <div v-for="(box, i) in post.settings.boxes" :key="i" class="box">
        <div v-if="box.icon" class="box-icon">
          <img :src="box.icon[0].url" />
        </div>
        <div class="box-heading">{{ box.heading }}</div>
        <div class="box-description">{{ box.description }}</div>
      </div>
    </div>
  </div>
</template>
```
