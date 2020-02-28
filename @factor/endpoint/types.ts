import { Request, Response } from "express"

import { CurrentUserState } from "@factor/user/types"

export type ResponseType = object | (string | object | number)[] | string | void

export interface EndpointRequestHandler {
  ({ data, meta }: EndpointRequestParams): Promise<ResponseType>;
}

export interface EndpointRequestParams {
  data: { method: string; params: object };
  meta: EndpointMeta;
  url: string;
  bearer: CurrentUserState;
}

export interface EndpointItem {
  id: string;
  handler: (() => Record<string, Function>) | Record<string, Function>;
}

export interface EndpointMeta {
  request?: Request;
  response?: Response;
  bearer?: CurrentUserState;
  source?: string;
  url?: string;
  serverRequest?: true;
}

export interface EndpointRequestConfig {
  request: Request;
  response: Response;
  handler: EndpointRequestHandler;
}
