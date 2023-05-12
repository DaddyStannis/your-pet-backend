import express from "express";

import { schemas } from "../../models/notice.js";
import noticesControllers from "../../controllers/notices-controllers.js";
import { authenticate, isValidId, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

// створити ендпоінт для пошуку оголошеннь по заголовку ++ (also it work not for full title but just for one keyword)
router.get("/find/byTitle", noticesControllers.getNoticesByTitleandKeyword)

// створити ендпоінт для отримання оголошень по категоріям ++
router.get("/find/byCategory", noticesControllers.getNoticesByCategory)

// створити ендпоінт для отримання оголошень по заголовку та по категоріям 
router.get("/find", noticesControllers.findNotices)

// створити ендпоінт для отримання одного оголошення ++ (in some reason the function "isValidId" is not working)
router.get("/find/:noticeId", noticesControllers.getNoticeById)

// створити ендпоінт для додавання оголошення до обраних ++
// створити ендпоінт для видалення оголошення авторизованого користувача доданих цим же до обраних ++ (in some reason the function "isValidId" is not working)
router.patch("/favorite/:noticeId", validateBody(schemas.patchNoticeFavoriteSchema), noticesControllers.updateFavoriteNotice)

// створити ендпоінт для отримання оголошень авторизованого користувача доданих ним же в обрані ++
router.get("/favorite", authenticate, noticesControllers.listFavoriteNotices)

// створити ендпоінт для додавання оголошень відповідно до обраної категорії ++
router.post("/", authenticate, upload.single("file"), validateBody(schemas.addNoticeSchema), noticesControllers.addNotice)

// створити ендпоінт для отримання оголошень авторизованого кристувача створених цим же користувачем ++
router.get("/", authenticate, noticesControllers.listNotices)

// створити ендпоінт для видалення оголошення авторизованого користувача створеного цим же користувачем ++ (how to remove just users notices??)
router.delete("/:noticeId", authenticate, noticesControllers.removeNotice)

export default router;