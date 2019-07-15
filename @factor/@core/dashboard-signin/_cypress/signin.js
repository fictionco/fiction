describe("Authentication and Sign Up", () => {
  before(() => {
    cy.visit("/")
    Cypress.env("email", "whatever@fiction.com")
    Cypress.env("password", "1231231231")
  })

  beforeEach(() => {})

  it("Attempts Logout", () => {
    cy.FactorApp(async _ => {
      cy.wait(3000)
      cy._el("login").click()
      return await _.$auth.logout()
    })
  })

  // // Fully testing OAuth with google popup is either too much work (or impossible)
  // // So lets just stub it and test that the appropriate function is called
  // it("Attempts Sign In in With Google", () => {
  //   cy.window().then(win => {
  //     win.auth = cy.stub(win.FictionApp.Factor.$auth, "authenticate").as("authenticate")
  //   })

  //   cy.window().should("have.property", "appReady", true)

  //   cy._el("google-button").click()

  //   cy.window().then(win => {
  //     expect(win.auth).to.be.called
  //   })
  // })

  // it("Forgot Password", () => {
  //   cy._el("link-forgot-password").click()

  //   cy._el("input-password-email")
  //     .click()
  //     .type("testing@fiction.com")

  //   cy._el("send-password-email").click()

  //   cy._el("link-back").click()

  //   cy._el("link-register").click()

  //   cy._el("signin-name")
  //     .click()
  //     .type("JRR Tolkien")

  //   cy._el("signin-email")
  //     .clear()
  //     .click()
  //     .type(Cypress.env("email"))

  //   cy._el("signin-password")
  //     .click()
  //     .type(Cypress.env("password"))

  //   cy._el("submit-login").click()

  //   cy.location().should(loc => {
  //     expect(loc.pathname).to.eq("/")
  //   })
  // })

  // it("Logs the user out", () => {
  //   cy.visit("/account")

  //   cy._el("site-nav-menu-toggle").click()
  //   cy._el("nav-menu-logout").click()

  //   cy.location().should(loc => {
  //     expect(loc.pathname).to.eq("/")
  //   })

  //   cy.get(".fi-app").should("have.class", "logged-out")

  //   cy.window().then(win => {
  //     expect(win.Fiction.Vue.$user.get()).to.be.empty
  //   })
  // })

  // it("Sign In with Redirect", () => {
  //   cy.visit("/account")

  //   // Redirect because logged out
  //   cy.location().should(loc => {
  //     expect(loc.pathname).to.eq("/signin")
  //   })

  //   cy._el("signin-email")
  //     .clear()
  //     .click()
  //     .type(Cypress.env("email"))

  //   cy._el("signin-password")
  //     .click()
  //     .type(Cypress.env("password"))

  //   cy._el("submit-login").click()

  //   // Redirect to original page
  //   cy.location().should(loc => {
  //     expect(loc.pathname).to.eq("/account")
  //   })

  //   cy.log("Waiting to Logout")
  //   cy.wait(2000)

  //   cy.window().then(win => {
  //     win.Fiction.Vue.$hook.$emit("logout")
  //     expect(win.Fiction.Vue.$user.get()).to.be.empty
  //   })

  //   // Redirect to original page
  //   cy.location().should(loc => {
  //     expect(loc.pathname).to.eq("/")
  //   })
  // })

  // it("Sign In with Modal", () => {
  //   cy.FictionApp(Vue => {
  //     Vue.$hook.$emit("signinModal")
  //   })

  //   cy._el("signin-email")
  //     .clear()
  //     .click()
  //     .type(Cypress.env("email"))

  //   cy._el("signin-password")
  //     .click()
  //     .type(Cypress.env("password"))

  //   cy._el("submit-login").click()

  //   cy.get(".fi-app").should("have.class", "logged-in")

  //   cy.window().then(win => {
  //     expect(win.Fiction.Vue.$user.get()).to.not.be.empty
  //   })
  // })
})
