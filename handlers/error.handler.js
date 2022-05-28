module.exports = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.title = err.title || 'Có lỗi xảy ra';
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  return res.status(err.status || 500).render('error');
};
