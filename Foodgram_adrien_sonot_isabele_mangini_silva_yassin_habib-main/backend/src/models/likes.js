const Sequelize = require('sequelize')
const db = require('./database.js')
const likes = db.define('likes', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  // Identifiant utilisateur
  user_id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    unique: 'unique_likes'
  },
  recipe_id: {
    allowNull: false,
    type: Sequelize.INTEGER,
    unique: 'unique_likes'
  },
  
}, { timestamps: false })


const users = require('./users.js');
const posts = require('./posts.js');

// likes.belongsTo(users, {foreignKey: "user_id"});
// likes.belongsTo(posts, {foreignKey: "recipe_id"});


module.exports = likes