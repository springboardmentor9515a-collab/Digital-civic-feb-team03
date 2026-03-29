const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

//////////////////////////////////////////////////////
// 1. SIGN PETITION
//////////////////////////////////////////////////////

const signPetition = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const userId = req.user._id; // ⚠ IMPORTANT CHANGE

    const petition = req.petition || (await Petition.findById(petitionId));

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.status !== "active") {
      return res.status(400).json({ message: "Petition is not active" });
    }

    const existingSignature = await Signature.findOne({
      petition: petitionId,
      user: userId,
    });

    if (existingSignature) {
      return res.status(400).json({ message: "Already signed this petition" });
    }

    const signature = await Signature.create({
      petition: petitionId,
      user: userId,
    });

    res.status(201).json({
      message: "Petition signed successfully",
      signature,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////
// 2. GET SIGNATURE COUNT
//////////////////////////////////////////////////////

const getSignatureCount = async (req, res) => {
  try {
    const petitionId = req.params.id;

    const count = await Signature.countDocuments({
      petition: petitionId,
    });

    res.status(200).json({
      petitionId,
      signatureCount: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signPetition,
  getSignatureCount,
};
