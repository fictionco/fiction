import { beforeAll, describe, expect, it } from "vitest"
import { computed } from "vue"
import { createTestUtils, TestUtils } from "../test-utils"
import { FullUser } from "../plugin-user"

let testUtils: TestUtils | undefined = undefined
describe("active user handling", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()
  })
  it("should set the user to initialized", async () => {
    if (!testUtils) throw new Error("testUtils not defined")
    testUtils.factorUser.setCurrentUser({ user: undefined })
    const computedVar = computed(() => {
      return `id-${testUtils?.factorUser.activeUser.value?.userId ?? ""}`
    })

    expect(testUtils.factorUser.activeUser.value).toBeUndefined()
    expect(computedVar.value).toBe("id-")

    testUtils.factorUser.setCurrentUser({ user: testUtils.user })

    expect(testUtils.factorUser.activeUser.value?.userId).toBe(
      testUtils.user?.userId,
    )

    expect(computedVar.value).toBe(`id-${testUtils?.user?.userId}`)
  })

  it("updates user", async () => {
    await testUtils?.factorUser?.updateUser((user: FullUser | undefined) => {
      if (!user) return
      return { ...user, fullName: "test" }
    })
  })
})
