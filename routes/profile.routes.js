const express = require("express");
const router = express.Router();
const {
  getProfiles,
  searchProfiles,
  createProfile,
  getProfileById,
  deleteProfile,
} = require("../controllers/profile.controller");

const { validateQuery } = require("../middlewares/QueryValidation.middleware");

router.get("/profiles", validateQuery, getProfiles);
router.get("/profiles/search", validateQuery, searchProfiles);
router.post("/profiles", createProfile);
router.get("/profiles/:id", getProfileById);
router.delete("/profiles/:id", deleteProfile);

module.exports = router;
