# Stacks

*The goal of stacks is to allow you maximum flexibility regarding the underlying services that power your Factor app. This document discusses their purpose, how to use them and how to build them.*

## Purpose

Any dynamic app&mdash;from a basic blog to an enterprise application&mdash;needs services to have: 

- User Authentication
- Database
- Image Storage
- Hosting/Server

However, there is a problem. 

Because every app has a different way implementing these services there is no consistent interface for extensions to build on. 

This leads to a constant "reinventing of the wheel" since developers have to develop the same stuff to work with different service approaches. 

Stacks solve this problem, as they create a consistent interface to tools like `$db`, `$storage` and `$auth`.

## Installing A Stack

To install a Factor stack just it as a dependency in your `package.json`. This will tell Factor to install it and how to use it. 

For example, to install the theme that this site is running, just run: 

```bash
$ yarn add @factor/stack-mongo
```

Once installed as a dependency, Factor will load the stack as specified. 

The stack itself determines the specifics of how it should run, so reference the stack's documentation for additional information on its usage.

## Creating A Stack

All basic stack needs to do is "cover" the core `$auth`, `$db` and `$storage` service-requests made by Factor. This is done by linking the function calls from Factor to those made by the services supported in your stack. 

### Factor Service Requests

To define an interface for a service, Factor makes a service request using the following syntax: 

```javascript
const serviceRequestResult = await Factor.$stack.service(`the-service-request-id`, params, opts)
```

The above function registers the filter `the-service-request-id` and assumes that the stack (or a plugin) will cover the request by handling the parameters and returning the result. 

### Covering Service Requests

Responding to a Factor service request just means you handle the filter inputs and return an output. We call this "covering."

```javascript
// e.g. index.js
Factor.$stack.cover({
  id: `the-service-request-id`,
  service: params => this.myServiceRequestHandler(params)
})
```

### What To Cover

Factor provides some useful CLI commands to help you identify which service requests are not being handled or aren't being handled correctly. 

```bash
$ yarn factor run verify-stack
```

### Registering Provider and API Keys

To help your users with setup, you can register your service providers with Factor. This adds your config and API keys to the `factor setup` CLI command.

```javascript
// stack/index.js
Factor.$stack.registerProvider({
  provider: "algolia",
  description: "Site search and data indexing.",
  settings: {
    group: "algolia",
    secrets: ["adminKey"],
    config: ["searchKey", "appId"]
  }
})
```

