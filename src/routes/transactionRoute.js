const express = require('express');
const multer = require('multer');
const upload = multer()
const TransactionController = require('../controller/transactionController') 
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

const transactionController = new TransactionController();
router.get('/balance', authMiddleware, transactionController.balance)
router.post('/topup', upload.none(), authMiddleware, transactionController.topup)
router.post('/transaction', upload.none(), authMiddleware, transactionController.transaction)
router.get('/transaction/history', upload.none(), authMiddleware, transactionController.history)

module.exports = router;