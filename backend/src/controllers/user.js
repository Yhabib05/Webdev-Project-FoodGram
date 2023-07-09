const status = require('http-status')
const userModel = require('../models/users.js')
const likeModel = require('../models/likes.js')
const postModel = require('../models/posts.js')
const adminModel = require('../models/admins.js')
const CodeError = require('../util/CodeError.js')



const jws = require('jws')
// require('mandatoryenv').load(['TOKENSECRET'])
const TOKENSECRET = "phelma"

async function verifyToken(req) {
  const token = req.header("token");
  if (!token) throw new CodeError('Cette requête ne contient pas de token!', status.BAD_REQUEST);
  // Vérification de la validité do token
  if (!jws.verify(token, "HS256", TOKENSECRET)) throw new CodeError('Token invalide', status.BAD_REQUEST);
  const UserEmail = jws.decode(token).payload;
  // Vérification de l'existence du login dans la base de données
  const userData = await userModel.findOne({ where: { email: UserEmail }, attributes: ['id', 'name'] });
  console.log(userData);
  if (userData) {
    const utilisateur = { "name": userData.name, "id": userData.id }; // renvoie un objet avec le nom et id utilisateur
    return utilisateur;
  }
  else { // Si l'utilisateur existe déjà, on envoie une erreur NOT_MODIFIED
    throw new CodeError('L\'Utilisateur existe pas!', status.NOT_FOUND);
  }
}

