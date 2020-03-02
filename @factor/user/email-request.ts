import { emitEvent, addCallback } from "@factor/api"
import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { loadUser } from "@factor/user"
import {
  SendVerifyEmail,
  VerifyAndResetPassword,
  VerifyEmail,
  EmailResult,
  VerificationResult
} from "./email-types"

export const sendUserEmailRequest = async <T = EmailResult>(
  method: string,
  params: EndpointParameters
): Promise<T> => {
  const result = await endpointRequest<T>({
    id: "userEmails",
    method,
    params
  })

  return result
}

export const sendVerifyEmail = async ({ _id, email }: SendVerifyEmail): Promise<void> => {
  const result = await sendUserEmailRequest("sendVerifyEmail", { _id, email })

  if (result == EmailResult.success) {
    emitEvent("notify", "Verification email sent!")
  }

  return
}

/**
 * Verifies a user's email address with a code that has been emailed
 * @param _id - the user's _id
 * @param code - the code that was emailed to them
 */
export const verifyEmail = async ({ _id, code }: VerifyEmail): Promise<void> => {
  const { result, user } = await sendUserEmailRequest<VerificationResult>("verifyEmail", {
    _id,
    code
  })

  /**
   * If successful, send a notification and refresh user
   */
  if (result == EmailResult.success) {
    emitEvent("accountEmailVerified", { user })
    emitEvent("notify", "Email is verified!")
    loadUser()
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
