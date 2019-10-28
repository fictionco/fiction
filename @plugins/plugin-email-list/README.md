# Factor Email List

## Overview

This plugin makes it easy to collect email addresses for something like an invite list, launch list or newletter.
It includes a signup form component, email confirmation, email follow-up, etc..

It can be easily customized via factor-settings.js and/or you can use its filters to connect new signups with external services.

## Installation

To install, just add `@factor/plugin-email-list` as a dependency to your [Factor](https://factor.dev) project.

```bash
$ yarn add @factor/plugin-email-list
```

## Basic Usage

Once installed, this plugin adds a globally available component: `<factor-email-list />`. You can place this anywhere in your Factor templates you'd like it to show up.

```html
<!-- some-component.vue -->

<template>
  <factor-email-list list-id="default" />
</template>
```

If you're using a custom list, with settings that are specific for that list, you'll need to add the `list-id` of the list you're using. More on that in the customization section below.

## Settings and Customization

The customization system for this plugin is based on the standard `factor-settings.js` API that is provided by Factor.

### Changing Defaults

To start customization, add a `key` of `emailList` to the settings file in your app. All you need to do is add your settings in the place of the default ones.

To customize defaults, you can

```js
// app factor-settings.js
export default Factor => {
  return {
    emailList: {
      default: {
        form: {
          buttonText: "My text"
        }
      }
    }
  }
}
```

### Adding A Custom List (with custom settings)

To use a custom list, add a new root key under `emailList`, below the ID is `customListId`. Inside of this add the custom settings, the format should match the default settings.

```js
// app factor-settings.js
export default Factor => {
  return {
    emailList: {
      customListId: {
        form: {
          buttonText: "My custom list text"
        }
      }
      default: {
        form: {
          buttonText: "My text"
        }
      }
    }
  }
}
```

#### Use the component

To use your new custom list just add the list ID to the component:

```html
<!-- some-component.vue -->

<template>
  <factor-email-list list-id="customListId" />
</template>
```

## Disable Emails

If you don't want to use the confirmation emails from this plugin, it's possible to disable one or all of the emails.

To disable a specific email, e.g. the 'complete' email, then just set it to `false` in `factor-settings`.

```js
// app factor-settings.js
export default Factor => {
  return {
    emailList: {
      customListId: {
        emails: {
          complete: false
        }
      }
    }
  }
}
```

To disable all emails, set the emails key to false:

```js
// app factor-settings.js
export default Factor => {
  return {
    emailList: {
      customListId: {
        emails: false
      }
    }
  }
}
```

## Using with External Services

If you'd like to use this plugin to add emails to external services like email systems or CRM systems, you can easily do that with the `email-list-add-[listId]` filter.

```js
import { addFilter } from "@factor/tools"
addFilter(`plugin-email-list-add-myListId`, email => {
  someExternalApi.addEmail(email)

  return email
})
```
