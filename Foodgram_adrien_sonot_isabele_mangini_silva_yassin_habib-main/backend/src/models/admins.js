const Sequelize = require('sequelize')
const db = require('./database.js')
const posts = require('./posts.js');
const likes = require('./likes.js');
// Admin role: utilisateur présent dans cette liste est admin
const users = db.define('admins', {
  // Identifiant 
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  // Identifiant de l'utilisateur
  user_id: {
    allowNull: false, 
    type: Sequelize.INTEGER
  },
}, { timestamps: false })

module.exports = users


