import { emitEvent, addCallback } from "@factor/tools"
import { endpointRequest } from "@factor/endpoint"

addCallback("route-query-action-verify-email", _ => verifyEmail(_))
addCallback("route-query-action-reset-password", _ => showResetPassword(_))

export async function sendUserEmailRequest(method, params) {
  return await endpointRequest({ id: "user-emails", method, params })
}

export async function sendVerifyEmail({ _id, email }) {
  const result = await sendUserEmailRequest("sendVerifyEmail", { _id, email })

  if (result) {
    emitEvent("notify", "Verification email sent!")
  }

  return result
}

export async function verifyEmail({ _id, code }) {
  const result = await sendUserEmailRequest("verifyEmail", { _id, code })

  if (result) {
    emitEvent("notify", "Email confirmed!")
  }
  return result
}

export async function showResetPassword() {
  addCallback("signin-modal-loaded", () => {
    emitEvent("signin-modal")
  })
}

export async function verifyAndResetPassword(args) {
  const result = await sendUserEmailRequest("verifyAndResetPassword", args)

  if (result) {
    emitEvent("notify", "Password successfully reset!")
  }

  return result
}

export async function sendPasswordResetEmail({ email }) {
  const result = await sendUserEmailRequest("sendPasswordResetEmail", { email })

  if (result) {
    emitEvent("notify", "Password reset email sent.")
  }

  return result
}
