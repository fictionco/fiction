import { describe, test, expect } from "@factor/api/testUtils"
import { isJson, groupBy, camelKeys, camelCase, camelize } from "../utils"

describe("utils", () => {
  test("isJson", async () => {
    const invalid = isJson("not valid json")
    const valid = isJson(`{"valid": "yes"}`)
    expect(invalid).toBeFalsy()
    expect(valid).toBeTruthy()
  })

  test("groupBy", async () => {
    const data = [
      { animal: "ape", age: 10 },
      { animal: "ape", age: 12 },
      { animal: "giraffe", age: 12 },
      { animal: "giraffe", age: 3 },
    ]
    const result = groupBy(data, "animal")
    expect(result).toMatchInlineSnapshot(`
      {
        "ape": [
          {
            "age": 10,
            "animal": "ape",
          },
          {
            "age": 12,
            "animal": "ape",
          },
        ],
        "giraffe": [
          {
            "age": 12,
            "animal": "giraffe",
          },
          {
            "age": 3,
            "animal": "giraffe",
          },
        ],
      }
    `)
  })

  test("camelKeys", () => {
    const basic = camelCase("simple_string")

    expect(basic).toMatchInlineSnapshot('"simpleString"')

    const basic2 = camelize("simple string")

    expect(basic2).toMatchInlineSnapshot('"simpleString"')

    const o = {
      status: "active",
      ok: true,
      app_id: "11111",
      authed_user: { id: "33333" },
      scope: "incoming-webhook,commands,chat:write",
      token_type: "bot",
      access_token: "123123",
      bot_user_id: "U01CVPCBKT6",
      team: { id: "T016E9TAQA3", name: "Kaption" },
      enterprise: null,
      is_enterprise_install: false,
      incoming_webhook: {
        channel: "notify",
        channel_id: "GgGgGgGgGg",
      },
    }

    const r = camelKeys(o)

    expect(r).toMatchInlineSnapshot(`
      {
        "accessToken": "123123",
        "appId": "11111",
        "authedUser": {
          "id": "33333",
        },
        "botUserId": "U01CVPCBKT6",
        "enterprise": null,
        "incomingWebhook": {
          "channel": "notify",
          "channelId": "GgGgGgGgGg",
        },
        "isEnterpriseInstall": false,
        "ok": true,
        "scope": "incoming-webhook,commands,chat:write",
        "status": "active",
        "team": {
          "id": "T016E9TAQA3",
          "name": "Kaption",
        },
        "tokenType": "bot",
      }
    `)
  })
})
