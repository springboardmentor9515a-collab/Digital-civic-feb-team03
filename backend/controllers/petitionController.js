<<<<<<< HEAD
const Petition = require("../models/Petition.js");
const User = require("../models/user.js");

// CREATE Petition (Auth required, Citizen only)
exports.createPetition = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ 
        message: "All fields are required: title, description, category, location" 
      });
    }

    // Create petition with creator ID
    const petition = await Petition.create({
      title,
      description,
      category,
      location,
      creator: req.user._id
    });

    // Populate creator info for response
    await petition.populate('creator', 'name email location');

    res.status(201).json(petition);
  } catch (error) {
    console.error('Create petition error:', error);
=======
import Petition from "../models/Petition.js";

// CREATE Petition
export const createPetition = async (req, res) => {
  try {
    const petition = await Petition.create(req.body);
    res.status(201).json(petition);
  } catch (error) {
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
    res.status(500).json({ message: error.message });
  }
};

<<<<<<< HEAD
// GET All Petitions (Public endpoint with filters)
exports.getPetitions = async (req, res) => {
  try {
    const { location, category, status, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (location) filter.location = new RegExp(location, 'i');
    if (category) filter.category = category;
    if (status) filter.status = status;

    // Pagination
    const skip = (page - 1) * limit;
    
    const petitions = await Petition.find(filter)
      .populate('creator', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Petition.countDocuments(filter);

    res.json({
      petitions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPetitions: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get petitions error:', error);
=======
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
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
    res.status(500).json({ message: error.message });
  }
};

// GET Single Petition
<<<<<<< HEAD
exports.getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('creator', 'name email location')
      .populate('signatures.user', 'name location');
=======
export const getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a

    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

<<<<<<< HEAD
    // Add signature count
    const petitionData = petition.toObject();
    petitionData.signatureCount = petition.signatures.length;

    res.json(petitionData);
  } catch (error) {
    console.error('Get petition by ID error:', error);
=======
    res.json(petition);
  } catch (error) {
>>>>>>> 84b2565ce2f335c23ecbafd0118031e76927295a
    res.status(500).json({ message: error.message });
  }
};