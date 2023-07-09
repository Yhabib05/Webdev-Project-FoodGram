//Visiting the website

describe('visiting the website', () => {
  beforeEach(() => {
    cy.visit('http://localhost:19006')
  })
  
  
  it('from authentification to recipes ', () => {
    
    //sign in the user
    cy.get('input[placeholder="Email."]').type('Sebastien.Viardot@grenoble-inp.fr').should('have.value', 'Sebastien.Viardot@grenoble-inp.fr')
    cy.get('input[placeholder="Password."]').type('123456').should('have.value', '123456')
    cy.contains('Sign in').click()
    
    //scroll to the bottom of the page
    cy.scrollTo('bottom', {ensureScrollable: false})

    //navigating to the home screen
    cy.get('img[src="/static/media/home.b4a4995cc585981970ce.jpg"]').click()
    cy.get('div.css-text-1rynq56').first().should('exist').click({force: true})

    
    
    //scrolling all the recipes 
    cy.scrollTo('bottom', {ensureScrollable: false})

    //disconnect
     //navigate back to the profile screen 
    cy.get('img[src="/static/media/profile.867d443f2f24f8cde9e6.jpg"]').last().click()
     //clicking on the exit button
    cy.contains('exit').click()
  })

  //sign up
  it('sign up ', () => {
    cy.contains('Pas encore inscrit? Sign Up').click()
    cy.get('input[placeholder="Username."]').type('Yassin Habib').should('have.value', 'Yassin Habib')
    cy.get('input[placeholder="Email."]').last().type('yassin.habib@grenoble-inp.fr')
    cy.get('input[placeholder="Password."]').last().type('123456').should('have.value', '123456')
    cy.contains('Done!').click()
  })

  //forgot password
  it('Forgot password ', () => {
    cy.contains('Un trou de mémoire? Pas de problème').click()
    cy.get('input[placeholder="Email."]').last().type('Isabele.Mangini@grenoble-inp.fr')
    cy.get('input[placeholder="New Password."]').type('123456').should('have.value', '123456')
    cy.contains('Change Password').click()
  })

  // edit user infor 
  // test likes like at least two pics 
  // disconnect  
  // how to test a post ¿¿¿ 

})
