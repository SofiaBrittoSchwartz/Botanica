const express = require('express');
const { registerUser, loginUser } = require("../controllers/userController");
const { getCurrentUser } = require("../controllers/userController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

router.get('/auth/me', verifyToken, getCurrentUser);

module.exports = router;