const { signup, login, verifyEmail } = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const router = require('express').Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/admin-login', loginValidation, login);

module.exports = router;
