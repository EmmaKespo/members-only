// routes/messageRouter.js
const { Router } = require('express');
const messageController = require('../controllers/messageController');
const messageRouter = Router();

messageRouter.get('/', messageController.indexGet);

messageRouter.get('/new-message', messageController.createMessageGet);
messageRouter.post('/new-message', messageController.createMessagePost);

messageRouter.post('/message/:id/delete', messageController.deleteMessagePost);

module.exports = messageRouter;
