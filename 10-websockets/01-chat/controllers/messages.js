const Message = require('../models/Message');

const mapMessage = message => ({
  date: message.date,
  id: message._id,
  text: message.text,
  user: message.user,
});

module.exports.messageList = async function messages(ctx, next) {
  const { user } = ctx;

  if (!user) {
    ctx.throw(401, 'Пользователь не залогинен');
  }

  const messages = await Message.find({ chat: user._id });

  if (!messages) {
    ctx.body = { messages: [] };
  }

  ctx.body = { messages: messages.slice(-20).map(mapMessage) };
};
