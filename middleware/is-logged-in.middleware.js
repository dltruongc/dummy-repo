const createHttpError = require('http-errors');

/**
 * Kiểm tra xem có thông tin đăng nhập hay chưa
 */
module.exports = function isLoggedInMiddleware(req, res, next) {
  // const user = {
  //   username: '1234567890',
  //   name: 'Tớ hận cậU',
  //   tel: '0123456789',
  //   id: 1,
  // };
  const user = req.session.user;
  if (!user || !Object.keys(user).length)
    return next(
      createHttpError(
        500,
        'Bạn đang không đăng nhập hoặc phiên đăng nhập đã hết hạn'
      )
    );

  req.user = user;

  return next();
};
