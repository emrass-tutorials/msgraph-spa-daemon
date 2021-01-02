module.exports = (req, res, next) => {
  // Check for an authenticated user and load
  // into response locals
  if (req.session.userId) {
    res.locals.user = req.app.locals.users[req.session.userId];
  }

  next();
};
