/// <reference types="Cypress" />
context("Actions", () => {
  beforeEach(() => {
    cy.visit("https://factor.dev")
  })

  it("Test home email input fields", () => {
    cy.get(".add-email:first")
      .find("input")
      .type("fake@email.com")
      .should("have.value", "fake@email.com")

    cy.scrollTo('bottom', { duration: 1000 })

    cy.get(".add-email:last")
      .find("input")
      .type("fake2@email.com")
      .should("have.value", "fake2@email.com")
  })

  it("Test Home Links", () => {
    // quickstart cta button
    cy.get(".interstitial-cta")
      .find(".btn-link")
      .click()

    // Should be on a new URL which includes '/guide/quickstart'
    cy.url().should('include', '/guide/quickstart')

    // back home
    cy.get(".site-brand").find("a").click()

    cy.url().should('include', '/')

    // view quickstart link
    cy.get(".features")
      .eq(0)
      .find(".action a")
      .click()

    // back home
    cy.get(".site-brand").find("a").click()

    // try factor link
    cy.get(".features")
      .eq(1)
      .find(".action a")
      .click()

    //back home
    cy.get(".site-brand").find("a").click()

    // learn more link
    cy.get(".features")
      .eq(2)
      .find(".action a")
      .click()

    //back home
    cy.get(".site-brand").find("a").click()

    // view plugins link
    cy.get("#plugins-feature")
      .find(".action a")
      .click()

    // back home
    cy.get(".site-brand").find("a").click()

    // view themes link
    cy.get(".features.content.last")
      .find(".action a")
      .click()

  })

  it("Getting started links", () => {

    // Switch to mobile
    cy.viewport('iphone-x')

    // desktop head should not be visible
    cy.get('.site-head').should('not.be.visible')

    // open nav
    cy.get(".mobile-toggle").click()

    // introduction link
    cy.get(".menu-root .menu-item")
      .eq(1)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // quickstart link
    cy.get(".menu-root .menu-item")
      .eq(2)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // dashboard setup link
    cy.get(".menu-root .menu-item")
      .eq(3)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // basic example link
    cy.get(".menu-root .menu-item")
      .eq(4)
      .find(".factor-link")
      .click()

  })

  it("App development links", () => {

    // switch to mobile
    cy.viewport('iphone-x')

    // open nav
    cy.get(".mobile-toggle").click()

    // structure link
    cy.get(".menu-root .menu-item")
      .eq(6)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // plugins and themes link
    cy.get(".menu-root .menu-item")
      .eq(7)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // settings and style setup link
    cy.get(".menu-root .menu-item")
      .eq(8)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // posts and pages link
    cy.get(".menu-root .menu-item")
      .eq(9)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // cli link
    cy.get(".menu-root .menu-item")
      .eq(10)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // router and store link
    cy.get(".menu-root .menu-item")
      .eq(11)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // meta info link
    cy.get(".menu-root .menu-item")
      .eq(12)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // working with posts link
    cy.get(".menu-root .menu-item")
      .eq(13)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // endpoints and middleware link
    cy.get(".menu-root .menu-item")
      .eq(14)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // server-side rendering link
    cy.get(".menu-root .menu-item")
      .eq(15)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // deployment link
    cy.get(".menu-root .menu-item")
      .eq(16)
      .find(".factor-link")
      .click()

  })

  it("Extension development links", () => {

    // Switch to mobile
    cy.viewport('iphone-x')

    // open nav
    cy.get(".mobile-toggle").click()

    // creating plugins link
    cy.get(".menu-root .menu-item")
      .eq(18)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // creating themes link
    cy.get(".menu-root .menu-item")
      .eq(19)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // filters, callbacks, and events link
    cy.get(".menu-root .menu-item")
      .eq(20)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // extend the dashboard link
    cy.get(".menu-root .menu-item")
      .eq(21)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // extend the cli link
    cy.get(".menu-root .menu-item")
      .eq(22)
      .find(".factor-link")
      .click()

  })

  it("Contributing links", () => {

    // Switch to mobile
    cy.viewport('iphone-x')

    // open nav
    cy.get(".mobile-toggle").click()

    // contribution link
    cy.get(".menu-root .menu-item")
      .eq(24)
      .find(".factor-link")
      .click()

    // open nav
    cy.get(".mobile-toggle").click()

    // philosophy link
    cy.get(".menu-root .menu-item")
      .eq(25)
      .find(".factor-link")
      .click()

    // end with visuals with desktop view
    cy.viewport('macbook-15')

  })

})