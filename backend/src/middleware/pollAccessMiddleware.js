const Poll = require("../models/Poll");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeLocation = (location) => (location || "").trim();

const attachLocationFilter = (req, res, next) => {
  if (!req.user || !req.user.location) {
    return res.status(403).json({
      success: false,
      message: "User location is required to access polls",
    });
  }

  const normalizedLocation = normalizeLocation(req.user.location);

  req.locationFilter = {
    targetLocation: new RegExp(`^${escapeRegExp(normalizedLocation)}$`, "i"),
  };

  return next();
};

const enforcePollLocationAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user.location) {
      return res.status(403).json({
        success: false,
        message: "User location is required to access this poll",
      });
    }

    const poll = await Poll.findById(req.params.id).select("targetLocation");

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    const userLocation = normalizeLocation(req.user.location).toLowerCase();
    const pollLocation = normalizeLocation(poll.targetLocation).toLowerCase();

    if (userLocation !== pollLocation) {
      return res.status(403).json({
        success: false,
        message: "You can only access polls for your location",
      });
    }

    req.poll = poll;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  attachLocationFilter,
  enforcePollLocationAccess,
};
