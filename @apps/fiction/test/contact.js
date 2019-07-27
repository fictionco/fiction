describe("Test Contact Us Page and Form", () => {
  before(() => {
    cy.visit("/contact")
  })

  it("Fails without Email", () => {
    cy._el("form-name")
      .click()
      .type("Some Name")

    cy._el("form-submit").click()

    cy._el("contact-form").should("have.class", "invalid")
  })

  it("Fails without Message", () => {
    cy._el("form-email")
      .click()
      .type("andrew@fiction.com")

    cy._el("form-submit").click()

    cy._el("contact-form").should("have.class", "invalid")
  })

  it("Sent form without errors", () => {
    cy._el("form-message")
      .click()
      .type(
        "Lorem ipsum dolor sit amet, consectetur adipisciodo convallis liber"
      )

    cy._el("form-submit").click()

    cy._el("confirm").should("have.length", 1)
  })
})
