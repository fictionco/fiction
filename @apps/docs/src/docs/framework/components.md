# Factor Components

## Overview

By default, Factor includes a few key components that serve as a useful standard for extensions to build on. Primary examples include buttons, modals, links, etc.. Including these in Factor improves your default experience with plugins and prevents you from building them time and again from scratch. Below we'll discuss using these as well as tools for customizing/overriding them.

Factor also includes many tools for working with and creating custom components of your own. We'll also discuss adding these.

## Standard Components

### Elements

#### Buttons

`factor-btn`

The standard way of working with buttons in the front-end is using the `factor-btn` component.

The default button takes three primary props:

- `btn` The color and style of the button: "default", "primary", "secondary" (more can be added via overriding)
- `size` - The size of the button: "large" "small" "tiny"
- `loading` Show a loading indicator instead of text (useful during async operations)

#### Customizing Buttons

This component is easily overridden using `factor-settings` under core > components > btn.

**Important** There is both a front-end button and dashboard button added to Factor, so any overriding of this element will affect the front-end only (as the dashboard button is separate).

Alternatively to a full override, the `btn` property simply adds a class to the buttons. So you can use any value you want and then apply custom styling (or override the default styling with specificity.)

#### Links

`factor-link`

Factor's internal linking system is built on that of Vue Router. Vue Router provides a standard `router-link` component that `factor-link` extends to add useful functionality like the ability to link externally.

This component takes the following props:

- `path` - The path you'd like to link to. Anything with a URI protocol, e.g. https:..., will be treated as a standard link. While anything else is treated like a link to somewhere in your app.
- `query` - Data to add to the end of the URI in the link as a query string (or to the event as below).
- `event` - An event to be emitted on click with the data added via `query` as the argument (`$emit('event-name', query)`)
- `btn` - The link also supports button links as well as the standard props for buttons as above (loading, size, btn).

```html

<!-- Link to external site or resource -->
<factor-link path="https://factor.dev">My External Link</factor-btn>

<!-- Link to internal page /my-page -->
<factor-link path="/my-page">My Internal Link</factor-btn>

<!-- Add Query Data - /my-page?myData=hi -->
<factor-link path="/my-page" :query="{myData: 'hi'}">My Internal Link</factor-btn>

<!-- Make a button link - /my-page?myData=hi -->
<factor-link btn="primary" loading="false" path="/my-page" :query="{myData: 'hi'}">My Button Link</factor-btn>

```

#### Modals

### Forms and Inputs

#### Standard Inputs

### Customizing Standard Components

#### Factor Settings for Standard Components

Most of the standard components can be overridden by adding values in your settings value corresponding to the ones in the core components [factor-settings file](https://github.com/fiction-com/factor/blob/master/%40factor/%40core/ui-components-standard/factor-settings.js).

#### Dashboard vs App

When working with standard components, it's important to note that many of these are used both in your front-end app as well as the dashboard. Any direct customizations to a standard component may have effects in your dashboard, unless this is something that's been accounted for and discussed above.

## Custom Components

Adding all the custom components you'd like to your app is a straight-forward process. There are two primary methods for including custom components throughout your views.

- Add a global component using the `components` filter
- Import a component relatively using a dynamic import

### Adding Global Components

It's possible to add components globally to your app so they are available without having to specifically import them. To do this, we just use Factor's components filter:

```javascript
// index.js
export default Factor => {
  constructor(){
    this.addComponents()
  }
  addComponents(){
    Factor.$filters.add("components", components => {
      // Adds the file ./my-component.vue as a globally available component
      // Available in your templates using <my-component />
      components["my-component"] = () => import("./my-component")
      return components
    })
  }
}
```

### Relative Components

To only require components from within other components, you can use a simple dynamic import inside Vue's components property:

```javascript
// the file './my-component.vue' will be available in THIS component's template as  <my-component />
components: {
  'my-component': () => import('./my-component')
}
```
