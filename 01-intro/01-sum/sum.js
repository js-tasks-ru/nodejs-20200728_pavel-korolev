const isNumber = (value) => {
  return typeof value === 'number'
    && !Number.isNaN(value)
    && ![Infinity, -Infinity].includes(value);
};

const sum = function(a, b) {
  const isValid = [a, b].every(val => isNumber(val));

  if (!isValid) {
    throw new TypeError('Only numbers are accepted.');
  }

  return a + b;
}

module.exports = sum;
