/// <reference types="Cypress" />

context('Viewport', () => {
  beforeEach(() => {
    cy.visit('https://factor.dev')
  })

  it('Viewport tests', () => {

    // Switch to mobile
    cy.viewport('iphone-x')

    // the .site-head and .primary-nav should have collapsed since our screen is smaller
    cy.get('.site-head').should('not.be.visible')
    cy.get('.primary-nav').should('not.be.visible')

    // mobile toggle should be visible 
    cy.get(".mobile-toggle").should('be.visible').click()

    // mobile sidebar should be visible since toggle was clicked 
    cy.get('.mobile-sidebar').should('be.visible')

    // mobile links should be visible when .mobile-sidebar is open
    cy.get('.menu-root').find('a').should('be.visible')

    cy.viewport(320, 480)

    // View app in super large screen
    cy.viewport(2999, 2999).pause()

    // cy.get('.navbar-toggle').should('be.visible').click()
    // 

    // // lets see what our app looks like on a super large screen
    // 

    // cy.viewport() accepts a set of preset sizes
    // to easily set the screen to a device's width and height

    // We added a cy.wait() between each viewport change so you can see
    // the change otherwise it is a little too fast to see :)

    cy.viewport('macbook-15')
    cy.wait(200)
    cy.viewport('macbook-13')
    cy.wait(200)
    cy.viewport('macbook-11')
    cy.wait(200)
    cy.viewport('ipad-2')

    //wait for mobile nav items to load
    cy.wait(1000)

    cy.viewport('ipad-mini')
    cy.wait(200)
    cy.viewport('iphone-6+')
    cy.wait(200)
    cy.viewport('iphone-6')
    cy.wait(200)
    cy.viewport('iphone-5')
    cy.wait(200)
    cy.viewport('iphone-4')
    cy.wait(200)
    cy.viewport('iphone-3')
    cy.wait(200)

    // cy.viewport() accepts an orientation for all presets
    // the default orientation is 'portrait'
    cy.viewport('ipad-2', 'portrait')
    cy.wait(200)
    cy.viewport('iphone-4', 'landscape')
    cy.wait(200)

    // close nav
    cy.get(".mobile-sidebar-canvas")
      .find(".closer")
      .click()

  })
})
