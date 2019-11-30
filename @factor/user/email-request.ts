import { emitEvent, addCallback } from "@factor/tools"
import { endpointRequest } from "@factor/endpoint"

addCallback("route-query-action-verify-email", (_: VerifyEmail) => verifyEmail(_))
addCallback("route-query-action-reset-password", () => showResetPassword())

export async function sendUserEmailRequest(method: string, params: object): Promise<any> {
  return await endpointRequest({ id: "user-emails", method, params })
}

export interface SendVerifyEmail {
  _id: string;
  email: string;
}

export async function sendVerifyEmail({ _id, email }: SendVerifyEmail): Promise<void> {
  const result = await sendUserEmailRequest("sendVerifyEmail", { _id, email })

  if (result) {
    emitEvent("notify", "Verification email sent!")
  }

  return
}

export interface VerifyEmail {
  _id: string;
  code: string;
}

export async function verifyEmail({ _id, code }: VerifyEmail): Promise<void> {
  const result = await sendUserEmailRequest("verifyEmail", { _id, code })

  if (result) {
    emitEvent("notify", "Email confirmed!")
  }
  return
}

export async function showResetPassword(): Promise<void> {
  addCallback("sign-in-modal-loaded", () => {
    emitEvent("sign-in-modal")
  })
}

export interface VerifyAndResetPassword {
  _id: string;
  code: string;
  password: string;
}

export async function verifyAndResetPassword(
  args: VerifyAndResetPassword
): Promise<void> {
  const result = await sendUserEmailRequest("verifyAndResetPassword", args)

  if (result) {
    emitEvent("notify", "Password successfully reset!")
  }

  return
}

export async function sendPasswordResetEmail({
  email
}: {
  email: string;
}): Promise<void> {
  const result = await sendUserEmailRequest("sendPasswordResetEmail", { email })

  if (result) {
    emitEvent("notify", "Password reset email sent.")
  }

  return
}
