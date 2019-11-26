import { FactorUser } from "@factor/user/typings"

export interface PostEndpointMeta {
  bearer?: FactorUser | null;
}
