/// <reference types="Cypress" />
context("Actions", () => {
  beforeEach(() => {
    cy.visit("https://factor.dev")
  })

  it("Types email", () => {
    cy.get(".add-email:first")
      .find("input")
      .type("fake@email.com")
      .should("have.value", "fake@email.com")
  })
})
