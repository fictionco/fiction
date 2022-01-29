import { logger } from "@factor/api"
import { EndpointResponse, PrivateUser, ErrorConfig } from "@factor/types"
import express from "express"
import { decodeClientToken } from "./serverJwt"
import { findOneUser } from "./user/serverUser"

/**
 * Takes authorization header with bearer token and converts it into a user for subsequent endpoint operations
 * @param bearerToken - JWT token sent from client in authorization header
 *
 * @category server
 */
export const setAuthorizedUser = async (
  request: express.Request,
): Promise<express.Request> => {
  const bearerToken = request.headers.authorization

  if (bearerToken && bearerToken.startsWith("Bearer ")) {
    const token = bearerToken.split("Bearer ")[1]
    request.bearerToken = token
    if (request.bearerToken) {
      const { email } = decodeClientToken(request.bearerToken)

      const user = await findOneUser<PrivateUser>({ email, select: ["*"] })

      if (user) {
        request.bearer = user
        request.bearer.token = token
      } else {
        request.bearer = undefined
      }
    }
  }

  return request
}

export const endpointAuthorization = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  if (request.path === "/favicon.ico") return

  const {
    headers: { authorization },
  } = request

  try {
    request = await setAuthorizedUser(request)
    next()
  } catch (error) {
    logger.log({
      level: "error",
      context: "endpoint",
      description: `endpoint setup error (${authorization ?? ""})`,
      data: error,
    })

    response
      .status(200)
      .send({
        status: "error",
        message: "authorization error",
        code: "TOKEN_ERROR",
      })
      .end()
  }
}

export const processEndpointRequest = <T extends Record<string, any>>(
  request: express.Request,
): {
  params: T[keyof T] & {
    userId: string
    bearer: PrivateUser
  }
  _method?: keyof T
  url: string
} => {
  const _method = request.params._method as keyof T | undefined
  const params = request.body as T[keyof T] & {
    userId?: string
    bearer?: PrivateUser
  }
  const { userId } = request.bearer ?? {}

  params.userId = userId
  params.bearer = request.bearer

  return { _method: String(_method), params, url: request.url }
}

export const endpointErrorResponse = (
  error: ErrorConfig,
  request: express.Request,
): EndpointResponse => {
  const details = processEndpointRequest(request)
  logger.log({
    level: "error",
    context: details.url,
    description: `endpoint error: ${details._method}`,
    data: { error, ...details },
  })

  return {
    status: "error",
    message: error.expose ? error.message : "",
    code: error.code,
    expose: error.expose,
  }
}
