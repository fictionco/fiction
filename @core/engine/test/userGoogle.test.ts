import { expect, it, vi, describe, beforeAll } from "vitest"
//import { FullUser } from "@factor/types"
import { objectId } from "@factor/api"
import { getTestEmail } from "@factor/test"
import { Query } from "../query"

vi.mock("google-auth-library", () => {
  return {
    OAuth2Client: vi.fn(() => ({
      verifyIdToken: vi.fn(() => {
        return {
          getPayload: vi.fn(() => {
            return {
              sub: objectId(),
              email: getTestEmail(),
              email_verified: true,
              iss: "https://accounts.google.com",
              nbf: 1_647_376_804,
              aud: process.env.GOOGLE_CLIENT_ID,
              azp: process.env.GOOGLE_CLIENT_ID,
              name: "test test",
              picture:
                "https://lh3.googleusercontent.com/a-/AOh14GhI8nBQQUi1e3yVZt76sMwxw_PNfaHNxCBxK0R2Occ=s96-c",
              given_name: "test",
              family_name: "test",
              iat: 1_647_377_104,
              exp: 1_647_377_104,
              jti: "c09e27fb6971eeefae223d5764cb806b00f56e6",
            }
          }),
        }
      }),
    })),
  }
})

const Queries: Record<string, Query> = {}

describe("google auth", () => {
  it("if no user exists, creates one with isNew = true, returns token", async () => {
    const methods = await import("../userGoogle")
    Queries.UserGoogleAuth = new methods.QueryUserGoogleAuth()
    const response = await Queries.UserGoogleAuth.serve(
      {
        credential: "not a token",
        _action: "loginWithCredential",
      },
      { server: true },
    )

    console.log("RESONSE", response)
  })

  it.todo("if user exists, returns login token")
})
