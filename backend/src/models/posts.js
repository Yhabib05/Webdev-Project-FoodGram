const Sequelize = require('sequelize');
const db = require('./database.js');
const users = require('./users.js');

const posts = db.define('posts', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  user_id: {
    allowNull: false, 
    type: Sequelize.INTEGER
  },
  title: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  description: {
    type: Sequelize.TEXT({ length : 'medium' }) ,
    allowNull: false
  },
  category:{
    type: Sequelize.STRING(16),
    allowNull: false
  },
  difficulty: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: false
  },
  like_count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});


// posts.belongsTo(users, {foreignKey: "user_id"});

const likes= require('./likes.js');

// posts.hasMany(likes, {
//   foreignKey: 'recipe_id'
// });

module.exports = posts;
