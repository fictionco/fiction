---
title: Development Monorepo Example
description: Example application for setting up a development monorepo with Yarn workspaces
---

# Factor Development Monorepo

As mentioned in [creating plugins](./creating-plugins), the recommended way of developing Factor extensions is using a "monorepo" along with Yarn workspaces and Lerna. 

## Example Project

[View Example Project](https://github.com/fiction-com/factor-example-workspace-development)

## Benefits of Monorepos

- Monorepos allow you to easily work with many modules within one repository. 
- You can publish modules independently depending on changes.
- Local dependency development can be tricky, with workspaces this is easy.
- Add all your themes, plugins and apps into one repo.
- Share development dependencies and additional tooling
