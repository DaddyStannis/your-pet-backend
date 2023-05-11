import express from "express";

import { schemas } from "../../models/notice.js";
import noticesControllers from "../../controllers/notices-controllers.js";
import { authenticate, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";

const router = express.Router();

// створити ендпоінт для пошуку оголошеннь по заголовку
router.get("/find/byTitle")

// створити ендпоінт для отримання оголошень по категоріям
router.get("/find/byCategory")

// створити ендпоінт для отримання одного оголошення
router.get("/find/:noticeId")

// створити ендпоінт для додавання оголошення до обраних
// створити ендпоінт для видалення оголошення авторизованого користувача доданих цим же до обраних
router.patch("/:noticeId/favorite")

// створити ендпоінт для отримання оголошень авторизованого користувача доданих ним же в обрані
router.get("/favorite", authenticate)

// створити ендпоінт для додавання оголошень відповідно до обраної категорії
router.post("/", authenticate)

// створити ендпоінт для отримання оголошень авторизованого кристувача створених цим же користувачем
router.get("/:userId", authenticate)

// створити ендпоінт для видалення оголошення авторизованого користувача створеного цим же користувачем 
router.delete("/:noticeId", authenticate)

// ADDITIONALY I`M NOT SURE THAT WE NEED THIS
// CREATED ENDPOINT FOR EDIT YOUR NOTICE
router.put('/:noticeId', authenticate)

export default router;