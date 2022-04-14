import { expect, it, vi, describe } from "vitest"
//import { FullUser } from "@factor/api"
import { getTestEmail } from "../../test-utils"
import { objectId } from "../.."
import { Queries as UserAuthQueries } from "../userAuth"
import { Queries as UserGoogleAuthQueries } from "../userGoogle"

const email = getTestEmail()
const googleId = objectId()
const email2 = getTestEmail()
const googleId2 = objectId()
const basicCredentialData = {
  email_verified: true,
  iss: "https://accounts.google.com",
  nbf: 1_647_376_804,
  aud: "not an id",
  azp: "not an id",
  name: "test test",
  picture:
    "https://lh3.googleusercontent.com/a-/AOh14GhI8nBQQUi1e3yVZt76sMwxw_PNfaHNxCBxK0R2Occ=s96-c",
  given_name: "test",
  family_name: "test",
  iat: 1_647_377_104,
  exp: 1_647_377_104,
  jti: "c09e27fb6971eeefae223d5764cb806b00f56e6",
}
vi.mock("google-auth-library", () => {
  return {
    OAuth2Client: vi.fn(() => ({
      verifyIdToken: vi.fn(() => {
        return {
          getPayload: vi
            .fn()
            .mockReturnValueOnce({
              sub: googleId,
              email: email,
              ...basicCredentialData,
            })
            .mockReturnValueOnce({
              sub: googleId2,
              email: email2,
              ...basicCredentialData,
            }),
        }
      }),
    })),
  }
})

describe("google auth", () => {
  it("if no user exists, creates one with isNew = true, returns token", async () => {
    const response = await UserGoogleAuthQueries.UserGoogleAuth.serve(
      {
        credential: "not a token",
        _action: "loginWithCredential",
      },
      { server: true },
    )

    expect(response.status).toBe("success")
    expect(response.isNew).toBe(true)
    expect(response.token).toBeTruthy()
    expect(response.data?.userId).toBeTruthy()
    expect(response.data?.email).toBe(email)
    expect(response.data?.googleId).toBe(googleId)
    expect(response.data?.fullName).toBe("test test")
    expect(response.user?.userId).toBeTruthy()
  })

  it("if user exists, returns login token, isNew = false", async () => {
    const response = await UserGoogleAuthQueries.UserGoogleAuth.serve(
      {
        credential: "not a token",
        _action: "loginWithCredential",
      },
      { server: true },
    )

    expect(response.status).toBe("success")
    expect(response.isNew).toBe(false)
    expect(response.token).toBeTruthy()
    expect(response.data?.userId).toBeTruthy()
    expect(response.data?.fullName).toBe("test test")
    expect(response.data?.email).toBeTruthy()
    expect(response.data?.googleId).toBe(googleId)
    expect(response.user?.userId).toBeTruthy()
  })

  it("if google login user exists with email and no googleId, if email is verified it links the googleId to the user", async () => {
    const responseCreate = await UserAuthQueries.ManageUser.serve(
      {
        _action: "create",
        fields: { email: email2, fullName: "test", password: "test" },
      },
      undefined,
    )

    expect(responseCreate.status).toBe("success")

    const responseLoginGoogle =
      await UserGoogleAuthQueries.UserGoogleAuth.serve(
        {
          credential: "not a token",
          _action: "loginWithCredential",
        },
        { server: true },
      )

    expect(responseLoginGoogle.status).toBe("success")
    expect(responseLoginGoogle.isNew).toBe(false)
    expect(responseLoginGoogle.token).toBeTruthy()
    expect(responseLoginGoogle.message).toMatchInlineSnapshot(
      '"login successful"',
    )
    expect(responseLoginGoogle.user?.userId).toBeTruthy()
  })
})
