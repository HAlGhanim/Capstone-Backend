exports.imageConditional = (req, res, next) => {
  if (req.file) {
    req.body.image = `media/${req.file.filename}`;
    next();
  } else {
    // req.body.image = "";
    next();
  }
};
