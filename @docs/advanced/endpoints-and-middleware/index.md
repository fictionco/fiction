---
title: Creating Endpoints and Middleware
description: Guide for creating and working with server endpoints and middleware
---

# Endpoints and Middleware

Endpoints and middleware are the primary mechanism for performing "trusted" transactions in any app.

For example, any direct database transaction must happen in an endpoint.

In advanced and extension development, creating endpoints is common whenever you want to work with APIs or directly with posts and the database. Let's go through the tools available.

## Creating an Endpoint

To create an endpoint all that is needed is to run the `addEndpoint` function inside the server environment and pass along the methods that should be available.

```js
import { addEndpoint } from "@factor/api"

// Endpoint method on server
export const exampleEndpointMethod = async (params, meta) => {
  return params.text + " world"
}

// Add an endpoint
addEndpoint({
  id: "my-endpoint",
  handler: { exampleEndpointMethod },
})
```

## Making Endpoint Requests

Now that we've created the endpoint, we can make a request to it. This is usually done from the 'app' environment and uses the function `endpointRequest`.

```js
const result = await endpointRequest({
  id: "my-endpoint",
  method: "exampleEndpointMethod",
  params: { text: "hello" },
})

// hello world
```

The above is a simple example, but in practice endpoints are primarily used for performing custom queries on the [database](./database) or using APIs for trusted transactions (e.g. Stripe transactions, sending email, etc..).

## Bearer (Authentication)

Since the Factor server doesn't know about the authentication state of users, endpoint requests using `endpointRequest` are sent with a `Authorization` header. This header is the token discussed in [authentication](./authentication) document.

On the server, this token is securely decoded to the user and passed along to all endpoint functions as the `bearer`. Any secure operations on the server should verify that the bearer user has the needed privileges and information to perform the action.

```js
// Endpoint method on server
export const exampleEndpointMethod = async (params, meta) => {
  const { bearer } = meta

  if (bearer.accessLevel > 100) {
    return "cool"
  } else {
    return "not cool"
  }
}
```

## Endpoint Meta

Other information set as meta to all endpoint methods:

- **request** - the Express request
- **response** - the Express response
- **source** - the ID of the app sending the request. This is useful when multiple apps are sharing the same DB.

## Creating Middleware

Adding server middleware is a common way to add server functionality at URLs and is lower level than the endpoints system. A typical use case is to handle image uploads.

```js
import { addMiddleware } from "@factor/api"

addMiddleware({
  key: "exampleMiddleware",
  path: "/_example",
  middleware: [
    async (request, response) => {
      const { query, body } = request

      const data = { ...body, ...query }

      // do something

      response.send("did something").end()

      return
    },
  ],
})
```

With the above middleware, at the route `/_example` your server will output "did something" instead of show a standard 404 message.
