const app = require('../app')
const request = require('supertest')

// TEST1

// get user info
describe('GET /userinfo', () => {
  test('Test if get user info works with initialized table user', async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
    const response = await request(app)
      .get('/userinfo')
      .set('authorization', token);

    expect(response.statusCode).toBe(200);
    expect(response.body.user.id).toBe(1);
    expect(response.body.user.email).toBe("Sebastien.Viardot@grenoble-inp.fr");
    expect(response.body.user.name).toBe("sebastien viardot");
    expect(response.body.user.passhash).toBe("eyJhbGciOiJIUzI1NiJ9.MTIzNDU2.D0ZLqnFjBg8D2rYotIVFFNGnGrd69aHMWB168dwcK5s");
  });
});

// TEST2


//post a new user
describe('POST /signup', function() {
  it('Test post a new user to the database', async () => {
    request(app)
      .post('/signup')
      .send( {name: 'john',email: 'kenaa@example.com', passhash: '1234'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        id: expect.any(Number),
        name: 'john',
        email:'kenaa@example.com',
        passhash:'1234'
      },);
  });
});

// TEST3

//login a user
describe('POST /login', function() {
  it('Test login of a user to the app', async () => {
    request(app)
      .post('/login')
      .send( {
        "email": "Sebastien.Viardot@grenoble-inp.fr",
        "password": "123456"
        })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        token:'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c'
      });
  });
});


// TEST4

//changing the password of a user
describe('PUT /changepass', () => {
  test('Test if edit user info works with initialized table user', async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
    const response = await request(app)
    .put('/changepass')
    .set('authorization', token)
    .send( {
      "email": "Sebastien.Viardot@grenoble-inp.fr",
      "password": "159753"
    })

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Mdp modifié');
  });
});

//TEST5

//getting the recipes in the home screen
describe('GET /home', () => {
  test('Test if getting recipees works with initialized table user', async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
    const response = await request(app)
    .get('/home')
    .set( 'token',token)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Home recipes');
  });
});
//TEST6

//getting a user's recipes
describe('GET /ownrecipes', () => {
  test('Test if getting a user own recipees works with initialized table user', async () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
    const response = await request(app)
    .get('/ownrecipes')
    .set( 'token',token)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('User recipes');
  });
});

//TEST7

//add like
describe('POST /like', function() {
  it('Test the like of a recipe ', async () => {
    request(app)
      const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
      const response = await request(app)
      .post('/like')
      .set( 'token',token)
      .send( {
        "id":1
      })

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Recipe liked');
  });
});

//TEST8

//unlike
describe('POST /unlike', function() {
  it('Test the unlike of a recipe ', async () => {
    request(app)
      const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
      const response = await request(app)
      .post('/unlike')
      .set( 'token',token)
      .send( {
        "id":1
      })

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Recipe unliked');
  });
});



// TEST9

//editing a user info
describe('PUT /edituserinfo', () => {
  test('Test if edit user info works with initialized table user', async () => {
    request(app)
      const token = 'eyJhbGciOiJIUzI1NiJ9.U2ViYXN0aWVuLlZpYXJkb3RAZ3Jlbm9ibGUtaW5wLmZy.Fz7IOGUhIArcY8v1_cfTQc-kzMh2BvqWTQHDF3u949c';
      const response = await request(app)
      .put('/edituserinfo')
      .set('authorization', token)
      .send( {
        "name": "yassin",
        "email": "yassin@example.com"
      })

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Utilisateur mis à jour');
  });
});