const { v4: uuidv4 } = require('uuid');
const status = require('http-status')
const userModel = require('../models/users.js')
const postModel = require('../models/posts.js')
const likeModel = require('../models/likes.js')
const adminModel = require('../models/admins.js')
const CodeError = require('../util/CodeError.js')
const user = require('../controllers/user.js')

const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const db = require('../models/database.js');
// const BACKEND="http://127.0.0.1:3000";
const BACKEND = "https://foodgram.osc-fr1.scalingo.io";


const jws = require('jws')
const { TOKENSECRET } = "phelma"

module.exports = {
  /* Get all the recipes from the user */
  async getUserRecipes(req, res) {
    const utilisateur = await user.verifyToken(req);
    // Finding user
    const userId = utilisateur.id;
    console.log(userId);
    if (!userId) throw new CodeError("User does not exists", status.NOT_FOUND);
    // Finding recipes
    const data = await postModel.findAll({ where: { user_id: userId }, });
    res.json({ status: true, message: 'User recipes', data });
  },

  /* Show the recipes on the home page according to date, popularity... */
  /* V1.0: show recipes without order */
  async getHomeRecipes(req, res) {
    const utilisateur = await user.verifyToken(req);
    // Finding user
    const userId = utilisateur.id;
    console.log(userId);
    if (!userId) throw new CodeError("User does not exists", status.NOT_FOUND);
    // Finding recipes, making a join between the tables on the user_id to get the user_name (author of recipe)
    const data = await postModel.findAll({
      include: [
        {
          model: userModel,
          attributes: ['name'], // Pour récupérer l'auteur de la recette
        },
      ], raw: true,
    })
    res.status(200).json({ status: true, message: 'Home recipes', data });
  },

  async newRecipe(req, res) {
    console.log("new recipe called");
    const utilisateur = await user.verifyToken(req);
    console.log(utilisateur.id);
    //if(utilisateur.name !== req.params.user) throw new CodeError('Le token utilisateur ne correspond pas au nom donné en url', status.BAD_REQUEST);
    // Ajout du tag dans la base de données
    await postModel.create({
      "user_id": utilisateur.id, "title": req.body.title,
      "description": req.body.description, "category": req.body.category,
      "difficulty": req.body.difficulty, "picture": req.body.picture,
      "like_count": 0
    });
    res.json({ status: true, message: 'Recipe added' });

  },



  async postPicture(req, res) {
    // Multer : middleware pour la réception de fichier
    const storage = multer.memoryStorage();
    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 10 // 10MB, anyways the picture's size will be reduced
      },
      // fileFilter: function(req, file, callback) {
      //   if (file.fieldname !== 'file') {
      //     return callback(new Error('Unexpected field'));
      //   }
      //   callback(null, true);
      // }
    }).single('file');

    console.log("post image");
    const utilisateur = await user.verifyToken(req);
    if (!utilisateur) throw new CodeError("Not authentified", status.UNAUTHORIZED)
    // TODO: vérifier si l'extension est bonne, vérifier la taille...
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(500).json(err);
      }
      // console.log(req.body); // access form data
      console.log("req file, should not be null:")
      console.log(req.file); // access uploaded file -> null means error!
      const ext = path.extname(req.file.originalname);
      const fileName = uuidv4() + ext;
      // On resize l'image pour gagner en performance et bande passante
      sharp(req.file.buffer)
        .resize(500, 300)
        .toFile('src/pictures/' + fileName);

      res.status(200).json({ status: true, message: 'Picture sent', data: fileName });
    });
  },

  async addLike(req, res) {
    console.log("adding like");
    const utilisateur = await user.verifyToken(req);
    if (!utilisateur) throw new CodeError("Erreur", status.BAD_REQUEST);
    const recipeId = req.body.id;
    // L'identifiant de la recette doit être donné dans la requête
    if (!recipeId) throw new CodeError("Recipe id must me provided", status.BAD_REQUEST);
    // On vérifie si la recette existe
    const recipe = await postModel.findOne({ where: { id: recipeId }, raw: true });
    if (!recipe) throw new CodeError("Invalid recipe id", status.NOT_FOUND);
    console.log("RECIPE FOUND!");
    console.log(recipe);
    console.log(recipe.likes);
    // On garantit l'atomicité de l'opération de like pour éviter des bugs
    await db.transaction(async (t) => {
      const like = await likeModel.findOne({ where: { user_id: utilisateur.id, recipe_id: recipeId }, raw: true });
      if (like) throw new CodeError("Recipe was already liked", status.NOT_MODIFIED);
      await likeModel.create({ user_id: utilisateur.id, recipe_id: recipeId, transaction: t });
      await postModel.update({ like_count: recipe.like_count + 1 }, { where: { id: recipeId }, transaction: t })
    });
    return res.status(200).json({ status: true, message: 'Recipe liked' });

  },

  async removeLike(req, res) {
    console.log("remove like");
    const utilisateur = await user.verifyToken(req);
    const recipeId = req.body.id;
    // L'identifiant de la recette doit être donné dans la requête
    if (!recipeId) throw new CodeError("Recipe id must me provided", status.BAD_REQUEST);
    // On vérifie si la recette existe
    const recipe = await postModel.findOne({ where: { id: recipeId } });
    if (!recipe) throw new CodeError("Invalid recipe id", status.NOT_FOUND);
    // await likeModel.destroy({where: { user_id: utilisateur.id, recipe_id: recipeId}});
    // await postModel.update({ like_count: recipe.like_count-1}, { where:{id: recipeId} });

    // On garantit l'atomicité de l'opération de dislike pour éviter des bugs
    await db.transaction(async (t) => {
      const like = await likeModel.findOne({ where: { user_id: utilisateur.id, recipe_id: recipeId }, raw: true });
      if (!like) throw new CodeError("Recipe was not liked in first instance", status.NOT_MODIFIED);
      await likeModel.destroy({ where: { user_id: utilisateur.id, recipe_id: recipeId }, transaction: t });
      await postModel.update({ like_count: db.literal('like_count - 1') }, { where: { id: recipeId }, transaction: t });
    });

    return res.status(200).json({ status: true, message: 'Recipe unliked' });
  },

  async deleteRecipe(req, res) {
    const utilisateur = await user.verifyToken(req);
    if (!utilisateur) throw new CodeError("Erreur", status.BAD_REQUEST);

    // const recipeName = req.body.title;
    // if (!recipeName) throw new CodeError("Recipe name must be provided", status.BAD_REQUEST);
    const recipeId = req.body.id;
    // console.log(recipeId);
    // L'identifiant de la recette doit être donné dans la requête
    if (!recipeId) throw new CodeError("Recipe id must me provided", status.BAD_REQUEST);
    // On vérifie si la recette existe
    const recipe = await postModel.findOne({ where: { id: recipeId }, raw: true });

    // const recipe = await postModel.findOne({ where: { title: recipeName } });
    if (!recipe) throw new CodeError("Invalid recipe id", status.NOT_FOUND);

    // Seul l'auteur peut supprimer sa recette
    if (recipe.user_id !== utilisateur.id) {
      // Si l'utilisateur est admin il est autorisé à supprimer la recette
      const admin = await adminModel.findOne({ where: { user_id: utilisateur.id }, raw: true });
      // console.log(admin);
      if (!admin) {
        throw new CodeError("Unauthorized", status.FORBIDDEN);
      }
      console.log("USER IS ADMIN");
    }
    await postModel.destroy({ where: { id: recipe.id } });
    return res.status(200).json({ status: true, message: 'Recipe deleted' });
  }

}