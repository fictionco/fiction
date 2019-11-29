import { addCallback, addFilter, applyFilters, log } from "@factor/tools"
import { endpointPath } from "@factor/endpoint"
import { getSinglePost } from "@factor/post/server"
import { parse } from "qs"
import { createObjectId } from "@factor/post/object-id"
import { Request, Response } from "express"
// Run after other imports have added themselves
addCallback("initialize-server", () => initializeEndpointServer())

type responseType = object | (string | object | number)[] | string

interface EndpointRequestHandler {
  ({ data, meta }: EndpointRequestParams): Promise<responseType>;
}

interface EndpointRequestParams {
  data: { method: string; params: object };
  meta: EndpointMeta;
}

interface EndpointItem {
  id: string;
  handler: () => Record<string, Function> | Record<string, Function>;
}

interface EndpointMeta {
  request: Request;
  response: Response;
  bearer: object;
}

interface EndpointRequestConfig {
  request: Request;
  response: Response;
  handler: EndpointRequestHandler;
}

export function addEndpoint({ id, handler }: EndpointItem): void {
  addCallback("endpoints", { id, handler })
}

export function initializeEndpointServer(): void {
  addFilter("middleware", (_) => {
    applyFilters("endpoints", []).forEach(({ id, handler }: EndpointItem) => {
      _.push({
        path: endpointPath(id),
        middleware: [
          async (request: Request, response: Response): Promise<void> => {
            return await processEndpointRequest({
              request,
              response,
              handler: (_) => runEndpointMethod({ ..._, id, handler })
            })
          }
        ],
        id
      })
    })
    return _
  })
}

export async function runEndpointMethod({
  id,
  handler,
  data,
  meta
}: EndpointRequestParams & EndpointItem): Promise<any> {
  const { method, params = {} } = data

  if (!method) {
    throw new Error(`No method provided for "${id}" request`)
  }

  const _ep = typeof handler == "function" ? handler() : handler

  if (!_ep[method] || typeof _ep[method] !== "function") {
    throw new Error(`Endpoint method ${id}:${method} is missing.`)
  }

  try {
    if (typeof _ep.permissions == "function") {
      await _ep.permissions({ method, meta, params })
    }
    return await _ep[method](params, meta)
  } catch (error) {
    log.error(`${error.message} in ${id}:${method}`)
    throw new Error(error)
  }
}

export async function processEndpointRequest({
  request,
  response,
  handler
}: EndpointRequestConfig): Promise<void> {
  const { query, body, headers } = request

  const meta = { request, response, bearer: defaultBearer() }

  const data = { ...body, ...parse(query) }

  const { authorization } = headers

  const responseJson: { result: responseType; error: object } = { result: "", error: {} }

  // Authorization / Bearer
  // If there is an error leave as null bearer but still run method
  try {
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split("Bearer ")[1]

      meta.bearer = token ? await getSinglePost({ token }) : defaultBearer()
    }
  } catch (error) {
    responseJson.error = error.message || 500
    log.error(error)
  }

  // Run Endpoint Method
  try {
    responseJson.result = await handler({ data, meta })
  } catch (error) {
    responseJson.error = error.message || 500
    log.error(error)
  }

  response
    .status(200)
    .jsonp(responseJson)
    .end()

  return
}

function defaultBearer(): { _id?: string } {
  return process.env.FACTOR_ENV == "test" ? { _id: createObjectId() } : {}
}
