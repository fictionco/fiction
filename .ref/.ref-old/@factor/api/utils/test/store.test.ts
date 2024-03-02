import { describe, it, expect } from "../../testUtils"
import { vue } from "../libraries"
import { storeItem, stored } from "../store"

describe("store", () => {
  it("stores and gets items", () => {
    storeItem("ping", "pong")

    const storedItem = stored("ping")

    expect(storedItem).toBe("pong")
  })

  it("removes items", () => {
    storeItem("ping", undefined)

    const storedItem = stored("ping")

    expect(storedItem).toBeUndefined()
  })

  it("is reactive", () => {
    const computedVar = vue.computed(() => {
      return stored("socrates")
    })

    expect(computedVar.value).toBeUndefined()

    storeItem("socrates", "knowledge")

    expect(computedVar.value).toBe("knowledge")
  })

  it("works with writable computed", () => {
    const anotherVar = vue.computed({
      get: () => {
        return stored("plato")
      },
      set: (v) => {
        storeItem("plato", v)
      },
    })

    const yetAnother = vue.computed(() => {
      return anotherVar.value
    })

    expect(yetAnother.value).toBeUndefined()

    anotherVar.value = "wisdom"

    expect(yetAnother.value).toBe("wisdom")
  })
})