module.exports = {
  verifyToken,
  async login(req, res) {
    console.log("login called");
    const userData = req.body;
    console.log("test0");
    if (!userData) {
      throw new CodeError("NO DATA", status.NO_CONTENT);
    }
    console.log("test");

    console.log(userData.password);

    const passhash = jws.sign({ header: { alg: 'HS256' }, payload: userData.password, secret: TOKENSECRET })
    const data = await userModel.findOne({ where: { email: userData.email, passhash: passhash } });
    // On veut vérifier si l'utilisateur existe bien dans la base de données
    if (!data) throw new CodeError('Utilisateur ou mdp incorrect', status.NOT_FOUND)
    console.log("USER FOUND!")
    const token = jws.sign({ header: { alg: 'HS256' }, payload: userData.email, secret: TOKENSECRET }); // On génère le token à partir du login utilisateur
    // let response =  JSON.stringify({"token:": token})
    // console.log(response);
    res.status(200).json({ status: true, "token": token }); // On renvoie le token en réponse
  },

  async signup(req, res) {
    console.log('signup')
    const userData = req.body;//reaemail password and a name
    /* Vérification des champs */
    if (!userData.email) throw new CodeError("e-mail  missing", status.BAD_REQUEST);
    if (!userData.name) throw new CodeError("username missing", status.BAD_REQUEST);
    if (!userData.password) throw new CodeError("password missing", status.BAD_REQUEST);
    const data = await userModel.findOne({ where: { email: userData.email } })
    if (data) throw new CodeError("Utilisateur déjà existant!", status.NOT_MODIFIED);
    const passhash = jws.sign({ header: { alg: 'HS256' }, payload: userData.password, secret: TOKENSECRET })
    return userModel.create(({
      name: userData.name,
      email: userData.email,
      passhash: passhash,
    }))

      .then(() => {
        res.status(200).json({ status: true, message: "Utilisateur ajouté" });
      })
      .catch(error => res.status(status.BAD_REQUEST).json({ status: true, message: error.message }));

  },

  async userinfo(req, res) {

    const token = req.headers.authorization;
    if (!token) throw new CodeError('No token provided', status.UNAUTHORIZED);
    const decoded = jws.decode(token);
    if (!decoded) throw new CodeError('Invalid token', status.UNAUTHORIZED);
    const user = await userModel.findOne({ where: { email: decoded.payload } });
    if (!user) throw new CodeError('Utilisateur non trouvé', status.NOT_FOUND);
    res.status(200).json({ status: true, user });

  },

  async edituserinfo(req, res) {

    // const token = req.headers.authorization;
    // if(!token) throw new CodeError('No token provided', status.UNAUTHORIZED);
    // const decoded = jws.decode(token);
    // if(!decoded) throw new CodeError('Invalid token', status.UNAUTHORIZED);
    // const user = await userModel.findOne({ where: { email: decoded.payload } });
    // if (!user) throw new CodeError('Utilisateur non trouvé', status.NOT_FOUND);
    const user = await verifyToken(req);

    const updatedData = req.body;

    // Validate input data
    if (!updatedData.name && !updatedData.email) {
      throw new CodeError('Missing updated user information', status.BAD_REQUEST);
    }

    if (updatedData.email && updatedData.email !== user.email) {
      const data = await userModel.findOne({ where: { email: updatedData.email } });
      if (data) throw new CodeError('Email already exists', status.BAD_REQUEST);
      user.email = updatedData.email;
    }

    if (updatedData.name) {
      user.name = updatedData.name;
    }

    // Update user in database
    await user.save();

    res.status(200).json({ status: true, message: "Utilisateur mis à jour" });
  },

  async editPassword(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CodeError('Missing email or password', status.BAD_REQUEST);
    }
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      throw new CodeError('Utilisateur non trouvé', status.NOT_FOUND);
    }
    const oldPassword = user.passhash;
    if (!oldPassword) {
      throw new CodeError('Utilisateur non trouvé', status.NOT_FOUND);
    }
    const passhash = jws.sign({
      header: { alg: 'HS256' },
      payload: password,
      secret: TOKENSECRET
    });
    if (passhash === oldPassword) {
      throw new CodeError('Le mdp doit être différent du précédent', status.NOT_MODIFIED);
    }

    await userModel.update({ passhash }, { where: { email } });

    res.json({ status: true, message: 'Mdp modifié' });
  },

  async getUserLikes(req, res) {
    console.log("get likes");
    const utilisateur = await verifyToken(req);
    // const likes = await likeModel.findAll({ where: { user_id: utilisateur.id }});
    const likes = await likeModel.findAll({
      include: [
        {
          model: postModel,
          // attributes: ['title', 'id', 'like_count'],
        },
        {
          model: userModel,
          attributes: ['name'],
        }
      ], where: { user_id: utilisateur.id }, raw: true,
    })
    return res.status(200).json({ status: true, message: 'Likes', data: likes });

  },

  async deleteUser(req, res) {
    console.log("/!\ Delete user");
    const utilisateur = await verifyToken(req);
    const admin = await adminModel.findOne({ where: { user_id: utilisateur.id }, raw: true });
    if (!admin) throw new CodeError("Unauthorized", status.FORBIDDEN);
    await userModel.destroy({ where: { id: req.id } })
    return res.status(200).json({ status: true, message: 'User deleted' });

  },

  async getUsers(req, res) {
    console.log("Getting users");
    const utilisateur = await verifyToken(req);
    console.log(utilisateur.id);
    const admin = await adminModel.findOne({ where: { user_id: utilisateur.id }, raw: true });
    console.log(admin);
    if (!admin) throw new CodeError("Unauthorized", status.FORBIDDEN);
    const users = await userModel.findAll({ attributes: ['id', 'name'] })
    return res.status(200).json({ status: true, message: 'Users list', users });
  },

  async getAdmins(req, res) {
    console.log("Getting users");
    const utilisateur = await verifyToken(req);
    console.log(utilisateur.id);
    const admin = await adminModel.findOne({ where: { user_id: utilisateur.id }, raw: true });
    console.log(admin);
    if (!admin) throw new CodeError("Unauthorized", status.FORBIDDEN);
    const users = await adminModel.findAll({
      include: [
        {
          model: userModel,
          attributes: ['name', 'email'],
        },
      ], where: {}, raw: true,
    })
    return res.status(200).json({ status: true, message: 'Users list', users });
  },

  async giveAdminPrivileges(req, res) {
    console.log("Promoting user as admin");
    // Authentification
    const utilisateur = await verifyToken(req);
    console.log(utilisateur.id);
    // Vérification des privilèges
    const admin = await adminModel.findOne({ where: { user_id: utilisateur.id }, raw: true });
    console.log(admin);
    if (!admin) throw new CodeError("Unauthorized", status.FORBIDDEN);
    // Vérification de l'existe de l'user
    const user = await userModel.findOne({ where: { id: req.id }, attributes: ['id', 'name'] })
    if(!user) throw new CodeError("User does not exists", status.NOT_FOUND);
    console.log("USER:====")
    console.log(user);
    console.log(req.id);
    await adminModel.create(({ user_id: req.id }));
    return res.status(200).json({ status: true, message: 'User' + user.name + 'is set as admin' });
  },

  async removeAdminPrivileges(req, res) {
    console.log("Promoting user as admin");
    // Authentification
    const utilisateur = await verifyToken(req);
    console.log(utilisateur.id);
    // Vérification des privilèges
    const admin = await adminModel.findOne({ where: { user_id: utilisateur.id }, raw: true });
    console.log(admin);
    if (!admin) throw new CodeError("Unauthorized", status.FORBIDDEN);
    // Vérification de l'existe de l'user
    const user = await userModel.findOne({ where: { id: req.id }, attributes: ['id', 'name'] })
    if(!user) throw new CodeError("User does not exists", status.NOT_FOUND);
    console.log("USER:====")
    console.log(user);
    console.log(req.id);
    await adminModel.destroy(({where: { user_id: req.id }}));
    return res.status(200).json({ status: true, message: 'User' + user.name + 'is set as admin' });
  },

}