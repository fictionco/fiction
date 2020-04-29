---
title: Basic App Configuration
description: The basic configuration information needed in a Factor app
---

# Basic Configuration

To get Factor to work seamlessly, make sure you have the basic configuration items set up.

## The Factor Property

Factor uses the `factor` property inside of `package.json` as the location for your app's basic public configuration.

For minimal configuration, we recommend adding your app's meta information, your initial admin users, and your main file loading config.

### App Meta Information

For your application, we need to know:

- App name
- App description (for meta information - optional)
- App email address (for transactional emails)
- App URL in production

```json
// package.json
{
  "factor": {
    "app": {
      "name": "Example App",
      "url": "https://example.com",
      "description": "An app that discusses examples.",
      "email": "Example Team <example@example.com>"
    }
  }
}
```

### Initial Admin Users

Also, Factor needs to know about your initial "admin" users. When you get started with CMS features, we'll need to know who has admin privileges and can promote other users.

We recommend you add your admin user's email addresses in your configuration as well.

> Note: You can also add admins in `.env` under `FACTOR_ADMINS=email@example.com`

```json
// package.json
{
  "factor": {
    "admins": ["admin@example.com", "another@example.com"]
  }
}
```

### Main File Loading

Main files are where you run your business code or hook into the rest of Factor.

Main file loading is discussed in the doc on [main files](./main-files).

```json
// package.json
{
  "factor": {
    "load": ["app", "server"]
  }
}
```
