
const db = require('../db/queries');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

// Sanitation and validation chains targeting the sign-up submission fields
const validateSignUp = [
  body('first_name').trim().notEmpty().withMessage('First name is required.').escape(),
  body('last_name').trim().notEmpty().withMessage('Last name is required.').escape(),
  body('username').trim().isEmail().withMessage('Username must be a valid email address.').escape(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match the password.');
    }
    return true;
  })
];

exports.signUpGet = (req, res) => res.render('sign-up', { errors: null });

exports.signUpPost = [
  ...validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('sign-up', { errors: errors.array() });
    }

    try {
      // Securely hash raw passwords using 10 salt rounds before database insertion
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      // Map check box "on" state to a explicit database boolean value
      const isAdmin = req.body.is_admin === 'on';

      await db.createUser(
        req.body.first_name, 
        req.body.last_name, 
        req.body.username, 
        hashedPassword,
        isAdmin
      );
      
      res.redirect('/login');
    } catch (err) {
      return next(err);
    }
  }
];

exports.loginGet = (req, res) => res.render('login');

// Invoke Passport's local state verification handling strategies
exports.loginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
});

exports.logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

exports.joinClubGet = (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('join-club', { error: null });
};

exports.joinClubPost = async (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  
  const SECRET_PASSCODE = 'opensesame'; 
  
  if (req.body.passcode === SECRET_PASSCODE) {
    try {
      await db.updateUserMembership(req.user.id);
      res.redirect('/');
    } catch (err) {
      return next(err);
    }
  } else {
    res.render('join-club', { error: 'Incorrect club passcode, try again!' });
  }
};
