import express from "express";
import controllers from "../../controllers/news.js";

const router = express.Router();

router.get("/", controllers.getNews);

export default router;
