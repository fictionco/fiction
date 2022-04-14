/* eslint-disable @typescript-eslint/no-use-before-define */
import { OAuth2Client } from "google-auth-library"
import { _stop } from "../error"
import { logger } from "../logger"
import { EndpointResponse, FullUser } from "../types"
import { EndpointMeta } from "../engine/endpoint"
import { Query } from "../engine/query"
import { Queries as UserAuthQueries } from "./userAuth"

export class QueryUserGoogleAuth extends Query {
  private client?: OAuth2Client
  private clientId?: string
  private clientSecret?: string

  constructor() {
    super()
    if (this.isNode) {
      this.clientId = process.env.GOOGLE_CLIENT_ID
      this.clientSecret = process.env.GOOGLE_CLIENT_SECRET
    }
  }

  async getClient(): Promise<OAuth2Client> {
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

      logger.log({
        level: "info",
        description: "Google login",
        context: "auth",
        data: payload,
      })

      const { data: existingUser } = await UserAuthQueries.ManageUser.serve(
        {
          _action: "getPrivate",
          email: payload?.email,
        },
        _meta,
      )

      // no user, create one
      if (!existingUser) {
        await UserAuthQueries.ManageUser.serve(
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

      const loginResponse = await UserAuthQueries.Login.serve(
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

export const Queries = {
  UserGoogleAuth: new QueryUserGoogleAuth(),
}
