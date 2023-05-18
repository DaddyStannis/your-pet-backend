import express from "express"

import { schemas } from "../../models/notice.js"
import noticesControllers from "../../controllers/notices-controllers.js"
import { authenticate, isValidId } from "../../middlewares/index.js"
import { validateBody } from "../../decorators/index.js"
import uploadCloud from "../../middlewares/uploadCloud.cjs"

const router = express.Router()

// для отримання оголошень по заголовку та по категоріям
router.get("/", noticesControllers.listNotices)

// для отримання оголошень авторизованого кристувача створених цим же користувачем ++
router.get("/my", authenticate, noticesControllers.getUserNotices)

// для отримання одного оголошення ++ (in some reason the function "isValidId" is not working)
router.get("/:id", isValidId, noticesControllers.getNoticeById)

// для додавання оголошень відповідно до обраної категорії ++
router.post(
  "/",
  authenticate,
  uploadCloud.single("file"),
  validateBody(schemas.addNoticeSchema),
  noticesControllers.addNotice
);

// для видалення оголошення авторизованого користувача створеного цим же користувачем ++ (how to remove just users notices??)
router.delete("/:id", authenticate, isValidId, noticesControllers.removeNotice)

export default router
