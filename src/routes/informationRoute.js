const express = require('express');
const InformationController = require('../controller/informationController')
const router = express.Router()

const informationController = new InformationController();
router.get('/banner', informationController.banner)
router.get('/service', informationController.service)

module.exports = router;