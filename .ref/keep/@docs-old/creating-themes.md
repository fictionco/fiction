# Creating Factor Themes

Factor themes are just Factor apps that leverage settings and code to make them customizable.

If you've created a Factor app, then you already know everything you need to create a theme (or convert an app into one).

### package.json > factor

To make a Factor app into a theme just add `factor > extend: theme` to the package.json file.

```json
// package.json
{
  "name": "superb-factor-theme", // Theme Name
  "factor": {
    "title": "Superb Factor Theme",
    "permalink": "superb-factor-theme", // Set theme page permalink
    "demo": "https://mysite.com/demo-url", // Set theme demo URL
    "category": "portfolio", // Set theme category in Factor library
    "load": ["app", "theme"],
    "extend": "theme" // Make a Factor app into a theme
  }
}
```

## Development Setup

Working on a theme is the same as working on a typical Factor app. Once it is setup, you should simply be able to run `factor dev` from the root of the theme to work on it.

## Theme Scope

The theme system is designed to help people create apps faster. Themes are like "pre-built Factor apps" and can either be used as a starting point or as a parent-like application dependency. Some examples of what a theme can include:

- Specific UI libraries along with their implementation setups in Factor
- A stylized set of Factor plugins and components

> If you're familiar with the [parent and child theme concept from WordPress](https://developer.wordpress.org/themes/advanced-topics/child-themes/), then a theme (parent) and app (child) have much the same relationship.

## Creating The Theme

The good news is that if you know how to create a Factor app, then you know how to create Factor themes.

The only thing to keep in mind is to keep things customizable. In Factor, this is accomplished using [settings](./settings-and-style) as well as [filters, callbacks and events](./filters-callbacks-events).

Read the documentation for [creating plugins](./creating-plugins) additional information on building extensions.

## Standards and Conventions

### Writing Theme Documentation

Some especially important information to cover:

- Installation and Setup
- Description of what the theme does and includes
- Available settings and CSS Variables

### Icon

Add a theme icon in .svg format sized at **200px x 200px** called **icon.svg** and place it in the root of your theme.

### Screenshots

Add screenshots to the root of your theme. These will be used in galleries for your app.

Add a primary screenshot sized at **1080px x 720px** called **screenshot.jpg** or **screenshot-wide.jpg**.

Add a tall screenshot at **720px x 1080px** called **screenshot-tall.jpg**.

Additional screenshots should start with `screenshot-` or `screenshot-tall-` and will be sorted alphanumerically.

### License

Factor themes should be compatible with the [GPLv2 license](https://en.wikipedia.org/wiki/GNU_General_Public_License).

### Distribution and Discovery

After you've [published your plugin as an NPM package](https://docs.npmjs.com/cli/publish), write us an email at [factor@fiction.com](mailto:factor@fiction.com) about getting your plugin listed on the [Factor plugins listing &rarr;](https://factor.dev/plugins)
