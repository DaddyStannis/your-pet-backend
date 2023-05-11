import express from "express";

import { schemas } from "../../models/notice.js";
import noticesControllers from "../../controllers/notices-controllers.js";
import { authenticate, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

router.get("/find/byTitle")

router.get("/find/byCategory")

router.get("/find/:noticeId")

router.patch("/:noticeId/favorite")

router.get("/favorite", authenticate)

router.post("/", authenticate)

router.get("/:userId", authenticate)

router.delete("/:noticeId", authenticate)

export default router;