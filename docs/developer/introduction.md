---
title: Developer Introduction
description: Fiction is a great platform for developers to build and extend marketing automation solutions.
---

# Introduction {#introduction}

:::info Fiction 10
You are reading the documentation for Fiction 10!
:::

## What is Personal Marketing? {#what-is-personal-marketing}

Personal marketing is about promoting yourself to potential employers, clients, or customers. It's about creating and sharing a personal brand that showcases your skills, experiences, and what makes you unique. Fiction supports this by offering tools to craft and share digital content, like websites and newsletters, helping you highlight your talents, achievements, and journey.


## What is Fiction? {#what-is-fiction}

Here's how Fiction stands out:

- **Personal Marketing Platform (PMP)**: Fiction is specifically designed for personal marketing. It provides the right tools to make it straight-forward and effective.
- **List Building and Personal Publishing**: Helps you grow your audience and keep them engaged with posts and newsletters.
- **AI Augmented Creation**: Speed up content creation with AI, making it easier to produce quality material consistently.
- **Drag and Drop Editing**: Offers a straightforward, drag-and-drop interface for website and content management.
- **Scalable and Open-Source**: Ready to support projects of any size, ensuring smooth operation as your needs grow.
- **Plugin Ecosystem**: Offers a variety of plugins to expand its capabilities and tailor the platform to your needs.
- **Comprehensive API**: Easily connects with your existing tools and services, making integration seamless.

## Creating A Basic Fiction App {#creating-a-basic-fiction-app}

Here's a minimal example:


```ts
// myproject/index.ts

import { FictionService, Theme, cardTemplates, cardConfig } from '@fiction/core'


const myElement = cardConfig({ templateId: 'hero', userConfig: { title: 'Hello, World!'}, cardTemplates })
const myPage = cardConfig({ isHome: true, cards: [myElement], cardTemplates })
const myTheme = new Theme({ themeId: 'example', pages: [myPage]})

export const setup = () => new FictionService({
  themes: [myTheme],
})
```

Here you have a simple Fiction app with a single page and a single element on that page. You can expand on this by adding more pages, cards, plugins, and themes to create a more complex application.
