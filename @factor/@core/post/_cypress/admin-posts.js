describe("Posts Admin", () => {
  before(() => {
    cy.visit("/admin/posts")

    cy.FictionApp(async Vue => {
      return await Vue.$user.removeAuth()
    })
  })

  it("Prevents viewing page unless authenticated as admin.", () => {
    cy._el("signin").should("exist")
  })

  it("Login and Redirect", () => {
    cy._el("signin-email")
      .click()
      .type("test@fiction.com")
    cy._el("signin-password")
      .click()
      .type("1231231231")

    cy._el("submit-login").click()

    cy._el("app-nav-posts").should("exist")
  })

  it("Navigates Correctly", () => {
    cy._el("app-nav-posts").click()
    cy._el("app-subnav-page").click()
    cy._el("add-post").click()
  })

  it("Adds a new page", () => {})

  it("Validates Permalink", () => {})
})
