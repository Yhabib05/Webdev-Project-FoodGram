const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const post = require('../controllers/post.js')

router.get('/ownrecipes', post.getUserRecipes)
router.get('/home', post.getHomeRecipes)
router.delete('/deleterecipe', post.deleteRecipe)
// Envoyer l'image de la recette

router.post('/recipe', post.newRecipe)

router.post('/picture',post.postPicture)

router.post('/like', post.addLike)
router.post('/unlike', post.removeLike)




module.exports = router
