/// <reference types="Cypress" />

context("Viewport", () => {
  beforeEach(() => {
    cy.visit("https://factor.dev")
  })

  it("Desktop and Mobile viewport tests", () => {
    // Switch to mobile
    cy.viewport("iphone-x")

    // the .site-head and .primary-nav should have collapsed since our screen is smaller
    cy.get(".site-head").should("not.be.visible")
    cy.get('[data-text="signin-link"]').should("not.be.visible")
    // mobile toggle should be visible
    cy.get(".mobile-toggle")
      .should("be.visible")
      .click()

    // mobile sidebar should be visible since toggle was clicked
    cy.get(".mobile-sidebar").should("be.visible")

    // mobile links should be visible when .mobile-sidebar is open
    cy.get(".menu-root")
      .find("a")
      .should("be.visible")

    // View app in super large screen
    cy.viewport(2999, 2999)

    // back to mobile
    cy.viewport(320, 480)

    // close nav
    cy.get(".mobile-sidebar-canvas")
      .find(".closer")
      .click()
  })
})
