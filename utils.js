function genRandomString() {
  let stringSize = 20;
  let string = "";
  for (let i = 0; i < stringSize; i++) {
    const randNum = Math.floor(Math.random() * 93) + 33;
    string += String.fromCharCode(randNum);
  }
  return string;
}

module.exports = { genRandomString };
