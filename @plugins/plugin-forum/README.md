## Overview

Factor forum is a powerful forum solution for your factor app.

This plugin comes with essential elements to run an efficient and professional community.

### Features

- Standard forum features: topics and replies
- Pin and lock topic threads
- Notification and subscribing to forum topics
- Add and sort by category and tag taxonomies
- High performance posting and real-time replies

## Getting Started

To install and start using the forum, just add the package to dependencies:

```bash
npm add  @factor/plugin-forum
```

## Customization

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

### Overriding Components

It's possible and easy to override many of the components in the forum. This can be useful if the standard setting based customization just isn't enough.

To do this, first copy the original component from the plugin into you app.

Then reference where it is added as a setting in your `factor-settings`:

```js
// Forum factor-settings.js
export default {
  forum: {
    components: {
      topicReply: () => import("./topic-reply.vue")
    }
  }
}
```

And then simply add the overriding version of the component from your app:

```js
// Your app factor-settings.js
export default {
  forum: {
    components: {
      topicReply: () => import("./my-forum/topic-reply.vue")
    }
  }
}
```
