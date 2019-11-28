import { createApp } from "@factor/app/app"

describe("create-app", () => {
  it("creates vue application and returns correctly", async () => {
    const { vm, router, store } = await createApp()

    expect(vm).toBeTruthy()
    expect(router).toBeTruthy()
    expect(store).toBeTruthy()
  })

  it("sets FACTOR_TARGET to app", () => {
    expect(process.env.FACTOR_TARGET).toBe("app")
  })
})
