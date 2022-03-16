/* eslint-disable @typescript-eslint/no-use-before-define */
import { _stop } from "@factor/api/error"
import { logger } from "@factor/api/logger"
import { EndpointResponse, FullUser } from "@factor/types"
import { OAuth2Client } from "google-auth-library"
import { EndpointMeta } from "./endpoint"
import { Queries as UserAuthQueries } from "./userAuth"
import { Query } from "./query"

export class QueryUserGoogleAuth extends Query {
  private client?: OAuth2Client
  private clientId = process.env.GOOGLE_CLIENT_ID
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET

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
  ): Promise<EndpointResponse<FullUser>> {
    const client = await this.getClient()

    if (params._action == "loginWithCredential") {
      const { credential } = params
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: this.clientId,
      })
      const payload = ticket.getPayload()

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
        { server: true },
      )

      logger.log({
        level: "info",
        description: "Google exist",
        context: "auth",
        data: existingUser,
      })
    }

    return { status: "success", data: undefined }
  }
}

export const Queries = {
  UserGoogleAuth: new QueryUserGoogleAuth(),
}
