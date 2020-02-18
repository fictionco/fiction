# Alpha - Factor Theme

> Alpha, a minimal portfolio theme for [Factor](https://factor.dev/) ideal for individuals of creative professions.

## Install

To add Alpha to your Factor app, all you have to do is add it as a dependency:

```bash
npm add  @factor/theme-alpha
```

This will add it to your `package.json` and should be all you need to do to get it running.

## Customization

Once you've added Alpha to your app, you can easily customize its settings via `factor-settings`.

The theme's settings can be [referenced here](https://github.com/fiction-com/factor/blob/development/%40themes/theme-alpha/src/factor-settings.ts).

To change any setting in this theme's factor-settings file, all you need to do is add the same setting in the settings file in your application.

As an example, adding the below to your `factor-settings` file will override the nav value in the theme. In effect, customizing the navigation.

```js
export default {
  site: {
    nav: [
      {
        path: "/",
        name: "My Home"
      }
    ]
  }
}
```

## Overriding Components

If you'd like to get more advanced with your customization, its also easy to override any templates or components used by the theme (or its plugins) via `factor-settings`.

As an example, to override the single post template used by the theme, first find the component in settings:

```js
export default {
  // other settings
  components: {
    blogIndex: (): Promise<Component> => import("./blog/blog-index.vue"),
    blogSingle: (): Promise<Component> => import("./blog/blog-single.vue"),
    featuredImage: (): Promise<Component> => import("./blog/el-featured-image.vue"),
    authorDate: (): Promise<Component> => import("./blog/widget-author-date.vue"),
    customSingleHeader: (): Promise<Component> => import("./blog/el-single-header.vue")
  }
  // other settings
}
```

You'll see that it is being loaded in as `blogSingle`, so all you have to do in your app to override with `my-special-single.vue` is:

```js
export default {
  // other settings
  components: {
    blogSingle: (): Promise<Component> => import("./my-special-single.vue")
  }
  // other settings
}
```

Making sure to copy the original or create a new file in your app at that location.

## Adding Additional Plugins, Routes

It's easy to build on top of the baseline functionality that themes create for you.

You can add additional routes and plugins in the standard ways discussed in the [Factor Docs](https://factor.dev/guide).
