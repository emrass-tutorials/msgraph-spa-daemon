module.exports = (req, res, next) => {
  // Read any flashed errors and save
  // in the response locals
  res.locals.error = req.flash("error_msg");

  // Check for simple error string and
  // convert to layout's expected format
  const errs = req.flash("error");
  for (let i in errs) {
    res.locals.error.push({ message: "An error occurred", debug: errs[i] });
  }

  next();
};
