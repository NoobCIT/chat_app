var Chat = require('../models/chat');
router.get('/', function(req, res) {
  Chat.find(function(err, chat) {
    if (err) return console.error(err);
    res.render('chat', {title: "Chat App", chat: chat});
  });
});
