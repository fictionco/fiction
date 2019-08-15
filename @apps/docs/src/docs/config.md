# Environment and Config

Factor provides a robust configuration system that works in harmony with most common approaches. Below we'll discuss the approach and conventions to setting up Factor config.

## Overview - 3 Types of Config Files

- **Public Config** &rarr; `factor-config.json`<br> Publicly accessible configuration for your application. Including admin users, public API keys, etc.
- **Private Config** &rarr; `.env`<br> A standard way of storing your private keys and information (powered by [Dotenv](https://github.com/motdotla/dotenv)). Anything here gets translated to "environmental variables" when you are running your app.
- **Customization** &rarr; `factor-settings.js`<br> The customization engine for your plugins, themes, etc. This is where you'll change text, set plugin options, override components, etc.

## Environmental Variables

Factor uses the popular [Dotenv](https://github.com/motdotla/dotenv) system to help you manage your private keys and app information.

All variables added to your `.env` file will be translated to environmental variables and capable of being accessed in Factor either through `process.env` or `Factor.$config`.

```git
# .env
MY_VAR="VAL"
```

```js
// Available server only
process.env.MY_VAL // "VAL"
Factor.$config.setting("MY_VAL") // "VAL"
```

**Note:** `.env` files should never be added to source control. Environmental variables should be setup and managed manually for each server environment.

## Configure: `factor-config.json`

Factor config is where publicly accessible configuration for your app should be stored. This file is structured so that you can optionally load in different config values based on your app's environment (NODE_ENV and FACTOR_ENV)

- `config:{}` is loaded across all environments
- `development:{}` or `production:{}` will be loaded for `NODE_ENV=development` or `NODE_ENV=production` respectively
- Additional keys, e.g. _testing_, will load based on `FACTOR_ENV` and be merged with global and NODE_ENV config

Config object example:

```json
{
  "config": {
    "my_global_key": "value"
  },
  "development": {
    "my_development_key": "value"
  },
  "production": {
    "my_production_key": "value"
  },
  "testing": {
    "my_development_key": "override_value"
  }
}
```

## Factor Environments

Factor supports two environment "types." One which we'll call the **build environment** uses the reserved `NODE_ENV` environmental variable and only supports two values: development and production.

The other supports these two values plus additional values which may or not "inherit" from others. For example, "testing" or "staging" might inherit from the development configuration but change certain values.

### Build Environment

```javascript
process.env.NODE_ENV
```

The two build environments determine how to build and bundle your app:

- **development**
  - Optimized for development and debugging
  - If you run `factor develop`, then you will be in the _development_ build environment.
- **production**
  - Optimized for size and speed
  - If you run `factor build` or `factor serve`, then you will be in the "production" build environment.

### Factor Environment

```javascript
process.env.FACTOR_ENV
```

The Factor environment is used to determine the behavior of Factor across different environments. For example, in production, development, testing, staging, etc..

To create a new environment, simply add the key to the config object inside the `config.json` or `.secrets.json` files.

- The value of this variable defaults to the same value as `NODE_ENV`.
- The configuration values for `FACTOR_ENV` are merged with the configuration values for `NODE_ENV`.

To run Factor using a custom environment, just use the `--ENV` option in the CLI. For example:

```bash
# This will run NODE_ENV=development and FACTOR_ENV=testing
$ yarn factor dev --ENV=testing

# This will run NODE_ENV=production and FACTOR_ENV=heroku
$ yarn factor serve production --ENV=heroku
```

## Using Config Values

### Getting Values

In your code you can easily retrieve configuration values using Factor's `$config.setting()` function. Example:

```json
// config.js
{
  "config": {
    "my_value": 123
  }
}
```

```javascript
// In your code
const myVariable = Factor.$config.setting("my_value") // 123

// Inside Factor components
const myVariable = this.$config.setting("my_value") // 123
```

```html
<!-- Inside Templates -->
<my-component :value="$config.setting('my_value')"></my-component>
```

### Dot Notation

When referencing variables, we use a dot notation to help translate between JS objects and text references to values. A dot represents a key-value relationship. Therefore, a key defined in config.json may be created like this:

```json
{
  "config": {
    "FOO": {
      "BAR": true
    }
  }
}
```

and referenced like this in code:

```javascript
const myVar = Factor.$config.setting("FOO.BAR")
```

> When adding environmental variables to hosts, it might not be conventient to work with nested values. In those cases you can set your env variables with the "." and Factor will return those.

## Dotenv and `process.env`

A common tool used for configuration is what is known as `.env` files or dotenv. Although you'll have to implement this on your own, configuration works well with this approach.

In the trusted server environment, Factor simply integrates `process.env` into the merged configuration object that is accessed using the standard `Factor.$config.setting()`.

```bash
# .env
DB_USER=something
DB_PASS=my_password
```

```javascript
// Node (trusted environment)
const dbConnectionInfo = {
  user: Factor.$config.setting("DB_USER")
  password: Factor.$config.setting("DB_PASS")
}
```
