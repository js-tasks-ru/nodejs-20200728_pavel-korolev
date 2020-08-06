const stream = require('stream');
const { EOL } = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    this.data = this.data + chunk.toString(this.encoding);
    callback();
  }

  _flush(callback) {
    this.data.split(EOL).forEach(str => this.push(str));
    this.data = '';
    callback();
  }
}

module.exports = LineSplitStream;
