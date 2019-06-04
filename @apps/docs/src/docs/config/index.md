# Config and Setup

Factor provides a robust configuration system that works in harmony with most common approaches. Below we'll discuss the approach and conventions to setting up Factor config.

> **Note on config vs settings:** 
> 
> - Config: Factor configuration is centered around setting up different services and values across different environments.
> 
> - Settings: The `settings.js` file and dashboard are used to control and manage content, ui, etc.. 

## Config Files 

- **Application Secrets** (`.secrets.json`) - Secrets are keys and config that should NOT be accessible to anyone but app administrators; in fact, these keys should not even be added to source control. Available ONLY locally and optionally on the server. 
- **Application Config** (`config.json`) - Configuration that is considered public. Available on both the client and the server. 

### Key and Variable Conventions

#### Casing

To help distinguish between public vs private keys, Factor recommends an optional concention: 
- **UPPER_CASE_KEYS** - For private secrets and environmental variables
- **lower_case_keys** - For public configuration

### The Config Object

Inside each of the config files you will find a "config object." The config object contains key-value pairs that help determine which values to load depending on environmental configuration. 

- The *config* key is the "global config" loaded across all environments
- The *development* key is loaded for `NODE_ENV=development`
- The *production* key is loaded for `NODE_ENV=production` 
- Additional keys, e.g. *testing*, will load and be merged with the global config and NODE_ENV config

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

### Build Environment `NODE_ENV`

The two build environments determine how to build and bundle your app: 

- **development**
  - Optimized for development and debugging
  - If you run `factor develop`, then you will be in the *development* build environment.
- **production**
  - Optimized for size and speed
  - If you run `factor build` or `factor serve`, then you will be in the "production" build environment.

### Factor Environment `FACTOR_ENV`

The Factor environment is used to determine the behavior of Factor across different environments. For example, in production, development, testing, staging, etc.. 

To create a new environment, simply add the key to the config object inside the `config.json` or `.secrets.json` files. 

- The value of this variable defaults to the same value as `NODE_ENV`. 
- The configuration values for `FACTOR_ENV` are merged with the configuration values for `NODE_ENV`.
  
To run Factor using a custom environment, just use the `--env` option in the CLI. For example: 

```bash
# This will run NODE_ENV=development and FACTOR_ENV=testing
$ yarn factor dev --env=testing

# This will run NODE_ENV=production and FACTOR_ENV=heroku
$ yarn factor serve production --env=heroku
```

## Using Config Values

### $config.setting()

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

```

### Dot "." Notation

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

A common tool used for configuration is what is known as `.env` files or dotenv. Although you'll have to implement this on your own,  configuration works well with this approach. 

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