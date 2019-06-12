# Endpoints and Middleware

Often there is a need to create app functionality that operates in a "trusted" environment such as the server. For example, in scenarios when trusted API keys must be used or private information must be handled. 

For scenarios like this, Factor includes endpoint and middleware filters that allow you to add functionality as needed to your server. 

## HTTP Endpoints

In Factor, server http endpoints are places where your application will send HTTP requests for actions that must happen in a trusted server environment. Some example scenarios:

- Indexing or deleting data in a third-party service 
- Charging a customer
- Authentication 

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

