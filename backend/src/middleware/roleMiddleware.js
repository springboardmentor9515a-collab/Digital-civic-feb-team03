// Role-based middleware functions

const isCitizen = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Access denied. User not authenticated." });
  }

  if (req.user.role !== "citizen") {
    return res.status(403).json({ message: "Access denied. Citizen role required." });
  }

  next();
};

const isOfficial = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Access denied. User not authenticated." });
  }

  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied. Official role required." });
  }

  next();
};

module.exports = {
  isCitizen,
  isOfficial,
};
