const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

const mapErrors = (errors = {}) => Object.keys(errors).reduce((acc, key) => {
  acc[key] = errors[key].properties.message;
  return acc;
}, {});

module.exports.checkout = async function checkout(ctx, next) {
  const { product, phone, address } = ctx.request.body;
  const { user } = ctx;

  if (!user) {
    ctx.throw(401, 'Необходимо авторизоваться.');
  }

  try {
    const order = await Order.create({ user, product, phone, address });

    await sendMail({
      template: 'order-confirmation',
      locals: { id: user._id, product },
      to: user.email,
      subject: 'Подтвердите почту',
    });

    ctx.body = { order: order._id };
  } catch (err) {
    ctx.status = 400;
    ctx.body = { errors: mapErrors(err.errors) };
  }

};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const { user } = ctx;

  if (!user) {
    ctx.throw(401, 'Необходимо авторизоваться.');
  }

  const orders = await Order.find({ user: { _id: ctx.user._id } });
  ctx.body = { orders };
};
