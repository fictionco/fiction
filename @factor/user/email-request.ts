import { emitEvent, addCallback } from "@factor/api"
import { endpointRequest, EndpointParameters } from "@factor/endpoint"

import {
  SendVerifyEmail,
  VerifyAndResetPassword,
  VerifyEmail,
  EmailResult
} from "./email-types"

export const sendUserEmailRequest = async (
  method: string,
  params: EndpointParameters
): Promise<EmailResult> => {
  const result = (await endpointRequest({
    id: "userEmails",
    method,
    params
  })) as EmailResult

  return result
}

export const sendVerifyEmail = async ({ _id, email }: SendVerifyEmail): Promise<void> => {
  const result = await sendUserEmailRequest("sendVerifyEmail", { _id, email })

  if (result == EmailResult.success) {
    emitEvent("notify", "Verification email sent!")
  }

  return
}

export const verifyEmail = async ({ _id, code }: VerifyEmail): Promise<void> => {
  const result = await sendUserEmailRequest("verifyEmail", { _id, code })

  if (result == EmailResult.success) {
    emitEvent("notify", "Email confirmed!")
  }
  return
}

export const showResetPassword = async (): Promise<void> => {
  addCallback({
    key: "resetPass",
    hook: "sign-in-modal-loaded",
    callback: () => {
      emitEvent("sign-in-modal")
    }
  })
}

export const verifyAndResetPassword = async (
  args: VerifyAndResetPassword
): Promise<void> => {
  const result = await sendUserEmailRequest("verifyAndResetPassword", args)

  if (result == EmailResult.success) {
    emitEvent("notify", "Password successfully reset!")
  }

  return
}

export const sendPasswordResetEmail = async ({
  email
}: {
  email: string;
}): Promise<void> => {
  const result = await sendUserEmailRequest("sendPasswordResetEmail", { email })

  if (result == EmailResult.success) {
    emitEvent("notify", "Password reset email sent.")
  }

  return
}
