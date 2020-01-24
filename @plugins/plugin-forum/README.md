## Overview

Factor forum is a powerful forum solution for your factor app. This plugin comes with essential elements to run an efficient and professional community.

## Installation

Just add to your application dependencies:

```bash
yarn add @factor/plugin-forum
```

## Options and Settings

The customization system for this plugin is based on the standard `factor-settings.js` API that is provided by Factor.

```js
// app factor-settings.js
export default {
  forum: {
    indexRoute: "/my-forum-index-route",
    postRoute: "/my-forum-post-base-route",
    limit: 6
  }
}
```

## Factor Setup CLI

Run `yarn factor setup` for a question based CLI to help you configure this plugin's options.
