import {
  getTestEmail,
  createTestUtils,
  TestUtils,
  expect,
  it,
  describe,
  beforeAll,
} from "@factor/api/testUtils"

let testUtils: undefined | TestUtils = undefined
describe("user settings update", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()

    testUtils.initialized = await testUtils.init()
  })

  it("updates settings", async () => {
    const r = await testUtils?.factorUser.queries.UpdateCurrentUser.serve(
      {
        _action: "updateAccountSettings",
        fields: { fullName: "elvis" },
      },
      { bearer: testUtils?.initialized?.user },
    )

    expect(r?.data?.fullName).toBe("elvis")
  })

  it("updates email", async () => {
    const email = getTestEmail()
    let r = await testUtils?.factorUser.queries.UpdateCurrentUser.serve(
      {
        _action: "updateEmail",
        fields: { password: "12345", email },
      },
      { bearer: testUtils?.initialized?.user },
    )

    expect(r?.status).toBe("error")
    expect(r?.message).toBe("incorrect password")

    r = await testUtils?.factorUser.queries.UpdateCurrentUser.serve(
      {
        _action: "updateEmail",
        fields: { password: "test", email },
      },
      { bearer: testUtils?.initialized?.user },
    )

    expect(r?.status).toBe("success")
    expect(r?.data?.email).toBe(email)

    r = await testUtils?.factorUser.queries.UpdateCurrentUser.serve(
      {
        _action: "updatePassword",
        fields: { password: "changed", verificationCode: "test" },
      },
      { bearer: testUtils?.initialized?.user },
    )

    expect(r?.status).toBe("success")
    expect(r?.message).toBe("password updated")
  })
})
