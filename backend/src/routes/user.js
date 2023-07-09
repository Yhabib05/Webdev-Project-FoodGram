const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')
const post = require('../controllers/post.js')

router.post('/login', user.login) 
router.post('/signup', user.signup)
router.get('/userinfo', user.userinfo) 
router.put('/edituserinfo', user.edituserinfo) 
router.put('/changepass', user.editPassword) 
router.put('/edituserinfo', user.edituserinfo)
router.get('/likes', user.getUserLikes)

// ADMIN PRIVILEGES
router.delete('/user', user.deleteUser)
router.get('/users', user.getUsers)
router.get('/admins', user.getAdmins)
router.post('/admin', user.giveAdminPrivileges)
router.delete('/admin', user.removeAdminPrivileges)

module.exports = router
