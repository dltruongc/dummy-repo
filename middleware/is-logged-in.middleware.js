/**
 * Kiểm tra xem có thông tin đăng nhập hay chưa
 */
module.exports = function isLoggedInMiddleware(req, res, next) {
  const user = req.session.user;
  if (!user || !Object.keys(user).length)
    return next(
      500,
      'Bạn đang không đăng nhập hoặc phiên đăng nhập đã hết hạn'
    );

  req.user = user;

  return next();
};
