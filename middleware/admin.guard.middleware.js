// Chỉ cho phép admin được truy cập
module.exports = (req, res, next) => {
  // mặc định sẽ bỏ qua middleware này ở chế độ dev
  if (req.app.get('env') === 'development') return next()

  if (req.user?.username !== 'admin') {
    req.flash('error', 'Quyền truy cập bị từ chối')
    return res.redirect('/');
  }

  return next();
}
