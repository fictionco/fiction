import { beforeAll, describe, expect, it } from "vitest"
import { computed } from "vue"
import { createTestUser } from "../test-utils"
import { FullUser } from "../types"
import { activeUser, setCurrentUser, updateUser } from "../user"

let user: FullUser | undefined = undefined
describe("active user handling", () => {
  beforeAll(async () => {
    const { user: createdUser } = await createTestUser()
    user = createdUser
  })
  it("should set the user to initialized", async () => {
    const computedVar = computed(() => {
      return `id-${activeUser.value?.userId ?? ""}`
    })

    expect(activeUser.value).toBeUndefined()
    expect(computedVar.value).toBe("id-")

    setCurrentUser({ user })

    expect(activeUser.value?.userId).toBe(user?.userId)

    expect(computedVar.value).toBe(`id-${user?.userId}`)
  })

  it("updates user", async () => {
    await updateUser((user: FullUser | undefined) => {
      if (!user) return
      return { ...user, fullName: "test" }
    })
  })
})
