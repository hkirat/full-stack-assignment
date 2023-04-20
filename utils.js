const isBlank = (str) => (!str || !str.trim());

const generateToken = (email, password) =>
  `${Math.random() * 100000000000000}.${email}_encrypted.${password}_encrypted`;

module.exports = {
  isBlank,
  generateToken
};