---
title: Localization and Internationalization (i18n)
description: Learn how to localize your app, how to add translations and contribute them.
---

# Localization (i18n)

Factor supports localization or i18n (short for internationalization) via a simple lang file system that integrates with [settings](./settings).

Let's go through the steps needed to:

- Set your app's locale / language
- Add custom translations
- Contribute translations to core or plugins

## Setting Your Locale

The first step in changing your app's language is to set the "locale" which is a standard language based code. For example, English is `en` and Spanish is `es`, etc...

You can see a full reference of language codes at the bottom of this doc.

> Note that the default and fallback language code is english `en`.

There are three ways to set the locale:

### Using `setLocale`

You can set the locale with a function `setLocale` in your [main files](./main-files). This has the advantage of being potentially dynamic, allowing you to change the language based on user preference.

```js
// index (main file)
import { setLocale } from "@factor/api"

// Set to Spanish locale
setLocale("es")
```

### Using Config

You can also set the locale via `package.json` or `FACTOR_LOCALE` in `.env`. This is a more reliable way to set a permanent language for your app.

```bash
# .env - Set to Chinese
FACTOR_LOCALE="zh"
```

or in `package.json`:

```json
{
  "factor": {
    "locale": "it" // Italian
  }
}
```

## Custom Translations

Now that your locale is set, you are set up to pull in translations and add custom ones of your own.

Factor translation works with `factor-lang-[language-code].ts` files. These are automatically compiled at build and loaded based on your locale. They are then merged with `factor-settings`.

So to add custom Spanish translations to your app, first identify the settings file that you'd like to translate. As an example, if a plugin has a file `factor-lang-en.ts` with the following object:

```js
// factor-lang-en.ts
export default {
  thePlugin: { greeting: "hello!" },
}
```

You could add a `factor-lang-es.ts` file to your app with the following:

```js
// factor-lang-es.ts
export default {
  thePlugin: { greeting: "hola!" },
}
```

Now if your locale is `es` whenever that plugin uses `setting("thePlugin.greeting")` it will pull in the localized `es` value:

```js
import { setLocale, setting } from "@factor/api"

setLocale("es")

setting("thePlugin.greeting") // "hola!"
```

## Adding Translations to Plugins, Themes or Core

Since finding settings files and then adding custom translations can be a hassle, its much easier if translations already exist. However, this doesn't happen without contributions from users such as yourself

To add a custom translation, just fork any repo and add your `lang` file. Then, when your ready just create a pull request.

Most authors, including us, are happy to accept translations in your language!

## Language Codes

- **Afrikaans:** af
- **Albanian:** sq
- **Arabic:** ar
- **Armenian:** hy
- **Azerbaijani:** az
- **Basque:** eu
- **Belarusian:** be
- **Bulgarian:** bg
- **Catalan:** ca
- **Chinese:** zh
- **Croatian:** hr
- **Czech:** cs
- **Danish:** da
- **Dutch:** nl
- **English:** en
- **Estonian keel**: et
- **Filipino:** tl
- **Finnish:** fi
- **French:** fr
- **Galician:** gl
- **Georgian:** ka
- **German:** de
- **Greek:** el
- **Haitian:** ht
- **Hebrew:** iw
- **Hindi:** hi
- **Hungarian:** hu
- **Icelandic:** is
- **Indonesian:** id
- **Irish:** ga
- **Italian:** it
- **Japanese:** ja
- **Korean:** ko
- **Latvian:** lv
- **Lithuanian:** lt
- **Macedonian:** mk
- **Malay:** ms
- **Maltese:** mt
- **Norwegian:** no
- **Persian:** fa
- **Polish:** pl
- **Portuguese:** pt
- **Romanian:** ro
- **Russian:** ru
- **Serbian:** sr
- **Slovak:** sk
- **Slovenian:** sl
- **Spanish:** es
- **Swahili:** sw
- **Swedish:** sv
- **Thai:** th
- **Turkish:** tr
- **Ukrainian:** uk
- **Urdu:** ur
- **Vietnamese:** vi
- **Welsh:** cy
- **Yiddish:** yi
