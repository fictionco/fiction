import { endpointRequest } from "@factor/endpoint"
import { storeItem } from "@factor/tools"
import { endpointId } from "./util"

export async function requestExtensionIndex() {
  const data = await endpointRequest({ id: endpointId, method: "getIndex" })
  storeItem("plugins-index", data)

  return data
}
