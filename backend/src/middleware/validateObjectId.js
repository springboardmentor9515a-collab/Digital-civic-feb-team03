const mongoose = require("mongoose");

const validateObjectIdParam = (paramName = "id") => (req, res, next) => {
  const idValue = req.params[paramName];

  if (!mongoose.Types.ObjectId.isValid(idValue)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ${paramName} parameter`,
    });
  }

  return next();
};

module.exports = {
  validateObjectIdParam,
};
