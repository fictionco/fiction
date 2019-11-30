import { CurrentUserState } from "@factor/user/types"
import { Request, Response } from "express"
export type responseType = object | (string | object | number)[] | string

export interface EndpointRequestHandler {
  ({ data, meta }: EndpointRequestParams): Promise<responseType>;
}

export interface EndpointRequestParams {
  data: { method: string; params: object };
  meta: EndpointMeta;
}

export interface EndpointItem {
  id: string;
  handler: () => Record<string, Function> | Record<string, Function>;
}

export interface EndpointMeta {
  request?: Request;
  response?: Response;
  bearer?: CurrentUserState;
}

export interface EndpointRequestConfig {
  request: Request;
  response: Response;
  handler: EndpointRequestHandler;
}
