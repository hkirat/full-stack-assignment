module.exports = (fn) => {
  console.log(fn);
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
