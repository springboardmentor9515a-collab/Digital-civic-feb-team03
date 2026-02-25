import Petition from "../models/Petition.js";

// CREATE Petition
export const createPetition = async (req, res) => {
  try {
    const petition = await Petition.create(req.body);
    res.status(201).json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET All Petitions (with filters)
export const getPetitions = async (req, res) => {
  try {
    const { location, category, status } = req.query;

    let filter = {};

    if (location) filter.location = location;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const petitions = await Petition.find(filter).sort({ createdAt: -1 });

    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Single Petition
export const getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};