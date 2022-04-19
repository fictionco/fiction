/* eslint-disable @typescript-eslint/no-use-before-define */
import type { OAuth2Client } from "google-auth-library"

import type { FullUser } from "../plugin-user/types"
import type { EndpointResponse } from "../types"
import type { EndpointMeta } from "../engine/endpoint"
import { Query } from "../engine/query"
import type { FactorUser } from "."

type GoogleQuerySettings = {
  clientId?: string
  clientSecret?: string
  userPlugin: FactorUser
}

export class QueryUserGoogleAuth extends Query {
  private client?: OAuth2Client
  private clientId?: string
  private clientSecret?: string
  private userPlugin: FactorUser
  constructor(settings: GoogleQuerySettings) {
    super(settings)

    this.clientId = settings.clientId
    this.clientSecret = settings.clientSecret
    this.userPlugin = settings.userPlugin
  }

  async getClient(): Promise<OAuth2Client> {
    if (!this.clientId) throw new Error("missing clientId")
    if (!this.clientSecret) throw new Error("missing clientSecret")

    const { OAuth2Client } = await import("google-auth-library")
    if (!this.client) {
      this.client = new OAuth2Client({
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      })
    }
    return this.client
  }

  async run(
    params: { _action: "loginWithCredential"; credential: string },
    _meta?: EndpointMeta,
  ): Promise<
    EndpointResponse<FullUser> & {
      isNew?: boolean
      token?: string
      user?: FullUser
    }
  > {
    const client = await this.getClient()

    let user: FullUser | undefined = undefined
    let isNew = false
    let message = ""
    let token = ""

    if (params._action == "loginWithCredential") {
      const { credential } = params
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: this.clientId,
      })
      const payload = ticket.getPayload()

      if (!payload || !payload.email) throw new Error("no payload email")

      this.log.info("Google login", { data: payload })

      const { data: existingUser } =
        await this.userPlugin.queries.ManageUser.serve(
          {
            _action: "getPrivate",
            email: payload?.email,
          },
          _meta,
        )

      // no user, create one
      if (!existingUser) {
        await this.userPlugin.queries.ManageUser.serve(
          {
            _action: "create",
            fields: {
              email: payload?.email,
              emailVerified: payload?.email_verified,
              googleId: payload.sub,
              fullName: payload?.name,
              firstName: payload?.given_name,
              lastName: payload?.family_name,
              picture: payload?.picture,
            },
          },
          _meta,
        )

        isNew = true
      }

      const loginResponse = await this.userPlugin.queries.Login.serve(
        {
          email: payload.email,
          googleId: payload.sub,
          emailVerified: payload?.email_verified,
        },
        { server: true },
      )

      user = loginResponse.data
      token = loginResponse.token

      message = isNew ? "new user created" : "login successful"
    }

    return { status: "success", data: user, isNew, message, token, user }
  }
}

// export const Queries = {
//   UserGoogleAuth: new QueryUserGoogleAuth(),
// }
