// import { createTestDbServer } from "@test/utils"

let mongod
describe("post-operations", () => {
  beforeAll(async () => {
    //mongod = await createTestDbServer()
  })

  afterAll(async () => {
    //await mongod.stop()
  })

  it("init", () => {
    expect(2).toBe(2)
  })
})
