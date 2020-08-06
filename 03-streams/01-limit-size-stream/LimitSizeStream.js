const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    this.size = this.size + chunk.length;

    if (this.size > this.limit) {
      const message = `Limit exceeded by ${this.size - this.limit} bytes`;
      return callback(new LimitExceededError(message));
    }

    return callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
