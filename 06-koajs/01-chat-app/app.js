const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

let subscriptions = [];

router.get('/subscribe', async (ctx, next) => {
  const getMessage = () => new Promise((resolve) => {
    subscriptions.push(resolve);
  });
  const message = await getMessage();
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const { message } = ctx.request.body;

  if (message) {
    subscriptions.forEach(resolve => resolve(message));
    subscriptions.length = 0;
  }

  ctx.body = 'OK';
});

app.use(router.routes());

module.exports = app;
