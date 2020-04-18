---
title: Dotenv (.env) - Environmental Variables and Private Keys
description: Learn how to use your .env file to manage your private keys and environmental configuration.
---

# Environmental Variables and Keys

Factor uses the [Dotenv standard](https://github.com/motdotla/dotenv#readme) to set environmental configuration and to securely manage your private keys.

Dealing with private keys and environmentally-specific configuration can be challenging. However, the `.env` approach simplifies it and standardizes it.

> **Note:**
> Storing configuration in the environment separate from code is based on The [Twelve-Factor App](https://12factor.net) methodology.

## Using .env

Add a `.env` file to the root of your application. Once you've done that, Factor will detect this file and automatically load all variables into Node's `process.env` global.

Add variables with the following syntax:

```bash
# Comment
NAME=VALUE
```

## Best Practices

- **Never commit to source control (git).** Make sure you add `.env` to your `.gitignore` file.
- Environmental variables are meant to be setup manually for each environment.
- Your production environment may not use actual `.env` files; in production, reference your host's documentation for their recommendation on adding environmental variables.

## Resources

- [VSCode Plugin](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
- [Envfile](https://github.com/bevry/envfile) - Work with the contents of `.env` files. Useful in plugins.
