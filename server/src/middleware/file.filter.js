
const fileFilter = (mimetypes) => {
  function filter(req, file, cb) {
    const mimetype = file.mimetype;
    if (mimetypes.includes(mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      let error = new Error("Invalid file type format.");
      error.statusCode = 400;
      cb(error);
    }
  }
  return filter;
}

module.exports = fileFilter;