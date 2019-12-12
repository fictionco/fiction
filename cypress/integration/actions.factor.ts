/// <reference types="Cypress" />
context("Actions", () => {
  beforeEach(() => {
    cy.visit("https://factor.dev")
  })

  it("Sign Up, logout and login", () => {
    // click sign in link
    cy.get(".primary-nav")
      .find("a:last")
      .click()

    // click sign up link
    cy.get('a[data-test="link-register"]').click()

    // enter name
    cy.get('input[data-test="signin-name"]').type("Ben Testing")

    // enter email
    cy.get('input[data-test="signin-email"]').type("newuser6@email.com")

    // enter password
    cy.get('input[data-test="signin-password"]').type("Password123!")

    // sign up and login
    cy.get('[data-test="submit-login"]').click()

    // go to account nav items
    cy.get('[data-test="account-menu-toggle"]').click()

    // go to account settings
    cy.get('[data-test="account-nav-undefined"]').click().pause()

    // go to account nav items
    cy.get('[data-test="account-menu-toggle"]').click()

    // logout of account
    cy.get('[data-test="account-nav-logout"]').click()

    //cy.wait(1000)

    // Should be on a new URL which includes '/'
    cy.url().should('include', '/')

    // open sign in modal again
    cy.get(".primary-nav")
      .find("a:last")
      .click()

    // sign in with same info - enter email
    cy.get('input[data-test="signin-email"]').type("newuser6@email.com")

    // sign in with same info - enter password
    cy.get('input[data-test="signin-password"]').type("Password123!")

    // sign up and login
    cy.get('[data-test="submit-login"]').click()

  })

})