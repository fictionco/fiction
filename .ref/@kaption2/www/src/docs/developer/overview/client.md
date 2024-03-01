---
title: Developer API - JavaScript Client
description: Learn how to install and use the JavaScript Kaption client
---

If you are using an environment that is compatible with JavaScript. You can use Kaption's JavaScript client.

## Installation

There are two ways to include the client in your project: via dependency (recommended) or via tracking script global.

### Module Dependency (Recommended)

Add the client to your project as a dependency:

```bash
npm install @kaption/client
```

The benefit of using the module dependency is you'll benefit from TypeScript and other type inference where possible.

#### Initializing the Client

If you are using an ES6 compatible environment you can install via import:

```js
import { getClient } from '@kaption/client'

const client = getClient('PUBLIC_API_KEY')
```

If you are using commonJS:

```js
const kaption = require('@kaption/client')

const client = kaption.getClient('PUBLIC_API_KEY')
```

### Using Tracker Global

If you're using Kaption's tracking script you can also reference the client included inside of it. For this to work well, you'll need to make sure you only make calls after the tracking script has loaded.

As this is associated with your site already, you don't need to initialize the client as the tracker has already done that for you.

```js
// after tracking script has loaded
if (window.__kaption.client) {
  const client = window.__kaption.client

  // use client
}
```

## Available Methods

Now that you have the client installed and initialized, you can easily run any of the available methods: `identify`, `track`, `group`.

All methods return a promise designed to be used with "async/await" if desired.

```js
import { getClient } from '@kaption/client'

const client = getClient('PUBLIC_API_KEY')

// (wrap with async function to avoid top-level await)
async function trackSignup() {
  await client.track('User Registered', { email: 'charles@kaption.co' })
}

trackSignup()
```

## Return Values

When you track an event with the API the call with return a [jsend response](https://github.com/omniti-labs/jsend) with a status of:

- `status` - Result status
  - `success` - Event tracked successfully
  - `error` - Something went wrong with the tracking
- `message` - Error or success message
- `data` - Return data associated with the request (typically event data)

It will also include a `data` property which will include the data used to create the event.

```js
import { getClient } from '@kaption/client'

const client = getClient('PUBLIC_API_KEY')

// (wrap with async function to avoid top-level await)
async function identifyUser(userId) {
  const result = await client.identify(userId)

  if (result.status === 'success')
    console.log('All good', result.data)
  else if (result.status === 'error')
    console.error('tracking error', result.message, result.data)
}

identifyUser('userId12356')
```
