# Endpoints and Middleware

*For operations that must happen on the server, Factor includes utilities for adding endpoints and middleware. This document discusses how to create and use them...* 

## When To Use

In a normal web-app, many actions need to happen in a trusted server environment. Some example scenarios:

- Indexing or deleting data in a third-party service 
- Charging a customer
- Authentication 

This is because transactions handle private information and secret API keys that can't be exposed to the public. 

Using endpoints and middleware allows the Factor application to securly request an action take place; and simply returns the result to the user.

## HTTP Endpoints

As endpoints are a common pattern, Factor includes a standard endpoint handling utility to make this easy.

- On the server
  - Endpoints are added via the `endpoints` filter
  - Endpoints represent a typical Factor module or class. This allows for simple resource sharing amonst similar endpoint requests. 
  - The endpoint handler takes care of parsing requests and determining authentication status.

- In the client
  - The form of an endpoint request uses `$factor.$endpoint.request(args)`
  - The request method arguments: 
    - `id` (required) - The ID of the endpoint to call
    - `method` (required) - The method of the endpoint class
    - `auth` (optional) - If the user must be authenticated (default: `true`)
    - `params` (optional) - Additional arguments are passed as parameters to the method (default: `{}`)

Adding an endpoint in a server accessible module/plugin:

```javascript
// Adding an endpoint in a server loaded module
export default Factor => {
  return new class{
    constructor(){
      // adds "this" representing the current class as the server endpoint handler
      // the endpoint ID is "myEndpoint"
      Factor.$filters.callback("endpoints", {
        id: "myEndpoint", 
        handler: this 
      })

      // Note: On the server Factor.$config.settings() is available with all secrets and environmental vars (TOP SECRET!)
    }

    endpointMethod(params){
      return `my response with option: ${params.myOption}`
    }
  }()
}
```

And in another plugin in the client or app: 

```javascript
// Requesting an endpoint transaction from your app
export default Factor => {
  return new class{
    constructor(){ }

    async requestEndpointMethod(){

      // Request and await transaction of endpointMethod 
      const response = await Factor.$endpoint.request({
        id: "myEndpoint", 
        method: "endpointMethod",
        params: {myOption: 123}
      })

      console.log(response) // "my response with option: 123"

      // Note: Authorization header automatically included with user token which is used to determine auth status
    }
  }()
}
```

## Middleware

Endpoints are built on top of "middleware." Middleware is used as a more general utility for handling server requests to specific URLs. In Factor, middleware is easily extended and adding middleware can solve many different problems, such as generating sitemaps or handling form data. 

In Node, middleware functions always take the form: 
```javascript
const myMiddleware = (request, response, next) => {}
```
- *Request* - Is the client's request to the URl
- *Response* - Is your server's response
- *Next* - Is a function which Node uses to determine if it should continue processing middleware at a specific URL or stop.

### Adding Middleware 

To add middleware to your Factor server, all you have to do is use the `middleware` filter and a middleware object which includes the `path` and callback function(s).

As an example, middleware for creating a sitemap might look like the following: 

```javascript
// index.js
export default Factor => {
  return new class{
    constructor(){
      addFilter('middleware', middlewares => {
        middlewares.push({
          path: '/sitemap.xml', 
          callback: async (request, response, next) => {
            // generate sitemap 
            const sitemapXML = await this.getSitemap()

            response.header("Content-Type", "application/xml")
            response.send(sitemapXML)

            // Notes: No 'next' call is needed since we don't need to continue processing other middleware
          }
        })
      })
    }
  }()
}
```

