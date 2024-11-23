const express = require('express');
const multer = require('multer');
const upload = multer()
const UserController = require('../controller/userController') 
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

const userController = new UserController();
router.get('/profile', upload.none(), userController.profile)
router.put('/update', upload.none(), authMiddleware, userController.update)

module.exports = router;