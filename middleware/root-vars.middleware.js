/**
 * mount __dirname into *req.vars*
 * */
module.exports = function rootVars(req, res, next) {
  req.vars = { root: __dirname };
  next();
};
