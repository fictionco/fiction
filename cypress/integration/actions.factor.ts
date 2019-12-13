/// <reference types="Cypress" />
context("Actions", () => {
  beforeEach(() => {
    cy.visit("https://factor.dev")
  })

  it('Register, logout and login', () => {

    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
    let string = ''
    for (let ii = 0; ii < 15; ii++) {
      string += chars[Math.floor(Math.random() * chars.length)]
    }

    const user = {
      name: 'Ben Testing',
      email: 'test' + string + '@email.com',
      password: 'Password123!'
    }

    // click sign in link
    cy.get(".primary-nav")
      .find("a:last")
      .click()

    // click sign up link
    cy.get('a[data-test="link-register"]').click()

    // enter name
    cy.get('input[data-test="signin-name"]').type(user.name)

    // enter email
    cy.get('input[data-test="signin-email"]').type(user.email)

    // enter password
    cy.get('input[data-test="signin-password"]').type(user.password)

    // sign up and login
    cy.get('[data-test="submit-login"]').click()

    // go to account nav items
    cy.get('[data-test="account-menu-toggle"]').click()

    // logout of account
    cy.get('[data-test="account-nav-logout"]').click()

    // open sign in modal again
    cy.get(".primary-nav").find("a:last").click()

    // sign in with same info - enter email
    cy.get('input[data-test="signin-email"]').type(user.email)

    // sign in with same info - enter password
    cy.get('input[data-test="signin-password"]').type(user.password)

    // sign up and login
    cy.get('[data-test="submit-login"]').click()

    // expect user from server to match user from test
    // cy.getUser(user.name)
    // .then((dbUser) => expect(dbUser).to.deep.eql(user))
  })

})