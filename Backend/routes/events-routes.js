const express = require("express");
const { verifytoken } = require("../controllers/Auth/auth-controller");
const { isAdmin } = require("../controllers/Validators/Auth/validators");
const { addEvents, getEvents, getEvent, updateEvent, deleteEvent, isApplied, apply, markAttendance, userRegisteredEvents, userAttendedEvents } = require("../controllers/Events/events-controller");

const router = express.Router();

router.post("/add", verifytoken, isAdmin, addEvents);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.delete("/:id", deleteEvent);
router.put("/:eventId", verifytoken, isAdmin, updateEvent);
router.get("/applied/:id", verifytoken, isApplied);
router.get("/apply/:id", verifytoken, apply);
router.post("/mark/:eventId/:userId", markAttendance);
router.post("/reg", verifytoken, userRegisteredEvents);
router.post("/attended", verifytoken, userAttendedEvents);

module.exports = router;