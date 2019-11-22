# Meta and Metatags

Factor supports a rich metatag and meta information system via the popular [Vue Meta Plugin](https://github.com/nuxt/vue-meta).

The features of this plugin are fully implemented on both the client and in server rendering.

## Setting In Components

The meta system for Factor reads the `metaInfo` property from your view components, giving priority to those that are more nested. Then it merges the results together to form a final meta output.

```js
// Inside your Vue component
export default {
  metaInfo() {
    return {
      title: "My title",
      description: "My description",
      image: require("./my-og-image.jpg"),
      meta: []
    }
  }
}
```

## Metainfo Tips

Here are few Factor specific additions and tips for working with your app's meta information:

1. Factor adds a shorthand for `description` and `image` (sharing image), you can just add those to the base of your metaInfo object (as shown above)

2. Setting default meta: Use the `meta-default` filter to change global defaults or add `metaInfo` property to your `content.vue` to set defaults for all front-end interfaces.

3. The `meta` sub-property defaults to just concatenating any additional meta info it finds, even if they are the same. To force this to be unique, use the `vmid` property (as discussed on the [Vue Meta](https://vue-meta.nuxtjs.org/faq/#unique-metadata) docs)
