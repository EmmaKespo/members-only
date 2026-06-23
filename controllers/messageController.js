
const db = require('../db/queries');

exports.indexGet = async (req, res, next) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { messages: messages });
  } catch (err) {
    return next(err);
  }
};

exports.createMessageGet = (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('new-message');
};

exports.createMessagePost = async (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  
  try {
    await db.createMessage(req.user.id, req.body.title, req.body.text);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
};

exports.deleteMessagePost = async (req, res, next) => {
  // Authorization verification gate tracking active admin flag status
  if (!req.user || !req.user.is_admin) {
    return res.status(403).send('Forbidden: Administrative status required.');
  }

  try {
    await db.deleteMessage(req.params.id);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
};
