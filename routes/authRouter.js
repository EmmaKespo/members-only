
const { Router } = require('express');
const authController = require('../controllers/authController');
const authRouter = Router();

authRouter.get('/sign-up', authController.signUpGet);
authRouter.post('/sign-up', authController.signUpPost);

authRouter.get('/login', authController.loginGet);
authRouter.post('/login', authController.loginPost);

authRouter.get('/logout', authController.logoutGet);

authRouter.get('/join-club', authController.joinClubGet);
authRouter.post('/join-club', authController.joinClubPost);

module.exports = authRouter;
