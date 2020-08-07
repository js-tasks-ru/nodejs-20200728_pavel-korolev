const stream = require('stream');
const { EOL } = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;

    // кеш для chunk без EOL в виде строки
    this.cache = '';
  }

  _transform(chunk, encoding, callback) {
    // собираем строку из прошлых chunk без EOL и текущего chunk
    const str = `${this.cache}${chunk.toString(this.encoding)}`;

    if (!str.includes(EOL)) {
      // если в полученной строке нет EOL, то обновляем кеш
      this.cache = `${str}`;
    } else {
      // если есть EOL, то разбиваем строку на массив
      const lines = str.split(EOL);

      lines.forEach((line, index) => {
        if (line) {
          if (index === lines.length - 1) {
            // если осталась последняя непустая line,
            // значит у строки остался "хвост" — кешируем его
            this.cache = `${line}`;
          } else {
            // все line, которые полностью разбились, отдаем в буфер стрима
            this.push(line);
          }
        } else {
          // если будет пустая line, значит строка оканчивалась на EOL и
          // была целиком разбита — очищаем кеш.
          this.cache = '';
        }
      });
    }

    callback();
  }

  _flush(callback) {
    if (this.cache) {
      // если что-то осталось в кеше, то отдаем в буфер как последнюю line
      // и очищаем кеш
      this.push(this.cache);
      this.cache = '';
    }
    callback();
  }
}

module.exports = LineSplitStream;
