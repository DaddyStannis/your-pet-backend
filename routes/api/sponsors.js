import express from "express";
import controllers from "../../controllers/sponsors.js";

const router = express.Router();

router.get("/", controllers.getSponsors);

export default router;
