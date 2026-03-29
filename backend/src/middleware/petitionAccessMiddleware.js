const Petition = require("../models/Petition");

const normalizeLocation = (location) => (location || "").trim().toLowerCase();

const enforcePetitionLocationAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user.location) {
      return res.status(403).json({
        success: false,
        message: "User location is required to access this petition",
      });
    }

    const petition = await Petition.findById(req.params.id).select(
      "location status",
    );

    if (!petition) {
      return res.status(404).json({
        success: false,
        message: "Petition not found",
      });
    }

    const userLocation = normalizeLocation(req.user.location);
    const petitionLocation = normalizeLocation(petition.location);

    if (userLocation !== petitionLocation) {
      return res.status(403).json({
        success: false,
        message: "You can only access petitions for your location",
      });
    }

    req.petition = petition;
    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  enforcePetitionLocationAccess,
};
