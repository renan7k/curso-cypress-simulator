/// <reference types="cypress" />

describe("Cypress Simulator", () => {

  beforeEach(() => {
    //pulando o capthca adicionando esse parâmetro na url
    //Setando no localStorage o item cookieConsent, para evitar do banner ser exibido
    cy.visit("./src/index.html?skipCaptcha=true", {
      onBeforeLoad(win) {
        win.localStorage.setItem("cookieConsent", "accepted")
      }
    })
    cy.contains("button", "Login").click()
  })

  it("successfully simulates a Cypress command", () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.visit('https://google.com')")
    cy.get("#runButton").click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Success:")
      .and("contain", "cy.visit('https://google.com') // Visited URL 'https://google.com'")
  })

  it('shows an error when entering and running an invalid Cypress command: invalid cypress command', () => {
    cy.get("#codeInput").type("cy.run()")
    cy.get("#runButton").click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Error:")
      .and("contain", "Invalid Cypress command: cy.run()")
  })

  it('shows a warning when entering and running a not-implemented Cypress command', () => {
    cy.get("#codeInput").type("cy.contains('Login')")
    cy.get("#runButton").click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Warning:")
      .and("contain", "The `cy.contains` command has not been implemented yet.")
  })

  it('shows an error when entering and running a valid Cypress command without parentheses', () => {
    cy.get("#codeInput").type("cy.get")
    cy.get("#runButton").click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Error:")
      .and("contain", "Missing parentheses on `cy.get` command")
  })

  it('asks for help and gets common Cypress commands and examples with a link to the docs', () => {
    cy.get("#codeInput").type("help")
    cy.get("#runButton").click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Common Cypress commands and examples:")
      .and("contain", "For more commands and details, visit the official Cypress API documentation.")

    cy.contains("#outputArea a","official Cypress API documentation")
      .should("have.attr", "href", "https://docs.cypress.io/api/table-of-contents")
      .and("have.attr", "target", "_blank")
      .and("be.visible")
  })

  it('maximizes and minimizes a simulation result', () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.visit('https://google.com')")
    cy.get("#runButton").click()
    cy.get('.expand-collapse').click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Success:")
      .and("contain", "cy.visit('https://google.com') // Visited URL 'https://google.com'")

    cy.get("#collapseIcon").should("be.visible")

    cy.get('.expand-collapse').click()
    
    cy.get("#expandIcon").should("be.visible")
  })

  it('logs out successfully', () => {
    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()

    cy.contains("button", "Login").should("be.visible")
    cy.get("#sandwich-menu").should("not.be.visible")
  })

  it('shows and hides the logout button', () => {
    cy.get("#sandwich-menu").click()

    cy.contains("button", "Logout").should("be.visible")

    cy.get("#sandwich-menu").click()

    cy.contains("button", "Logout").should("not.be.visible")
  })

  it('shows the running state before showing the final result', () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.visit('https://google.com')")
    cy.get("#runButton").click()

    cy.contains("button", "Running...").should("be.visible")
    cy.contains("#outputArea", "Running... Please wait.").should("be.visible")

    cy.contains("button", "Running...", {timeout: 6000}).should("not.exist")
    cy.contains("button", "Run").should("be.visible")
    cy.contains("#outputArea", "Running... Please wait.", {timeout: 6000}).should("not.exist")

    cy.get("#outputArea")
      .should("be.visible")
      .and("contain", "Success:")
      .and("contain", "cy.visit('https://google.com') // Visited URL 'https://google.com'")
  })
  it('checks the run button disabled and enabled states', () => {
    cy.contains("button", "Run").should("be.disabled")
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Teste')")

    cy.contains("button", "Run").should("be.enabled")

    cy.get("textarea[placeholder='Write your Cypress code here...']").clear()

    cy.contains("button", "Run").should("be.disabled")
  })

  
  it('clears the code input when logging off then logging in again', () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Teste')")
    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()
    cy.contains("button", "Login").click()

    cy.get("textarea[placeholder='Write your Cypress code here...']").should("have.value", "")

  })

  it('disables the run button when logging off then logging in again', () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Teste')")
    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()
    cy.contains("button", "Login").click()

    cy.contains("button", "Run").should("be.disabled")
  })

  it('clears the code output when logging off then logging in again', () => {
    cy.get("textarea[placeholder='Write your Cypress code here...']").type("cy.log('Teste')")
    cy.contains("button", "Run").click()

    cy.get("#outputArea", {timeout: 6000})
      .should("be.visible")
      .and("contain", "Success:")
      .and("contain", "cy.log('Teste') // Logged message 'Teste'")


    cy.get("#sandwich-menu").click()
    cy.contains("button", "Logout").click()
    cy.contains("button", "Login").click()

    cy.get("#outputArea").should("not.contain", "cy.log('Teste') // Logged message 'Teste'")
  })

  it.only("doesn't show the cookie consent banner on the login page", () => {
    cy.clearAllLocalStorage()
    cy.reload()

    cy.contains("button", "Login").should("be.visible")
    cy.get("#cookieConsent").should("not.be.visible")
  })

})

describe("Cypress Simulator - Cookies consent", () => {
  beforeEach(() => {
    cy.visit("./src/index.html?skipCaptcha=true")
    cy.contains("button", "Login").click()
  })

  it("consents on the cookies usage", () => {
    cy.get('#cookieConsent > .content')
      .as("cookieConsentBanner")
      .find("button:contains('Accept')")
      .click()

    cy.get("@cookieConsentBanner").should("not.be.visible")

    //Comando pegando a janela window, para validar o localStorage
    cy.window()
      .its("localStorage.cookieConsent")
      .should("be.equal", "accepted")
  })

  it("declines on the cookies usage", () => {
    cy.get('#cookieConsent > .content')
      .as("cookieConsentBanner")
      .find("button:contains('Decline')")
      .click()

    cy.get("@cookieConsentBanner").should("not.be.visible")

    //Comando pegando a janela window, para validar o localStorage
    cy.window()
      .its("localStorage.cookieConsent")
      .should("be.equal", "declined")
  })


})

describe("Cypress Simulator - Captcha", () => {
  beforeEach(() => {
    cy.visit("./src/index.html")
    cy.contains("button", "Login").click()
  })
  it("disables the captcha verify button when no answer is provided or it's cleared", () => {
    cy.contains("button", "Verify").should("be.disabled")

    cy.get("input[placeholder='Enter your answer']").type("1")

    cy.contains("button", "Verify").should("be.enabled")

    cy.get("input[placeholder='Enter your answer']").clear()

    cy.contains("button", "Verify").should("be.disabled")
  })

  it("shows an error on a wrong captcha answer and goes back to its initial state", () => {
    cy.get("input[placeholder='Enter your answer']").type("1000")

    cy.contains("button", "Verify").click()
    
    cy.contains(".error", "Incorrect answer, please try again.").should("be.visible")

    cy.get("input[placeholder='Enter your answer']").should("have.value","")
    cy.contains("button", "Verify").should("be.disabled")
    
  })
})