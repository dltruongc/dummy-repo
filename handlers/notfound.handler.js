const createError = require('http-errors');

module.exports = (_req, res, next) => {
  res.locals.title = 'Trang không tìm thấy';
  return next(
    createError(404, 'Chúng tôi không thể tìm thấy trang bạn yêu cầu!')
  );
};
