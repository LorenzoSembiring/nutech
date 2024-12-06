const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

const UserController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const userController = new UserController();
router.get("/profile", upload.none(), userController.profile);
router.put("/profile/update", upload.none(), authMiddleware, userController.update);
router.post("/profile/image", upload.single("file"), authMiddleware, userController.picture);

module.exports = router;
