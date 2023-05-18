import express from "express";

import { schemas } from "../../models/notice.js";
import noticesControllers from "../../controllers/notices-controllers.js";
import {
  authenticate,
  authenticateIfHasToken,
  isValidId,
  upload,
} from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

// для отримання оголошень по заголовку та по категоріям
router.get("/", authenticateIfHasToken, noticesControllers.listNotices);

// для отримання оголошень авторизованого кристувача створених цим же користувачем ++
router.get("/my", authenticate, noticesControllers.getUserNotices);

// для отримання одного оголошення ++ (in some reason the function "isValidId" is not working)
router.get(
  "/:id",
  isValidId,
  authenticateIfHasToken,
  noticesControllers.getNoticeById
);

// для додавання оголошень відповідно до обраної категорії ++
router.post(
  "/",
  authenticate,
  upload.single("file"),
  validateBody(schemas.addNoticeSchema),
  noticesControllers.addNotice
);

// для видалення оголошення авторизованого користувача створеного цим же користувачем ++ (how to remove just users notices??)
router.delete("/:id", authenticate, isValidId, noticesControllers.removeNotice);

export default router;

