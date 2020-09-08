const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const Session = require('../models/Session');

const mapErrors = (errors = {}) => Object.keys(errors).reduce((acc, key) => {
  acc[key] = errors[key].properties.message;
  return acc;
}, {});

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;
  const verificationToken = uuid();

  try {
    const user = new User({
      email,
      displayName,
      verificationToken,
    });

    await user.setPassword(password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: { token: verificationToken },
      to: user.email,
      subject: 'Подтвердите почту',
    });

    ctx.body = { status: 'ok' };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { errors: mapErrors(err.errors) };
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  await user.set('verificationToken', undefined);
  await user.save();

  const token = uuid();
  await Session.create({token, user, lastVisit: new Date()});
  ctx.body = { token };
};
