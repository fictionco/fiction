# Configuring Services

## 3 Types of Config Files

Factor provides a configuration system that works in harmony with standards:

- **Public Config** &rarr; `factor-config.json`<br> Publicly accessible configuration for your application. Including admin users, public API keys, etc.

- **Private Config** &rarr; `.env`<br> A standard way of storing your private keys and information (powered by [Dotenv](https://github.com/motdotla/dotenv)). Anything here gets translated to "environmental variables" when you are running your app.

- **Customization** &rarr; `factor-settings.js`<br> The customization engine for your plugins, themes, etc. This is where you'll change text, set plugin options, override components, etc.

## Use `.env` for Private Keys

Factor uses the popular [Dotenv](https://github.com/motdotla/dotenv) system to help you manage your private keys and app information.

All variables added to your `.env` file will be translated to environmental variables and capable of being accessed in Factor either through `process.env` or `Factor.$config`.

### Using Private Keys

Add keys to your `.env` file as follows:

```git
# .env
MY_SERVICE_KEY="VAL"
```

Reference the private keys using `process.env`. Note these are only available in server files running in endpoints and your CLI.

```js
const key = process.env.MY_SERVICE_KEY // "VAL"
```

**Note:** `.env` files should never be added to source control. Environmental variables should be setup and managed manually for each server environment.

## Use `factor-config` for Public Keys

Add public configuration information into the `factor-config` file. This file has two main strengths:

- It supports different configurations based on `ENV` variables. For example, you can use different settings for `test` vs `staging` vs `production`.
- It's machine writeable, which means `factor setup` can help you add and remove values from it as needed.

Config object example:

```json
{
  "my_global_setting": "value",
  "development": {
    "my_development_setting": "value"
  },
  "production": {
    "my_production_setting": "value"
  },
  "testing": {
    "my_development_setting": "override_value"
  }
}
```

### Using Public Keys

Add keys and config to `factor-config.json`:

```json
{
  "exampleService": {
    "apiKey": 123
  }
}
```

Public config values are added and available using the `setting` utility (also used for `factor-settings`):

```javascript
import { setting } from "@factor/tools/settings"
// In your code
const myVariable = setting("exampleService.apiKey") // 123
```

## `NODE_ENV` and `FACTOR_ENV`

Factor supports two environment variables.

- `NODE_ENV` is the "build environment" only supports two values: **development** and **production**.
- `FACTOR_ENV` is the "context environment" and supports any value, but will inherit the value of `NODE_ENV` if it is unset.

```bash
# This will run NODE_ENV=development and FACTOR_ENV=testing
yarn factor dev --ENV=testing

# This will run NODE_ENV=production and FACTOR_ENV=heroku
yarn factor serve production --ENV=heroku
```
