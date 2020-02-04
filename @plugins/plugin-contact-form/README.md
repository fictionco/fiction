# Overview

This plugin makes it easy to add a contact form. It can be easily customized via factor-settings.js and/or you can use its filters to connect new signups with external services.

## Installation

Just add to your application dependencies:

```bash
npm add  @factor/plugin-contact-form
```

## Options and Settings

The customization system for this plugin is based on the standard `factor-settings.js` API that is provided by Factor.

### Changing Defaults

To start customization, add a `key` of `contactForm` to the settings file in your app. All you need to do is add your settings in the place of the default ones.

To customize defaults, you can

```js
// app factor-settings.js
export default {
  contactForm: {
    submit: {
      text: "my text"
    }
  }
}
```

## Factor Setup CLI

Run `npx factor setup` for a question based CLI to help you configure this plugin's options.
