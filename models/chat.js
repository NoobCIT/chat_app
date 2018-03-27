var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChatSchema = new Schema({
  name: {type: 'String', required: true},
  message: {type: 'String', required: true}
});
var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;
