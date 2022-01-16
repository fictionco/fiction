import type {
  UserFetch,
  UserEndpointMethod,
  UserEndpoint,
} from "@factor/server/user/serverTypes"
import { PublicUser, FullUser } from "@factor/types"
import { endpointFetch } from "./endpoint"
import { emitEvent } from "./event"
import { validateEmail } from "./utils"
import { applyFilters } from "./hook"

type EndpointProp<
  T extends keyof UserEndpoint,
  U extends "endpoint" | "request" | "response" | "method",
> = UserFetch<T>[U]

export const requestManageUser = async <T extends keyof UserEndpoint>(
  method: EndpointProp<T, "method">,
  data: EndpointProp<T, "request">,
): Promise<EndpointProp<T, "response">> => {
  const endpoint = `/user/${method}` as `/user/${T}`
  const r = await endpointFetch<UserFetch<T>>(endpoint, data)

  return r
}
/**
 * Get public user info associated with an email
 * if false then the user does not exist
 */
export const fetchPublicUser = async ({
  email,
}: {
  email: string
}): Promise<PublicUser | false | undefined> => {
  if (!validateEmail(email)) {
    emitEvent("notifyError", { message: "Email is invalid" })
    return
  }
  const { data } = await endpointFetch<UserFetch<"getPublicUser">>(
    "/user/getPublicUser",
    { email },
  )

  return data
}

/**
 * sends request for a one time verification code to be emailed
 */
export const requestSendOneTimeCode: UserEndpointMethod<
  "sendOneTimeCode"
> = async (args) => {
  const { email } = args
  if (!validateEmail(email)) {
    const message = "Email is invalid"
    emitEvent("notifyError", { message })
    return { status: "error", message }
  }

  const ep = "/user/sendOneTimeCode"
  const r = await endpointFetch<UserFetch<"sendOneTimeCode">>(ep, args)

  return r
}

export const getJsonUserFields = (): (keyof FullUser)[] => {
  return ["settings", "profile"]
}

export const getEditableUserFields = (): (keyof FullUser)[] => {
  const baseEditable: (keyof FullUser)[] = [
    "fullName",
    "avatar",
    "birthday",
    "cover",
    "gender",
    "about",
  ]

  return applyFilters("userEditableFields", baseEditable)
}

export const getPublicUserFields = (): (keyof PublicUser)[] => {
  const baseEditable: (keyof PublicUser)[] = [
    "userId",
    "email",
    "emailVerified",
    "role",
    "username",
    "fullName",
    "createdAt",
    "updatedAt",
    "avatar",
    "status",
    "lastSeen",
    "username",
    "profile",
  ]
  return baseEditable
}

// export const editableUserFields: (keyof PublicUser)[] = [
//   "username",
//   "fullName",
//   "avatar",
// ]

// export const publicUserFields: (keyof PublicUser)[] = [
//   "userId",
//   "email",
//   "emailVerified",
//   "role",
//   "username",
//   "fullName",
//   "createdAt",
//   "updatedAt",
//   "avatar",
//   "status",
//   "lastSeen",
//   "username",
// ]
