---
title: Server Endpoints
description: Creating custom server endpoints
---

Factor's provides an endpoint server where you, or plugins, can add custom endpoints. These allow you to work with privileged functionality and external APIs.

## About Endpoints

An endpoint is a path on a server designed to take HTTP requests and return responses.

In Factor's case, all endpoint requests return responses in [JSend JSON format](https://github.com/omniti-labs/jsend).

Factor's endpoint system is built on standard [Express](https://expressjs.com/) and Node based syntax.

## Creating Custom Endpoints

Custom endpoints accept a `handler` which is passed the HTTP request and response. It should return a [JSend](https://github.com/omniti-labs/jsend) result.

The format for a simple endpoint is as follows:

```ts
import express from "express"
import { EndpointResponse } from "@factor/api"
const myEndpoint = {
  name: "myCustomEndpoint",
  route: "/my-endpoint-path/:param",
  handler: async (request: express.Request): Promise<EndpointResponse> => {
    const myParam = request.params.param
    const args = request.body

    // do stuff

    return {
      status: "success",
      data: { foo: "bar" },
    }
  },
}
```

Once you have your endpoint created, all you need to do is add it to the endpoints array in your server entry file (`server.ts`)

```ts
// FILE: server.ts
import { myEndpoint } from "./custom-endpoint"

export const setup = () => {
  return {
    endpoints: [myEndpoint],
  }
}
```
