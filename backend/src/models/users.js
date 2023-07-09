const Sequelize = require('sequelize')
const db = require('./database.js')
const posts = require('./posts.js');
const likes = require('./likes.js');
const superUsers = require('./admins.js');
const users = db.define('users', {
  // Identifiant de l'utilisateur
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  // Nom de l'utilisateur
  name: {
    type: Sequelize.STRING(16),
    allowNull: false, // le nom ne doit pas être null
    unique: true, // nom doit être unique
    // validate: {
    //   is: /^[a-z\-'\s]{1,16}$/i
    // }
  },
  email: {
    type: Sequelize.STRING(128),
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passhash: {
    type: Sequelize.STRING(60),
    validate: {
      // is: /^[0-9a-z\\/$.]{60}$/i
    }
  }
}, { timestamps: false })

module.exports = users


users.hasMany(posts, {
  foreignKey: 'user_id'
});

users.hasMany(likes, {
  foreignKey: 'user_id'
});

posts.hasMany(likes, {
  foreignKey: 'recipe_id'
});

users.hasOne(superUsers, {
  foreignKey: 'user_id'
});

posts.belongsTo(users, {foreignKey: "user_id"});
likes.belongsTo(users, {foreignKey: "user_id"});
likes.belongsTo(posts, {foreignKey: "recipe_id"});
superUsers.belongsTo(users, {foreignKey: "user_id"})

