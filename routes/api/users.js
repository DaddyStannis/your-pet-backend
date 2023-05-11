import express from "express";

import { schemas } from "../../models/users.js";
import controllers from "../../controllers/users.js";
import { authenticate, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  controllers.register
);

router.post("/login", validateBody(schemas.loginSchema), controllers.login);

router.post("/logout", authenticate, controllers.logout);

router.get(
  "/current",
  validateBody(schemas.refreshSchema),
  controllers.current
);

router.get("/me", authenticate, controllers.getUserInfo);

router.patch("/me", authenticate, controllers.updateUserInfo);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  controllers.updateAvatar
);

export default router;
