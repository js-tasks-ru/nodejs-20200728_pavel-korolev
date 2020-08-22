module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test') ?
      'mongodb://localhost:27017' :
      'mongodb://localhost/any-shop',
  },
};
