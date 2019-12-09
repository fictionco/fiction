# Endpoints and Middleware

The power of a dynamic platform comes down to being able to server-side functionality without relying on third-party APIs. To manage this, Factor has a simple endpoints and middleware API that allows you to easily add and manage server functionality.

## Endpoints

Endpoints are server-side functions that run when a specific application URL is requested. For example, if you added an endpoint at `/_api_/my-endpoint`, then sending a request there would return a response.

### Adding a Custom Endpoint

Let's create a custom endpoint for sending a Slack notification. Inside of a `server.js` entry file in your application, add the following code:

```js
// server.js

import { addEndpoint } from "@factor/api/endpoints"
import axios from "axios"

addEndpoint({ id: "slack", handler: { addSlackNotification } })

export async function addSlackNotification(params) {
  let { text } = params

  axios.request({
    method: "post",
    url: process.env.SLACK_NOTIFY_URL,
    data: { text }
  })
}
```

> Note that the `SLACK_NOTIFY_URL` needs to added to your `.env` file.

### Making an Endpoint Request

Now that we've added our custom endpoint on the server, all that we need to do is request it from our app.

```js
import { endpointRequest } from "@factor/endpoints"

export async function requestSlackNotification(text) {
  const result = await endpointRequest({
    id: "slack",
    method: "addSlackNotification",
    params: { text }
  })

  return result
}
```

Now from anywhere in our app we can make a call to `requestSlackNotification` and it should send a notification to the Slack url.

## Middleware

It's easy to add custom middleware endpoints and handling to Factor's Express server. All that is needed is the `addMiddleware` function.

As an example, let's show a sitemap at `/sitemap.xml`

```js
import { addMiddleware } from "@factor/server"
import { createSitemap } from "sitemap"

addMiddleware(
  path: "/sitemap.xml",
  middleware: [
    async (request, response, next) => {
        const sitemap = await createSitemap() // pseudo-code
        response.send(sitemap).end()
    }
  ]
})
```

### Middleware Handling Notes

- The `middleware` property is an array that gets processed in order.
- Each gets a `next` argument that is used to determine if processing should continue to the next middleware
- This is a standard [Express middleware utility](https://expressjs.com/en/guide/using-middleware.html), so reference its API for additional context
