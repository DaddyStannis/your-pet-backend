import express from "express";

import { schemas } from "../../models/notice.js";
import noticesControllers from "../../controllers/notices-controllers.js";
import { authenticate, isValidId, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

// для пошуку оголошеннь по заголовку ++ (also it work not for full title but just for one keyword)
router.get("/find/byTitle", noticesControllers.getNoticesByTitleandKeyword);

// для отримання оголошень по категоріям ++
router.get("/find/byCategory", noticesControllers.getNoticesByCategory);

// для отримання оголошень по заголовку та по категоріям
router.get("/find", noticesControllers.findNotices);

// для отримання одного оголошення ++ (in some reason the function "isValidId" is not working)
router.get("/find/:noticeId", noticesControllers.getNoticeById);

// для додавання оголошень відповідно до обраної категорії ++
router.post(
  "/",
  authenticate,
  upload.single("photoURL"),
  validateBody(schemas.addNoticeSchema),
  noticesControllers.addNotice
);

// для отримання оголошень авторизованого кристувача створених цим же користувачем ++
router.get("/", authenticate, noticesControllers.listNotices);

// для отримання всіх оголошень
router.get("/all", noticesControllers.allListNotices);

// для видалення оголошення авторизованого користувача створеного цим же користувачем ++ (how to remove just users notices??)
router.delete("/:noticeId", authenticate, noticesControllers.removeNotice);

export default router;
