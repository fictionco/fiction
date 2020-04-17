There are two environments where we need to load main files:

- **Server** - Your server environment
- **App** - Your pre-built client app

You can break out the entry for the app vs the server as follows:

```json
// package.json
{
  "factor": {
    "load": {
      "app": "index", // Loads index.js (or .ts) in webpack app
      "server": "server" // Loads server.js (or .ts) in cli and express server
    }
  }
}
```

Or you can load the main file (index.js) in both environments

```json
// package.json
{
  "factor": {
    "load": ["app", "server"]
  }
}
```

### What are main files for?

Main files control the rest of your app. You can add anything in them but they are especially useful when you use them with filters and events that are called by other parts of the app.

For example, the code below would add a new route at `/example` and show the `v-example.vue` component there. To create this behavior you'd use the main file.

```js
// index.js
import { addContentRoute } from "@factor/api"
addContentRoute({
  path: "/example",
  component: () => import("/v-example.vue"),
})
```

In a server example, the code below adds an endpoint at `/_example`. You could build on this to create advanced functionality.

```typescript
// server.ts
import { addMiddleware } from "@factor/server/middleware"
addMiddleware({
  key: "example",
  path: "/_example",
  middleware: [
    async (request: Request, response: Response): Promise<void> => {
      response.send("cool").end()
      return
    },
  ],
})
```
